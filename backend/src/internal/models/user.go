package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model

	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique;not null"`
	Password string `json:"-"`

	EmailVerified        bool       `json:"emailVerified" gorm:"default:false"`
	Role                 string     `json:"role" gorm:"default:'user'"` // partner, admin
	AvatarURL            string     `json:"avatarUrl,omitempty" gorm:"size:255"`
	Bio                  string     `json:"bio,omitempty" gorm:"size:512"`
	SocialLinks          string     `json:"socialLinks,omitempty" gorm:"size:512"` // JSON or String format for external links
	PasswordResetToken   string     `json:"-" gorm:"size:255"`                     // Token used for password reset
	PasswordResetExpires *time.Time `json:"-"`                                     // Expiration time for the password reset token

	// Financial History - Deposit/Withdrawals
	Deposits    []Transaction `json:"deposits" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Withdrawals []Transaction `json:"withdrawals" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`

	LastLoginAt time.Time  `json:"lastLoginAt,omitempty"`
	DeletedAt   *time.Time `json:"-" gorm:"index"` // Soft delete support
}
