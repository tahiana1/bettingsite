package models

import (
	"time"
)

type User struct {
	ID uint `json:"id"`

	Name     string `json:"name" gorm:"size:100"`                  // VARCHAR(100)
	Userid   string `json:"userid" gorm:"unique;not null;size:50"` // VARCHAR(50)
	Password string `json:"-" gorm:"size:255"`                     // VARCHAR(255)

	Role                 string     `json:"role" gorm:"default:'user';size:20"` // VARCHAR(20)
	PasswordResetToken   string     `json:"-" gorm:"size:255"`                  // VARCHAR(255)
	PasswordResetExpires *time.Time `json:"-"`

	Deposits    []Transaction `json:"deposits" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Withdrawals []Transaction `json:"withdrawals" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`

	Profile Profile `json:"profile" gorm:"references:ID;constraint:OnDelete:CASCADE"`

	SecPassword string `json:"-" gorm:"size:255"` // VARCHAR(255)

	CurrentIP   string `gorm:"column:current_ip;size:45" json:"currentIP"` // IPv6 support, VARCHAR(45)
	IP          string `gorm:"column:ip;size:45" json:"ip"`                // IPv6 support, VARCHAR(45)
	USDTAddress string `json:"usdtAddress" gorm:"size:64"`                 // Assuming fixed-length address

	Status bool `json:"status" gorm:"default:false"` // VARCHAR(20)

	OrderNum uint `json:"orderNum" gorm:"default:1"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
