import { gql } from "@apollo/client";

export const GET_LATEST_BULLETINS = gql`
  query GetLatestBulletins {
    bulletins {
      id
      title
      category
      nickname
      description
      recommend
      notrecommend
      level
      status
      memberId
      alllas
      top
      check
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
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
export const GET_BULLETINS = gql`
  query GetBulletins(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getBulletins(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      bulletins {
        id
        title
        category
        nickname
        description
        recommend
        memberId
        notrecommend
        level
        status
        alllas
        top
        check
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
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_BULLETIN = gql`
  mutation NewBulletin($input: NewBulletinInput!) {
    response: createBulletin(input: $input) {
      id
      title
      description
      category
      nickname
      recommend
      notrecommend
      level
      alllas
      memberId
      top
      check
      domainId
      domain {
        id
        name
      }
    }
  }
`;

export const UPDATE_BULLETIN = gql`
  mutation UpdateBulletin($id: ID!, $input: UpdateBulletinInput!) {
    response: updateBulletin(id: $id, input: $input) {
      id
      title
      description
      category
      nickname
      recommend
      notrecommend
      level
      alllas
      memberId
      top
      check
      domainId
      domain {
        id
        name
      }
      updatedAt
      createdAt
      deletedAt
    }
  }
`;

export const DELETE_BULLETIN = gql`
  mutation DeleteBulletin($id: ID!) {
    response: deleteBulletin(id: $id)
  }
`;