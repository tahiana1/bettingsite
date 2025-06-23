import { gql } from "@apollo/client";

export const FILTER_GAME_API = gql`
  query GetGameApis(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getGameApis(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      gameApis {
        id
        apiCompanyName
        gameApiName
        gameCompanyName
        gameType
        other
        whetherToUse
        order
        type
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_GAME_API = gql`
  mutation CreateGameApi($input: NewGameApiInput!) {
    response: createGameApi(input: $input) {
      id
      apiCompanyName
      gameApiName
      gameCompanyName
      gameType
      other
      whetherToUse
      order
      type
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const UPDATE_GAME_API = gql`
  mutation UpdateGameApi($id: ID!, $input: UpdateGameApiInput!) {
    response: updateGameApi(id: $id, input: $input) {
      id
      apiCompanyName
      gameApiName
      gameCompanyName
      gameType
      other
      whetherToUse
      order
      type
      createdAt
      updatedAt
      deletedAt
    }
  }
`; 