package models

type DashboardStats struct {
	DepositAmount        float64 `json:"depositAmount"`
	WithdrawAmount       float64 `json:"withdrawAmount"`
	MemberDepositAmount  float64 `json:"memberDepositAmount"`
	MemberWithdrawAmount float64 `json:"memberWithdrawAmount"`
	TotalDepositAmount   float64 `json:"totalDepositAmount"`
	TotalWithdrawAmount  float64 `json:"totalWithdrawAmount"`
	TotalSettlement      float64 `json:"totalSettlement"`
	BettingAmount        float64 `json:"bettingAmount"`
	PrizeAmount          float64 `json:"prizeAmount"`
	BettingUsers         int     `json:"bettingUsers"`
	RegisteredUsers      int     `json:"registeredUsers"`
	NumberOfVisiters     int     `json:"numberOfVisiters"`

	// Additional fields for admin layout
	DepositToday              float64  `json:"depositToday"`
	WithdrawToday             float64  `json:"withdrawToday"`
	TotalBalance              float64  `json:"totalBalance"`
	TotalPoints               int64    `json:"totalPoints"`
	TodayWinners              int64    `json:"todayWinners"`
	BettingToday              float64  `json:"bettingToday"`
	TotalLoss                 float64  `json:"totalLoss"`
	TotalSalesLossToday       float64  `json:"totalSalesLossToday"`
	TodaysDistributionRolling float64  `json:"todaysDistributionRolling"`
	SportsPendingBetting      int64    `json:"sportsPendingBetting"`
	SportsRebateBetting       int64    `json:"sportsRebateBetting"`
	RollingTotal              float64  `json:"rollingTotal"`
	HonorLinkBalance          *float64 `json:"honorLinkBalance"`

	// Additional fields for admin header tags
	ConnectedUsers              int64 `json:"connectedUsers"`
	TodaysSubscribers           int64 `json:"todaysSubscribers"`
	TodaysWithdrawal            int64 `json:"todaysWithdrawal"`
	RegisteredUsersCount        int64 `json:"registeredUsersCount"`
	FirstDeposit                int64 `json:"firstDeposit"`
	NumberOfLoginFailures       int64 `json:"numberOfLoginFailures"`
	NumberOfDepositorsToday     int64 `json:"numberOfDepositorsToday"`
	NumberOfWithdrawalToday     int64 `json:"numberOfWithdrawalToday"`
	NumberOfBettingMembersToday int64 `json:"numberOfBettingMembersToday"`
	NumberOfBetsToday           int64 `json:"numberOfBetsToday"`
}

type DivisionSummary struct {
	Division             string  `json:"division"`
	NumberOfDeposit      int     `json:"numberOfDeposit"`
	NumberOfWithdraw     int     `json:"numberOfWithdraw"`
	NumberOfSettlement   int     `json:"numberOfSettlement"`
	DepositWithdraw      float64 `json:"depositWithdraw"`
	NumberOfBets         int     `json:"numberOfBets"`
	NumberOfWin          int     `json:"numberOfWin"`
	BettingWinning       float64 `json:"bettingWinning"`
	NumberOfMembers      int     `json:"numberOfMembers"`
	NumberOfBettingUsers int     `json:"numberOfBettingUsers"`
	NumberOfVisiters     int     `json:"numberOfVisiters"`
}

type PaymentTransaction struct {
	Number           int     `json:"number"`
	Type             string  `json:"type"`
	Name             string  `json:"name"`
	Allas            string  `json:"allas"`
	Depositor        string  `json:"depositor"`
	BeforeAmount     float64 `json:"beforeAmount"`
	ProcessingAmount float64 `json:"processingAmount"`
	AfterAmount      float64 `json:"afterAmount"`
	ApplicationDate  string  `json:"applicationDate"`
	ProcessDate      string  `json:"processDate"`
}

type ChartData struct {
	Name   string  `json:"name"`
	Action string  `json:"action"`
	Pv     float64 `json:"pv"`
}

type DashboardResponse struct {
	Stats           DashboardStats       `json:"stats"`
	DivisionSummary []DivisionSummary    `json:"divisionSummary"`
	RecentPayments  []PaymentTransaction `json:"recentPayments"`
	DepositChart    []ChartData          `json:"depositChart"`
	BettingChart    []ChartData          `json:"bettingChart"`
}
