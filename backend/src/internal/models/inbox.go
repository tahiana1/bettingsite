package models

import (
	"time"
)

type Inbox struct {
	ID uint `json:"id" gorm:"primaryKey"`

	UserID uint `json:"userId"`
	User   User `gorm:"foreignKey:UserID"`

	FromID   uint `json:"fromId"`
	FromUser User `gorm:"foreignKey:FromID"`

	Title       string `json:"name" gorm:"size:100;unique" validate:"required,min=2"`
	Description string `json:"description" gorm:"size:200"`
	OrderNum    uint   `json:"orderNum" gorm:"default:1"`

	ShowFrom time.Time `json:"showFrom"`
	ShowTo   time.Time `json:"showTo"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
