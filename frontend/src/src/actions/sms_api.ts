import { gql } from "@apollo/client";

export const FILTER_SMS_API = gql`
  query GetSMSApis(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getSMSApis(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      smsApis {
        id
        name
        url
        agent
        password
        token
        status
        orderNum
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_SMS_API = gql`
  mutation NewSMSApi($input: NewSMSApiInput!) {
    response: createSMSApi(input: $input) {
      id
      name
      url
      agent
      password
      token
      status
      orderNum
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const UPDATE_SMS_API = gql`
  mutation UpdateSMSApi($id: ID!, $input: UpdateSMSApiInput!) {
    response: updateSMSApi(id: $id, input: $input) {
      id
      name
      url
      agent
      password
      token
      status
      orderNum
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const DELETE_SMS_API = gql`
  mutation DeleteSMSApi($id: ID!) {
    response: deleteSMSApi(id: $id)
  }
`;
