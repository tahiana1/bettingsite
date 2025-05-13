package models

import (
	"time"

	"gorm.io/gorm"
)

type Bank struct {
	ID uint `json:"id"`

	Name     string `gorm:"unique;not null" json:"name"`
	OrderNum uint   `json:"orderNum" gorm:"default:1"`

	Status bool `json:"status"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
