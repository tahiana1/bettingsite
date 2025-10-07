package models

import (
	"time"
)

type ChargeBonusTableLevel struct {
	ID uint `json:"id" gorm:"primaryKey"`

	// Level and Charge Bonus Setting Information
	LevelID           uint   `json:"levelId" gorm:"not null"`
	ChargeBonusNumber int    `json:"chargeBonusNumber" gorm:"not null"` // 1-5 for Charge Bonus 1-5
	Type              string `json:"type" gorm:"not null"`              // "amount" or "time"

	// Data fields (JSON strings to store flexible data)
	Data string `json:"data" gorm:"type:text"` // JSON string containing the table data

	// Metadata
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt,omitempty" gorm:"index"`

	// Relationships
	Level Level `json:"level,omitempty" gorm:"foreignKey:LevelID"`
}

// TableName returns the table name for the model
func (ChargeBonusTableLevel) TableName() string {
	return "charge_bonus_table_levels"
}
