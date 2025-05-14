package models

import (
	"time"

	"gorm.io/gorm"
)

type Transaction struct {
	ID uint `json:"id" gorm:"primaryKey"`

	UserID uint `json:"userId"`
	User   User `gorm:"foreignKey:UserID"`

	Type   string  `json:"type" gorm:"size:20"`    // "deposit" or "withdrawal"
	Amount float64 `json:"amount" gorm:"not null"` // Amount of the transaction

	BalanceBefore float64 `json:"balanceBefore"` // User's balance before the transaction
	BalanceAfter  float64 `json:"balanceAfter"`  // User's balance after the transaction

	PointBefore float64 `json:"pointBefore"` // User's point before the transaction
	PointAfter  float64 `json:"pointAfter"`  // User's point after the transaction

	Status   string `json:"status" gorm:"size:20"`    // e.g., "pending", "completed", "failed"
	Shortcut string `json:"shortcut" gorm:"size:20"`  // e.g., "pending", "completed", "failed"
	USDTDesc string `json:"usdtDesc" gorm:"size:200"` // e.g., "pending", "completed", "failed"

	TransactionAt time.Time `json:"transactionAt" gorm:"autoCreateTime"`
	ApprovedAt    time.Time `json:"approvedAt"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
