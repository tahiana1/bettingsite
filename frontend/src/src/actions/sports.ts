import { gql } from "@apollo/client";

export const FILTER_SPORTS = gql`
  query GetSports(
    $filters: [Filter!]
    $pagination: Pagination
  ) {
    response: getSports(
      filters: $filters
      pagination: $pagination
    ) {
      sports {
        id
        code
        name
        enName
        icon
        instantMsg
        orderNum
        showYn
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_SPORTS = gql`
  mutation NewSports($input: NewSportsInput!) {
    response: createSports(input: $input) {
      id
      code
      name
      enName
      icon
      instantMsg
      orderNum
      showYn
      createdAt
      updatedAt
      deletedAt
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const UPDATE_SPORTS = gql`
  mutation UpdateSports($id: ID!, $input: UpdateSportsInput!) {
    response: updateSports(id: $id, input: $input) {
      id
      code
      name
      enName
      icon
      instantMsg
      orderNum
      showYn
      createdAt
      updatedAt
      deletedAt
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const DELETE_SPORTS = gql`
  mutation DeleteSports($id: ID!) {
    response: deleteSports(id: $id)
  }
`;
