import { gql } from "@apollo/client";

export const GET_TOP_EVENT = gql`
  query GetTopEvents {
    response: topEvents {
      id
      title
      description
      orderNum
      status
      showFrom
      showTo
      type
      domainId
      domain {
        id
        name
      }
      userId
      user {
        id
        name
        userid
      }
      level
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
export const FILTER_EVENT = gql`
  query GetEvents(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getEvents(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      events {
        id
        title
        description
        orderNum
        status
        showFrom
        showTo
        imageUpload
        category
        type
        views
        domainId
        userId  
        user {
          id
          name
          userid
        }
        createdDate
        level
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation NewEvent($input: NewEventInput!) {
    response: createEvent(input: $input) {
      id
      title
      category
      views
      createdDate
      showFrom
      showTo
      description
      mainImage
      imageUpload
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    response: updateEvent(id: $id, input: $input) {
      id
      title
      showFrom
      showTo
      orderNum
      description
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    response: deleteEvent(id: $id)
  }
`;
