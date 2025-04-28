package models

import (
	"time"

	"gorm.io/gorm"
)

type Profile struct {
	ID uint `json:"id"`

	UserID uint `json:"userId"`

	Name          string `json:"name"`
	Nickname      string `json:"nickname" gorm:"unique;not null"`
	BankName      string `json:"bank_name"`
	HolderName    string `json:"holder_name"`
	AccountNumber string `json:"account_number" gorm:"size:50"`

	Birthday time.Time `json:"birthDay,omitempty"`

	PhoneNumber string  `json:"phone_number" gorm:"size:50"`
	Balance     float32 `json:"balance" gorm:"type:float;precision:10;scale:2;default:0"`
	Point       uint    `json:"point"  gorm:"default:0"`
	Comp        uint    `json:"comp" gorm:"default:0"`

	Favorites string `json:"favorites"`

	Referral string `json:"referral" gorm:"size:50"`

	AvatarURL   string `json:"avatarUrl,omitempty" gorm:"size:255"`
	Bio         string `json:"bio,omitempty" gorm:"size:512"`
	SocialLinks string `json:"socialLinks,omitempty" gorm:"size:512"` // JSON or String format for external links

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}
