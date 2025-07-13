import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      userid
      type
      role
      usdtAddress
      currentIP
      IP
      createdAt
      updatedAt
      status
      blackMemo
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

export const CONNECTED_USERS = gql`
  query ConnectedUsers(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: connectedUsers(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      users {
        id
        name
        userid
        role
        type
        blackMemo
        usdtAddress
        currentIP
        IP
        parentId
        parent {
          id
          userid
        }
        rootId
        root {
          id
          userid
        }
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

export const GET_DISTRIBUTORS = gql`
  query GetDistributors(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getDistributors(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      users {
        id
        name
        userid
        role
        parentId
        parent {
          id
          userid
        }
        root {
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
        live
        slot
        hold
        entireLosing
        liveLosingBeDang
        slotLosingBeDang
        holdLosingBeDang
        losingMethod
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

export const FILTER_USERS = gql`
  query FilterUsers(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: filterUsers(
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

export const CREATE_USER = gql`
  mutation NewUser($input: NewUser!) {
    success: createUser(input: $input)
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUser!) {
    success: updateUser(id: $id, input: $input)
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

export const GET_DISTRIBUTORSDETAILS = gql`
  query GetDistributorDetails(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getDistributorDetails(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      users {
        id
        name
        userid
        role
        parentId
        parent {
          id
          userid
        }
        root {
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
        
        # Rolling fields
        live
        slot
        hold
        
        # Losing fields
        entireLosing
        liveLosingBeDang
        slotLosingBeDang
        holdLosingBeDang
        losingMethod
        
        # Additional rolling fields for different game types
        miniDanpolRolling
        miniCombinationRolling
        sportsDanpolRolling
        sportsDupolRolling
        sports3PoleRolling
        sports4PoleRolling
        sports5PoleRolling
        sportsDapolRolling
        virtualGameRolling
        lotusRolling
        mgmRolling
        touchRolling
        
        # Financial statistics
        membershipDeposit
        membershipWithdrawal
        totalWithdrawal
        numberOfMembers
        rollingHoldings
        
        # Betting/Winning statistics
        liveBetting
        liveWinning
        slotBetting
        slotJackpot
        miniDanpolBetting
        miniDanpolWinner
        miniCombinationBetting
        miniCombinationWinnings
        sportsDanpolBetting
        sportsDanpolWinner
        sportsDupolBetting
        sportsDupolWinner
        sports3poleBetting
        sports3poleWinner
        sports4poleBetting
        sports4poleWinner
        sports5poleBetting
        sports5poleWinner
        sportsDapolBetting
        sportsDapolWinner
        virtualGameBetting
        virtualGameWinnings
        lotusBetting
        lotusLottery
        mgmBetting
        mgmWinning
        touchBetting
        touchWinning
        holdemBetting
        holdemWinning
        
        # Rolling statistics
        rollingRate
        rollingTransition
        
        # Losing statistics
        losingRate
        losingSettlement
        
        # Partnership statistics
        partnershipRolling
        partnershipMoneyInHand
        
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
          lastDeposit
          lastWithdraw
        }
      }
      total
    }
  }
`;
