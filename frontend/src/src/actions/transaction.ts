import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      id
      userId
      type
      amount

      balanceBefore
      balanceAfter

      pointBefore
      pointAfter

      status
      shortcut
      usdtDesc
      explation
      transactionAt
      approvedAt

      createdAt
      updatedAt
      deletedAt

      user {
        id
        name
        userid
        type
        role
        root {
          id
          userid
        }
        parent {
          id
          userid
        }
        usdtAddress
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
  }
`;

export const FILTER_TRANSACTIONS = gql`
  query FilterTransactions(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getTransactions(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      transactions {
        id
        userId
        type
        amount
        balanceBefore
        balanceAfter

        pointBefore
        pointAfter

        status
        shortcut
        usdtDesc
        transactionAt
        approvedAt

        createdAt
        updatedAt
        deletedAt

        user {
          id
          name
          userid
          type
          role
          usdtAddress
          status
          blackMemo
          live
          entireLosing
          root {
            id
            userid
          }
          parent {
            id
            userid
          }
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
      total
    }
  }
`;

export const GET_WEEK_LOSING_DATA = gql`
  query GetWeeklyLosingData(
    $filters: [Filter!]
    $orders: [Order!]
    $pagination: Pagination
  ) {
    response: getWeeklyLosingData(
      filters: $filters
      orders: $orders
      pagination: $pagination
    ) {
      weeklyLosingData {
        weekStart
        weekEnd
        site
        distributorID
        distributorName
        distributorLevel
        nickname
        depositor
        alias
        totalBet
        totalWinner
        totalLosingMoney
        settlementAmount
        applicationDate
        processingDate
        situation
        userCount
      }
      total
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: UpdateTransaction!) {
    success: updateTransaction(id: $id, input: $input) {
      id
      userId
      type
      amount

      balanceBefore
      balanceAfter

      pointBefore
      pointAfter

      status
      shortcut
      usdtDesc

      transactionAt
      approvedAt

      createdAt
      updatedAt
      deletedAt

      user {
        id
        name
        userid
        type
        role
        root {
          id
          userid
        }
        parent {
          id
          userid
        }
        usdtAddress
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
  }
`;
export const APPROVE_TRANSACTION = gql`
  mutation ApproveTransaction($id: ID!) {
    success: approveTransaction(id: $id)
  }
`;

export const BLOCK_TRANSACTION = gql`
  mutation BlockTransaction($id: ID!) {
    success: blockTransaction(id: $id)
  }
`;


export const CANCEL_TRANSACTION = gql`
  mutation CancelTransaction($id: ID!) {
    success: cancelTransaction(id: $id)
  }
`;

export const WAITING_TRANSACTION = gql`
  mutation WaitingTransaction($id: ID!) {
    success: waitingTransaction(id: $id)
  }
`;