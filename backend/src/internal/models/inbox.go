package models

import (
	"time"

	"gorm.io/gorm"
)

type Inbox struct {
	ID uint `json:"id" gorm:"primaryKey"`

	UserID uint `json:"userId"`
	User   User `gorm:"foreignKey:UserID"`

	FromID   uint `json:"fromId"`
	FromUser User `gorm:"foreignKey:FromID"`

	Type string `json:"type" gorm:"size:200"`

	Title       string `json:"name" gorm:"size:100;unique" validate:"required,min=2"`
	Description string `json:"description" gorm:"size:200"`
	OrderNum    uint   `json:"orderNum" gorm:"default:1"`
	Status      bool   `json:"status"`

	OpenedAt time.Time `json:"openedAt"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
