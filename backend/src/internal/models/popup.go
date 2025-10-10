package models

import (
	"time"

	"gorm.io/gorm"
)

type Popup struct {
	ID           uint            `json:"id" gorm:"primaryKey"`
	Title        string          `json:"title" gorm:"size:100" validate:"required,min=2"`
	Description  string          `json:"description" gorm:"type:text"`
	OrderNum     uint            `json:"orderNum" gorm:"default:0"`
	Status       bool            `json:"status"`
	DisplayType  string          `json:"displayType" gorm:"size:50;default:'standard'"` // standard, center, doesn't exist
	Width        uint            `json:"width" gorm:"default:0"`                        // 0 means no width restriction
	Height       uint            `json:"height" gorm:"default:0"`                       // 0 means no height limit
	RegisterDate time.Time       `json:"registerDate"`
	ShowFrom     time.Time       `json:"showFrom"`
	ShowTo       time.Time       `json:"showTo"`
	CreatedAt    time.Time       `json:"createdAt"`
	UpdatedAt    time.Time       `json:"updatedAt"`
	DeletedAt    *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
