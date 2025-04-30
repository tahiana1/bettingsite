package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID uint `json:"id"`

	Name     string `json:"name"`
	Userid   string `json:"userid" gorm:"unique;not null"`
	Password string `json:"-"`

	PhoneVerified        bool       `json:"phoneVerified" gorm:"default:false"`
	Role                 string     `json:"role" gorm:"default:'user'"` // partner, admin
	PasswordResetToken   string     `json:"-" gorm:"size:255"`          // Token used for password reset
	PasswordResetExpires *time.Time `json:"-"`                          // Expiration time for the password reset token

	// Financial History - Deposit/Withdrawals
	Deposits    []Transaction `json:"deposits" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Withdrawals []Transaction `json:"withdrawals" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`

	SecPassword string `json:"-"`

	USDTAddress string `json:"usdtAddress"`

	LastLoginAt time.Time `json:"lastLoginAt,omitempty"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}
