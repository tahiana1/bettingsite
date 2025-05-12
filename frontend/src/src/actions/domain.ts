import { gql } from "@apollo/client";

export const GET_DOMAINS = gql`
  query GetDomains(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getDomains(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      domains {
        id
        name
        description
        orderNum
        autoReg
        status
        user {
          id
          name
          userid
        }
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_DOMAIN = gql`
  mutation NewDomain($input: NewDomainInput!) {
    response: createDomain(input: $input) {
      id
      name
      description
      orderNum
      autoReg
      status
      user {
        id
        name
        userid
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const UPDATE_DOMAIN = gql`
  mutation UpdateDomain($id: ID!, $input: UpdateDomainInput!) {
    response: updateDomain(id: $id, input: $input) {
      id
      name
      description
      orderNum
      autoReg
      status
      user {
        id
        name
        userid
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const DELETE_DOMAIN = gql`
  mutation DeleteDomain($id: ID!) {
    response: deleteDomain(id: $id)
  }
`;
