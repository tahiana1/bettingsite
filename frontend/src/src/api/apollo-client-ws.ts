import { split, ApolloClient, InMemoryCache, from } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createClient } from "graphql-ws";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { getMainDefinition } from "@apollo/client/utilities";
import { apolloWSURL } from ".";
import { message as msg } from "antd";
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path /* extensions */ }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      msg.error(`[GraphQL error]: ${message} `);

      // Handle specific errors like UNAUTHENTICATED
      // if (extensions?.code === "UNAUTHENTICATED") {
      // For example, redirect to login
      // window.location.href = "/login";
      // }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // You can handle network errors here (e.g., show a toast, log out user, etc.)

    msg.error(`[Network error]: ${networkError}`);
  }
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: apolloWSURL + "/graphql",
  })
);

const uploadLink = createUploadLink({
  uri: "/api/v1/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === "OperationDefinition" && def.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(uploadLink)
);

const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache(),
});

export default client;
