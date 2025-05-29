import { gql } from "@apollo/client";

export const GET_LATEST_ANNOUNCEMENTS = gql`
  query GetLatestAnnouncements {
    announcements {
      id
      title
      description
      orderNum
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
export const GET_ANNOUNCEMENTS = gql`
  query GetAnnouncements(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getAnnouncements(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      announcements {
        id
        title
        description
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

export const CREATE_ANNOUNCEMENT = gql`
  mutation NewAnnouncement($input: NewAnnouncementInput!) {
    response: createAnnouncement(input: $input) {
      id
      title
      description
    }
  }
`;

export const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: ID!, $input: UpdateAnnouncementInput!) {
    response: updateAnnouncement(id: $id, input: $input) {
      id
      title
      orderNum
      description
      status
      updatedAt
      createdAt
      deletedAt
    }
  }
`;

export const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($id: ID!) {
    response: deleteAnnouncement(id: $id)
  }
`;
