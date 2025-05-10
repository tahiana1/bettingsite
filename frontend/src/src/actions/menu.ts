import { gql } from "@apollo/client";

export const GET_USER_MENU = gql`
  query GetUserMenus {
    response: getUserMenus {
      id
      label
      key
      path
      icon
      orderNum
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const GET_MENUS = gql`
  query GetMenus(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getMenus(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      menus {
        id
        label
        key
        icon
        path
        parentId
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
export const CREATE_MENU = gql`
  mutation NewMenu($input: NewMenuInput!) {
    response: createMenu(input: $input) {
      id
      label
      key
      path
      parentId
      orderNum
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const UPDATE_MENU = gql`
  mutation UpdateMenu($id: ID!, $input: UpdateMenuInput!) {
    response: updateMenu(id: $id, input: $input) {
      id
      label
      key
      path
      parentId
      orderNum
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const DELETE_MENU = gql`
  mutation DeleteMenu($id: ID!) {
    response: deleteMenu(id: $id)
  }
`;
