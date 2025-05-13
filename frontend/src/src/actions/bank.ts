import { gql } from "@apollo/client";

export const FILTER_BANK = gql`
  query GetBanks(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getBanks(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      banks {
        id
        name
        orderNum
        status
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_BANK = gql`
  mutation NewBank($input: NewBankInput!) {
    response: createBank(input: $input) {
      id
      name
      orderNum
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const UPDATE_BANK = gql`
  mutation UpdateBank($id: ID!, $input: UpdateBankInput!) {
    response: updateBank(id: $id, input: $input) {
      id
      name
      orderNum
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const DELETE_BANK = gql`
  mutation DeleteBank($id: ID!) {
    response: deleteBank(id: $id)
  }
`;
