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

	BlackMemo bool `json:"blackMemo" gorm:"default:false"`

	CurrentIP   string `gorm:"column:current_ip;size:45" json:"currentIP"`
	IP          string `gorm:"column:ip;size:45" json:"ip"`
	OS          string `json:"os" gorm:"size:200"`
	Device      string `json:"device" gorm:"size:200"`
	FingerPrint string `json:"fingerPrint" gorm:"size:400"`

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

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
