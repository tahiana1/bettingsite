package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Type string `json:"type" gorm:"size:100"`

	Title       string  `json:"title" gorm:"size:500" validate:"required,min=2"`
	Category    *uint   `json:"category,omitempty"`
	Views       *uint   `json:"views,omitempty" gorm:"column:views"`
	Description string  `json:"description" gorm:"type:text"`
	OrderNum    uint    `json:"orderNum" gorm:"default:0"`
	MainImage   *string `json:"mainImage,omitempty" gorm:"type:text"`
	ImageUpload *string `json:"imageUpload,omitempty"`
	Level       uint    `json:"level" gorm:"default:0"`

	UserID uint `json:"userId"`
	User   User `json:"author" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Status bool `json:"status"`

	DomainID *uint   `json:"domainId" gorm:"index"`
	Domain   *Domain `json:"domain" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	CreatedDate *time.Time `json:"createdDate,omitempty"`
	ShowFrom    time.Time  `json:"showFrom"`
	ShowTo      time.Time  `json:"showTo"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
