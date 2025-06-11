import { gql } from "@apollo/client";

export const FILTER_LEAGUES = gql`
  query GetLeagues(
    $filters: [Filter!]
    $pagination: Pagination
  ) {
    response: getLeague(
      filters: $filters
      pagination: $pagination
    ) {
      leagues {
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

export const CREATE_LEAGUE = gql`
  mutation NewLeague($input: NewLeagueInput!) {
    response: createLeague(input: $input) {
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

export const UPDATE_LEAGUE = gql`
  mutation UpdateLeague($id: ID!, $input: UpdateLeagueInput!) {
    response: updateLeague(id: $id, input: $input) {
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

export const DELETE_LEAGUE = gql`
  mutation DeleteLeague($id: ID!) {
    response: deleteLeague(id: $id)
  }
`;
