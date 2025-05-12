package models

import (
	"time"

	"gorm.io/gorm"
)

type Announcement struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Title       string `json:"name" gorm:"size:100;unique" validate:"required,min=2"`
	Description string `json:"description"`
	OrderNum    uint   `json:"orderNum" gorm:"default:1"`

	UserID uint `json:"userId"`
	User   User `json:"author" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Status bool `json:"status"`

	ShowFrom time.Time `json:"showFrom"`
	ShowTo   time.Time `json:"showTo"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
