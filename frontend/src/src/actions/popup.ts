import { gql } from "@apollo/client";


export const FILTER_POPUP = gql`
  query GetPopups(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getPopups(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      popups {
        id
        title
        description
        orderNum
        status
        displayType
        showOn
        width
        height
        registerDate
        showFrom
        showTo
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_POPUP = gql`
  mutation NewPopup($input: NewPopupInput!) {
    response: createPopup(input: $input) {
      id
      title
      description
      orderNum
      status
      displayType
      showOn
      width
      height
      registerDate
      showFrom
      showTo
    }
  }
`;

export const UPDATE_POPUP = gql`
  mutation UpdatePopup($id: ID!, $input: UpdatePopupInput!) {
    response: updatePopup(id: $id, input: $input) {
      id
      title
      description
      orderNum
      status
      displayType
      showOn
      width
      height
      registerDate
      showFrom
      showTo
      updatedAt
      createdAt
      deletedAt
    }
  }
`;

export const DELETE_POPUP = gql`
  mutation DeletePopup($id: ID!) {
    response: deletePopup(id: $id)
  }
`;