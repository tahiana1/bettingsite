package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID uint `json:"id"`

	Name     string `json:"name" gorm:"size:100"`
	Userid   string `json:"userid" gorm:"unique;not null;size:50"`
	Password string `json:"-" gorm:"size:255"`

	RootID   *uint `json:"rootId"`
	Root     *User `json:"root" gorm:"foreignKey:RootID"`
	ParentID *uint `json:"partentId"`
	Parent   *User `json:"parent" gorm:"foreignKey:ParentID"`

	Children      []User `json:"children" gorm:"foreignKey:ParentID"`
	ChildrenCount uint   `json:"childrenCount" gorm:"default:0"`

	Type         string           `json:"type" gorm:"default:'G';size:20"` // User type
	Role         string           `json:"role" gorm:"default:'U';size:20"` // Admin, Partner, User
	PermissionID *uint            `json:"permissionId"`
	Permission   *AdminPermission `json:"permission"`

	Level string `json:"level" gorm:"default:'G';size:20"` // Role level Top - T, Middle-M, General-G

	PasswordResetToken   string     `json:"-" gorm:"size:255"`
	PasswordResetExpires *time.Time `json:"-"`

	Deposits    []Transaction `json:"deposits" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Withdrawals []Transaction `json:"withdrawals" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`

	Profile Profile `json:"profile" gorm:"references:ID;constraint:OnDelete:CASCADE"`

	SecPassword string `json:"-" gorm:"size:255"`

	USDTAddress string `json:"usdtAddress" gorm:"size:64"`

	Status string `json:"status" gorm:"size:10;default:'P'"`

	OnlineStatus bool `json:"onlineStatus" gorm:"default:false"`

	BlackMemo bool `json:"blackMemo" gorm:"default:false"`

	CurrentIP   string `gorm:"column:current_ip;size:45" json:"currentIP"`
	IP          string `gorm:"column:ip;size:45" json:"ip"`
	OS          string `json:"os" gorm:"size:200"`
	Device      string `json:"device" gorm:"size:200"`
	FingerPrint string `json:"fingerPrint" gorm:"size:400"`

	// User appearance and identification
	Color          string `json:"color" gorm:"size:20;default:''"`
	ResidentNumber string `json:"residentNumber" gorm:"size:50"`

	// Memo and notes
	AccountMemo string `json:"accountMemo" gorm:"type:text"`
	AdminNote   string `json:"adminNote" gorm:"type:text"`
	AdminMemo2  string `json:"adminMemo2" gorm:"type:text"`

	// IP restrictions
	AllowedIPAddress string `json:"allowedIPAddress" gorm:"type:text"` // Can store multiple IPs

	// Game and platform settings
	SlotcityPriorityUse bool   `json:"slotcityPriorityUse" gorm:"default:false"`
	WebLoginAvailable   string `json:"webLoginAvailable" gorm:"size:20;default:'1'"` // 1=available, 2=pc only, 3=mobile only, 4=unavailable

	// Distributor settings
	ChangeOfDistributorProperties string `json:"changeOfDistributorProperties" gorm:"size:20;default:'1'"` // 1=online, 2=offline
	DelegationOfAdministrator     string `json:"delegationOfAdministrator" gorm:"size:20;default:'2'"`     // 1=use, 2=not use

	// Sign up settings
	SignUpCode          string `json:"signUpCode" gorm:"size:100"`
	CodeSignupAvailable string `json:"codeSignupAvailable" gorm:"size:20;default:'1'"` // 1=available, 2=not possible
	DisplayMemberCode   string `json:"displayMemberCode" gorm:"size:20;default:'1'"`   // 1=not displayed, 2=displayed

	// Registration and level settings
	InitialLevelOfAcquaintanceRegistration string `json:"initialLevelOfAcquaintanceRegistration" gorm:"size:20;default:'1'"` // 1-17 for different level options

	// User interface settings
	MemberPageAlarmSound string `json:"memberPageAlarmSound" gorm:"size:20;default:'1'"` // 1=on, 2=off
	UseAttendanceCheck   string `json:"useAttendanceCheck" gorm:"size:20;default:'1'"`   // 1=use, 2=not use
	UseRoulette          string `json:"useRoulette" gorm:"size:20;default:'1'"`          // 1=use, 2=not use

	// Customer service settings
	CustomerCenterInquiryAvailable string `json:"customerCenterInquiryAvailable" gorm:"size:20;default:'1'"` // 1=allowed, 2=not allowed

	// Community settings
	CreatePost              string `json:"createPost" gorm:"size:20;default:'1'"`              // 1=allowed, 2=not allowed
	WhiteCommentOnPost      string `json:"whiteCommentOnPost" gorm:"size:20;default:'1'"`      // 1=allowed, 2=not allowed
	PointsAwardedForThePost string `json:"pointsAwardedForThePost" gorm:"size:20;default:'1'"` // 1=allowed, 2=not allowed

	// Payment and account settings
	UsingVirtualAccountApi string `json:"usingVirtualAccountApi" gorm:"size:20;default:'2'"` // 1=use, 2=not use
	UsingOfWinningPoints   string `json:"usingOfWinningPoints" gorm:"size:20;default:'2'"`   // 1=use, 2=not use
	UsePaybackPayment      string `json:"usePaybackPayment" gorm:"size:20;default:'2'"`      // 1=use, 2=not use
	UseRefundLimit         string `json:"useRefundLimit" gorm:"size:20;default:'2'"`         // 1=use, 2=not use

	// Bonus limits
	DailyFirstDepositBonusLimit  string `json:"dailyFirstDepositBonusLimit" gorm:"size:20;default:'1'"`  // 1=no restriction, 2=limits
	SignUpFirstDepositBonusLimit string `json:"signUpFirstDepositBonusLimit" gorm:"size:20;default:'1'"` // 1=no restriction, 2=limits
	ReplenishmentBonusLimit      string `json:"replenishmentBonusLimit" gorm:"size:20;default:'1'"`      // 1=no restriction, 2=limits
	SurpriseBonusLimit           string `json:"surpriseBonusLimit" gorm:"size:20;default:'1'"`           // 1=no restriction, 2=limits
	IgnoreOption                 string `json:"ignoreOption" gorm:"size:20;default:'1'"`                 // 1=no restriction, 2=limits

	// Rolling settings
	RollingConversionAutomaticApproval string `json:"rollingConversionAutomaticApproval" gorm:"size:20;default:'2'"` // 1=use, 2=not use

	// Betting history settings
	CutBettingHistory                      string `json:"cutBettingHistory" gorm:"size:20;default:'1'"`                      // 1=live, 2=slot
	MaximumAmountOfBettingHistoryReduction string `json:"maximumAmountOfBettingHistoryReduction" gorm:"size:50;default:'0'"` // Amount
	PercentageReductionInBettingAmount     string `json:"percentageReductionInBettingAmount" gorm:"size:50;default:'0'"`     // Percentage

	// Waiting times (in minutes)
	WaitingTimeAfterCurrencyExchange int `json:"waitingTimeForReApplicationAfterCurrencyExchangeIsCompleted" gorm:"column:waiting_time_after_currency_exchange;default:0"`
	WaitingTimeAfterCharging         int `json:"waitingTimeForReApplicationAfterChargingIsCompleted" gorm:"column:waiting_time_after_charging;default:0"`
	WaitingTimeForExchangeRequest    int `json:"waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted" gorm:"column:waiting_time_for_exchange_request;default:0"`

	// Member/Distributor properties
	ChangeMemberProperties   string `json:"changeMemberProperties" gorm:"size:20;default:'1'"`   // 1=member, 2=distributor
	Distributor              string `json:"distributor" gorm:"size:20;default:'1'"`              // 1=member, 2=distributor
	ChangeOfMemberProperties string `json:"changeOfMemberProperties" gorm:"size:20;default:'1'"` // 1=member, 2=distributor

	// Display settings
	DisplayOfAdministrator                      string `json:"displayOfAdministrator" gorm:"size:20;default:'1'"`                      // 1=current, 2=non-presentation
	PartnerButtonDisplay                        string `json:"partnerButtonDisplay" gorm:"size:20;default:'1'"`                        // 1=current, 2=non-presentation
	PartnerMultiAccessPossible                  string `json:"partnerMultiAccessPossible" gorm:"size:20;default:'1'"`                  // 1=allowed, 2=not allowed
	DisplayPartnerReductionDetail               string `json:"displayPartnerReductionDetail" gorm:"size:20;default:'1'"`               // 1=current, 2=non-presentation
	DisplayPartnerRollingPaymentRecoveryHistory string `json:"displayPartnerRollingPaymentRecoveryHistory" gorm:"size:20;default:'1'"` // 1=current, 2=non-presentation

	// Sub-distributor permissions
	CreateSubDistributor           string `json:"createSubDistributor" gorm:"size:20;default:'1'"`           // 1=allowed, 2=not allowed
	CreateSubordinatorDirectMember string `json:"createSubordinatorDirectMember" gorm:"size:20;default:'1'"` // 1=allowed, 2=not allowed
	AccessToSubDetails             string `json:"accessToSubDetails" gorm:"size:20;default:'1'"`             // 1=on, 2=off
	AccessToSubBankInformation     string `json:"accessToSubBankInformation" gorm:"size:20;default:'1'"`     // 1=on, 2=off
	LowerConnectionCanBeKicked     string `json:"lowerConnectionCanBeKicked" gorm:"size:20;default:'1'"`     // 1=on, 2=off
	SubMoneyPayable                string `json:"subMoneyPayable" gorm:"size:20;default:'1'"`                // 1=on, 2=off
	LowerMoneyRecoveryPossible     string `json:"lowerMoneyRecoveryPossible" gorm:"size:20;default:'1'"`     // 1=on, 2=off
	LowerLosingChangePossible      string `json:"lowerLosingChangePossible" gorm:"size:20;default:'1'"`      // 1=on, 2=off
	LowerRollingChangeable         string `json:"lowerRollingChangeable" gorm:"size:20;default:'1'"`         // 1=on, 2=off

	// Referral benefits
	ReferalBenefitsMember            string `json:"referalBenefitsMember" gorm:"size:20;default:'1'"`            // 1=on, 2=off
	ReferalBenefitsMini              string `json:"referalBenefitsMini" gorm:"size:20;default:'1'"`              // 1=on, 2=off
	ReferalBenefitsVirtual           string `json:"referalBenefitsVirtual" gorm:"size:20;default:'1'"`           // 1=on, 2=off
	ReferalBenefitsSportsSinglePoles string `json:"referalBenefitsSportsSinglePoles" gorm:"size:20;default:'1'"` // 1=on, 2=off
	ReferalBenefitsSports2Poles      string `json:"referalBenefitsSports2Poles" gorm:"size:20;default:'1'"`      // 1=on, 2=off
	ReferalBenefitsSports3Poles      string `json:"referalBenefitsSports3Poles" gorm:"size:20;default:'1'"`      // 1=on, 2=off
	ReferalBenefitsSports4Poles      string `json:"referalBenefitsSports4Poles" gorm:"size:20;default:'1'"`      // 1=on, 2=off
	ReferalBenefitsSportsDapol       string `json:"referalBenefitsSportsDapol" gorm:"size:20;default:'1'"`       // 1=on, 2=off

	// Sports betting
	SportsBettingAllowed          string `json:"sportsBettingAllowed" gorm:"size:20;default:'1'"`          // 1=on, 2=off
	MinimumFolderForSportsBetting string `json:"minimumFolderForSportsBetting" gorm:"size:20;default:'1'"` // Minimum folder number

	OrderNum uint `json:"orderNum" gorm:"default:1"`

	Live float64 `json:"live" gorm:"default:1.0"`
	Slot float64 `json:"slot" gorm:"default:1.0"`
	Hold float64 `json:"hold" gorm:"default:0"`

	EntireLosing     float64 `json:"entireLosing" gorm:"default:0"`
	LiveLosingBeDang float64 `json:"liveLosingBeDang" gorm:"default:0"`
	SlotLosingBeDang float64 `json:"slotLosingBeDang" gorm:"default:0"`
	HoldLosingBeDang float64 `json:"holdLosingBeDang" gorm:"default:0"`

	LosingMethod string `json:"losingMethod" gorm:"default:'(input-output)*rate%'"`

	// Additional rolling fields for different game types
	MiniDanpolRolling      float64 `json:"miniDanpolRolling" gorm:"default:0"`
	MiniCombinationRolling float64 `json:"miniCombinationRolling" gorm:"default:0"`
	SportsDanpolRolling    float64 `json:"sportsDanpolRolling" gorm:"default:0"`
	SportsDupolRolling     float64 `json:"sportsDupolRolling" gorm:"default:0"`
	Sports3PoleRolling     float64 `json:"sports3PoleRolling" gorm:"default:0"`
	Sports4PoleRolling     float64 `json:"sports4PoleRolling" gorm:"default:0"`
	Sports5PoleRolling     float64 `json:"sports5PoleRolling" gorm:"default:0"`
	SportsDapolRolling     float64 `json:"sportsDapolRolling" gorm:"default:0"`
	VirtualGameRolling     float64 `json:"virtualGameRolling" gorm:"default:0"`
	LotusRolling           float64 `json:"lotusRolling" gorm:"default:0"`
	MgmRolling             float64 `json:"mgmRolling" gorm:"default:0"`
	TouchRolling           float64 `json:"touchRolling" gorm:"default:0"`

	// Financial statistics
	MembershipDeposit    float64 `json:"membershipDeposit" gorm:"default:0"`
	MembershipWithdrawal float64 `json:"membershipWithdrawal" gorm:"default:0"`
	TotalWithdrawal      float64 `json:"totalWithdrawal" gorm:"default:0"`
	NumberOfMembers      int     `json:"numberOfMembers" gorm:"default:0"`
	RollingHoldings      float64 `json:"rollingHoldings" gorm:"default:0"`

	// Betting/Winning statistics
	LiveBetting             float64 `json:"liveBetting" gorm:"default:0"`
	LiveWinning             float64 `json:"liveWinning" gorm:"default:0"`
	SlotBetting             float64 `json:"slotBetting" gorm:"default:0"`
	SlotJackpot             float64 `json:"slotJackpot" gorm:"default:0"`
	MiniDanpolBetting       float64 `json:"miniDanpolBetting" gorm:"default:0"`
	MiniDanpolWinner        float64 `json:"miniDanpolWinner" gorm:"default:0"`
	MiniCombinationBetting  float64 `json:"miniCombinationBetting" gorm:"default:0"`
	MiniCombinationWinnings float64 `json:"miniCombinationWinnings" gorm:"default:0"`
	SportsDanpolBetting     float64 `json:"sportsDanpolBetting" gorm:"default:0"`
	SportsDanpolWinner      float64 `json:"sportsDanpolWinner" gorm:"default:0"`
	SportsDupolBetting      float64 `json:"sportsDupolBetting" gorm:"default:0"`
	SportsDupolWinner       float64 `json:"sportsDupolWinner" gorm:"default:0"`
	Sports3poleBetting      float64 `json:"sports3poleBetting" gorm:"default:0"`
	Sports3poleWinner       float64 `json:"sports3poleWinner" gorm:"default:0"`
	Sports4poleBetting      float64 `json:"sports4poleBetting" gorm:"default:0"`
	Sports4poleWinner       float64 `json:"sports4poleWinner" gorm:"default:0"`
	Sports5poleBetting      float64 `json:"sports5poleBetting" gorm:"default:0"`
	Sports5poleWinner       float64 `json:"sports5poleWinner" gorm:"default:0"`
	SportsDapolBetting      float64 `json:"sportsDapolBetting" gorm:"default:0"`
	SportsDapolWinner       float64 `json:"sportsDapolWinner" gorm:"default:0"`
	VirtualGameBetting      float64 `json:"virtualGameBetting" gorm:"default:0"`
	VirtualGameWinnings     float64 `json:"virtualGameWinnings" gorm:"default:0"`
	LotusBetting            float64 `json:"lotusBetting" gorm:"default:0"`
	LotusLottery            float64 `json:"lotusLottery" gorm:"default:0"`
	MgmBetting              float64 `json:"mgmBetting" gorm:"default:0"`
	MgmWinning              float64 `json:"mgmWinning" gorm:"default:0"`
	TouchBetting            float64 `json:"touchBetting" gorm:"default:0"`
	TouchWinning            float64 `json:"touchWinning" gorm:"default:0"`
	HoldemBetting           float64 `json:"holdemBetting" gorm:"default:0"`
	HoldemWinning           float64 `json:"holdemWinning" gorm:"default:0"`

	// Rolling statistics
	RollingRate       float64 `json:"rollingRate" gorm:"default:0"`
	RollingTransition float64 `json:"rollingTransition" gorm:"default:0"`

	// Losing statistics
	LosingRate       float64 `json:"losingRate" gorm:"default:0"`
	LosingSettlement float64 `json:"losingSettlement" gorm:"default:0"`

	// Partnership statistics
	PartnershipRolling     float64 `json:"partnershipRolling" gorm:"default:0"`
	PartnershipMoneyInHand float64 `json:"partnershipMoneyInHand" gorm:"default:0"`

	// Domain access control - array of domain IDs
	// Empty array means access to all domains
	// Non-empty array means access only to specified domains
	DomainIDs []uint `json:"domainIds" gorm:"type:integer[]"`

	// Domain string from signup
	Domain string `json:"domain" gorm:"size:255"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
