package responses

import (
	"time"

	"gorm.io/gorm"
)

type Notification struct {
	ID          uint   `json:"id"`
	Title       string `json:"title" gorm:"size:100;unique" validate:"required,min=2"`
	Description string `json:"description" gorm:"size:1200"`
	OrderNum    uint   `json:"orderNum" gorm:"default:1"`

	ShowFrom time.Time `json:"showFrom"`
	ShowTo   time.Time `json:"showTo"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}

type User struct {
	ID uint `json:"id"`

	Name   string `json:"name"`
	Userid string `json:"userid" gorm:"unique;not null"`

	UseridVerified       bool       `json:"useridVerified" gorm:"default:false"`
	Role                 string     `json:"role" gorm:"default:'user'"` // partner, admin
	AvatarURL            string     `json:"avatarUrl,omitempty" gorm:"size:255"`
	Bio                  string     `json:"bio,omitempty" gorm:"size:512"`
	SocialLinks          string     `json:"socialLinks,omitempty" gorm:"size:512"` // JSON or String format for external links
	PasswordResetToken   string     `json:"-" gorm:"size:255"`                     // Token used for password reset
	PasswordResetExpires *time.Time `json:"-"`                                     // Expiration time for the password reset token

	// Financial History - Deposit/Withdrawals
	Deposits    []any `json:"deposits" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Withdrawals []any `json:"withdrawals" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`

	LastLoginAt time.Time `json:"lastLoginAt,omitempty"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}

type Status struct {
	Message     string      `json:"message"`
	Description string      `json:"description"`
	Token       string      `json:"token"`
	Data        interface{} `json:"data"`
	Error       interface{} `json:"error"`
}
