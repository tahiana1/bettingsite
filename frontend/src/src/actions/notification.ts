import { gql } from "@apollo/client";

export const FILTER_NOTI = gql`
  query GetNotifications(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getNotifications(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      notifications {
        id
        title
        description
        orderNum
        status
        level
        domainId
        domain {
          id
          name
        }
        mainImage
        imageUpload
        noticeType
        registerDate
        views
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const CREATE_NOTI = gql`
  mutation NewNotification($input: NewNotificationInput!) {
    response: createNotification(input: $input) {
      id
      title
      description
      mainImage
      imageUpload
      noticeType
      registerDate
      views
    }
  }
`;

export const UPDATE_NOTI = gql`
  mutation UpdateNoti($id: ID!, $input: UpdateNotificationInput!) {
    response: updateNotification(id: $id, input: $input) {
      id
      title
      description
      mainImage
      imageUpload
      noticeType
      registerDate
      level
      orderNum
      views
      updatedAt
      createdAt
      deletedAt
    }
  }
`;

export const DELETE_NOTI = gql`
  mutation DeleteNotification($id: ID!) {
    response: deleteNotification(id: $id)
  }
`;
