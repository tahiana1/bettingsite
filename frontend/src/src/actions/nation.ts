import { gql } from "@apollo/client";

export const FILTER_NATION = gql`
  query GetNations(
    $filters: [Filter!]
    $pagination: Pagination
  ) {
    response: getNations(
      filters: $filters
      pagination: $pagination
    ) {
      nations {
        id
        code
        name
        enName
        alias
        flag
        orderNum
        Leagues {
          id
        }
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_NATION = gql`
  mutation NewNation($input: NewNationInput!) {
    response: createNation(input: $input) {
      id
      code
      name
      enName
      alias
      flag
      orderNum
      Leagues
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const UPDATE_NATION = gql`
  mutation UpdateNation($id: ID!, $input: UpdateNationInput!) {
    response: updateNation(id: $id, input: $input) {
      id
      code
      name
      enName
      alias
      flag
      orderNum
      Leagues
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const DELETE_NATION = gql`
  mutation DeleteNation($id: ID!) {
    response: deleteNation(id: $id)
  }
`;
