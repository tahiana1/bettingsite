import { gql } from "@apollo/client";

export const GET_LOGS = gql`
  query GetLogs(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getLogs(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      logs {
        id
        ip
        status
        phone
        path
        data
        userId
        user {
          id
          userid
        }
        createdAt
        updatedAt
      }
      total
    }
  }
`;
