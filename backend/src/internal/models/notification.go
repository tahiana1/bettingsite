package models

import (
	"time"

	"gorm.io/gorm"
)

type Notification struct {
	ID           uint            `json:"id" gorm:"primaryKey"`
	Title        string          `json:"title" gorm:"size:100;unique" validate:"required,min=2"`
	Description  string          `json:"description" gorm:"type:text"`
	OrderNum     uint            `json:"orderNum" gorm:"default:0"`
	Status       bool            `json:"status"`
	MainImage    string          `json:"mainImage" gorm:"type:text"`
	ImageUpload  string          `json:"imageUpload" gorm:"type:text"`
	NoticeType   string          `json:"noticeType"`
	Level        uint            `json:"level" gorm:"default:0"`
	DomainID     *uint           `json:"domainId" gorm:"index"`
	Domain       *Domain         `json:"domain" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	RegisterDate time.Time       `json:"registerDate"`
	Views        uint            `json:"views"`
	CreatedAt    time.Time       `json:"createdAt"`
	UpdatedAt    time.Time       `json:"updatedAt"`
	DeletedAt    *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
