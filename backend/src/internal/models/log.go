package models

import (
	"time"
)

type Log struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Data string `json:"data"`
	Path string `json:"path"`

	UserID uint   `json:"userId"`
	User   User   `json:"owner" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	IP     string `gorm:"size:100" json:"ip"`

	Status bool `json:"status"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
