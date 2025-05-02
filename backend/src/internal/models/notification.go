package models

import (
	"time"
)

type Notification struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Title    string `json:"name" gorm:"size:100;unique" validate:"required,min=2"`
	Desc     string `json:"desc" gorm:"size:200"`
	OrderNum uint   `json:"orderNum" gorm:"default:1"`

	ShowFrom time.Time `json:"showFrom"`
	ShowTo   time.Time `json:"showTo"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
