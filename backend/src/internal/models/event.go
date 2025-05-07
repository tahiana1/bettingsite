package models

import (
	"time"
)

type Event struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Type string `json:"type" gorm:"size:100"`

	Title       string `json:"name" gorm:"size:500" validate:"required,min=2"`
	Description string `json:"description"`
	OrderNum    uint   `json:"orderNum" gorm:"default:1"`

	UserID uint `json:"userId"`
	User   User `json:"author" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Status bool `json:"status"`

	DomainID *uint   `json:"domainId" gorm:"index"`
	Domain   *Domain `json:"domain" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Level uint `json:"level"`

	ShowFrom time.Time `json:"showFrom"`
	ShowTo   time.Time `json:"showTo"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
