import { gql } from "@apollo/client";

export const GET_ADMIN_PERMISSIONS = gql`
  query GetAdminPermissions(
    $filters: [Filter!]
    $orders: [Order!]
    $p: Pagination
  ) {
    response: adminPermissions(
      filters: $filters
      orders: $orders
      pagination: $p
    ) {
      adminPermissions {
        id
        ip
        game
        membership
        statistical
        financials
        userId
        qna
        settlement
        dwdelete
        sale
        status
        user {
          id
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

export const FILTER_ADMIN_PERMISSIONS = gql`
  query FilterAdminPermissions(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: filterAdminPermissions(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      users {
        id
        name
        userid
        role
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
        type
        blackMemo
        usdtAddress
        currentIP
        IP
        createdAt
        updatedAt
        status
        profile {
          id
          userId
          name
          nickname
          bankName
          holderName
          accountNumber
          birthday
          phone
          mobile
          balance
          point
          comp
          level
          favorites
          referral
          coupon
          lastDeposit
          lastWithdraw
        }
      }
      total
    }
  }
`;

export const UPDATE_ADMIN_PERMISSION = gql`
  mutation UpdateAdminPermission(
    $id: ID!
    $input: UpdateAdminPermissionInput!
  ) {
    success: updateAdminPermission(id: $id, input: $input) {
      id
      userId
    }
  }
`;
