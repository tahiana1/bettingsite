package models

import (
	"time"

	"gorm.io/gorm"
)

type Transaction struct {
	ID uint `json:"id" gorm:"primaryKey"`

	UserID uint `json:"userId"`
	User   User `gorm:"foreignKey:UserID"`

	Type          string    `json:"type" gorm:"size:20"`    // "deposit" or "withdrawal"
	Amount        float64   `json:"amount" gorm:"not null"` // Amount of the transaction
	BalanceAfter  float64   `json:"balanceAfter"`           // User's balance after the transaction
	Status        string    `json:"status" gorm:"size:20"`  // e.g., "pending", "completed", "failed"
	TransactionAt time.Time `json:"transactionAt" gorm:"autoCreateTime"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}
