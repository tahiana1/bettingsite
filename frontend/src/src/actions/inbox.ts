import { gql } from "@apollo/client";

export const GET_INBOXES = gql`
  query GetInboxes(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getInboxes(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      inboxes {
        id
        title
        description
        orderNum
        status
        userId
        user {
          id
          userid
        }
        openedAt
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_INBOX = gql`
  mutation NewInbox($input: NewInboxInput!) {
    response: createInbox(input: $input) {
      id
      title
      description
      orderNum
      status
      openedAt
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const UPDATE_INBOX = gql`
  mutation UpdateInbox($id: ID!, $input: UpdateInboxInput!) {
    response: updateInbox(id: $id, input: $input) {
      id
      title
      description
      orderNum
      status
      openedAt
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const DELETE_INBOX = gql`
  mutation DeleteInbox($id: ID!) {
    response: deleteInbox(id: $id)
  }
`;
