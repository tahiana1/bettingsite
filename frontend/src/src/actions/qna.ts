import { gql } from "@apollo/client";

export const FILTER_QNAS = gql`
  query GetQnas(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getQnas(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      qnas {
        id
        user {
          id
          userid
          profile {
            id
            level
            nickname
          }
          rootId
          root {
            id
            userid
          }
          parentId
          parent {
            id
            userid
          }
        }
        question
        answer
        status
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_QNA = gql`
  mutation NewQna($input: NewQnaInput!) {
    response: createQna(input: $input) {
      id
      user {
        id
        userid
        profile {
          id
          level
          nickname
        }
        rootId
        root {
          id
          userid
        }
        parentId
        parent {
          id
          userid
        }
      }
      question
      answer
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const UPDATE_QNA = gql`
  mutation UpdateQna($id: ID!, $input: UpdateQnaInput!) {
    response: updateQna(id: $id, input: $input) {
      id
      user {
        id
        userid
        profile {
          id
          level
          nickname
        }
        rootId
        root {
          id
          userid
        }
        parentId
        parent {
          id
          userid
        }
      }
      question
      answer
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const DELETE_QNA = gql`
  mutation DeleteQna($id: ID!) {
    response: deleteQna(id: $id)
  }
`;
