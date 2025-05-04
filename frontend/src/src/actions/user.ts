import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      userid
      role
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
  }
`;

export const FILTER_USERS = gql`
  query FilterUsers(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    filterUsers(filters: $filters, orders: $orders, pagination: $pagination) {
      users {
        id
        name
        userid
        role
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
export const APPROVE_USER = gql`
  mutation ApproveUser($id: ID!) {
    success: approveUser(id: $id)
  }
`;

export const BLOCK_USER = gql`
  mutation BlockUser($id: ID!) {
    success: blockUser(id: $id)
  }
`;
