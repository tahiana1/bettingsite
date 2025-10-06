package models

import (
	"time"
)

// SurpriseBonus represents surprise bonus settings for levels
type SurpriseBonus struct {
	ID            uint       `json:"id" gorm:"primaryKey"`
	LevelID       uint       `json:"levelId" gorm:"not null"`
	Number        int        `json:"number" gorm:"not null"`
	TimeInterval  string     `json:"timeInterval" gorm:"not null"` // e.g., "00:00 - 23:59"
	BonusPercent  float64    `json:"bonusPercent" gorm:"not null"`
	PaymentStatus string     `json:"paymentStatus" gorm:"default:'unpaid'"` // "paid", "unpaid"
	IsActive      bool       `json:"isActive" gorm:"default:true"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	DeletedAt     *time.Time `json:"deletedAt,omitempty" gorm:"index"`

	// Foreign key relationship
	Level Level `json:"level" gorm:"foreignKey:LevelID"`
}
