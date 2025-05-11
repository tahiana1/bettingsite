package models

import (
	"time"
)

type Log struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Type  string `json:"type" gorm:"size:200"`
	Data  string `json:"data"`
	Path  string `json:"path"`
	Phone string `json:"phone" gorm:"size:50"`

	UserID *uint `json:"userId"`
	User   User  `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	IP string `gorm:"size:100" json:"ip"`

	Status string `json:"status" gorm:"size:200"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
