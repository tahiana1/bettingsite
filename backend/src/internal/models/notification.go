package models

import (
	"time"

	"gorm.io/gorm"
)

type Notification struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Title       string `json:"title" gorm:"size:100;unique" validate:"required,min=2"`
	Description string `json:"description" gorm:"size:500"`
	OrderNum    uint   `json:"orderNum" gorm:"default:1"`

	Status   bool      `json:"status"`
	ShowFrom time.Time `json:"showFrom"`
	ShowTo   time.Time `json:"showTo"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
