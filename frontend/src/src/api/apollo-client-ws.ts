import { split, ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { setContext } from "@apollo/client/link/context";
import { createClient } from "graphql-ws";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { getMainDefinition } from "@apollo/client/utilities";
import { apolloWSURL } from ".";


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
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
