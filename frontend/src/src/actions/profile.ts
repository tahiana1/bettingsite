import { gql } from "@apollo/client";

export const GET_PROFILE = gql`
  query GetProfile {
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
      favorites
      coupon
      lastDeposit
      lastWithdraw
      referral
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($id: ID!, $input: UpdateProfile!) {
    response: updateProfile(id: $id, input: $input) {
      id
      userId
      name
      nickname
      bankName
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
      avatarUrl
      bio
      socialLinks
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
