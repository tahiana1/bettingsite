package models

import (
	"time"

	"gorm.io/gorm"
)

type Role struct {
	ID uint `json:"id"`

	Name string `gorm:"unique;not null" json:"name"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
