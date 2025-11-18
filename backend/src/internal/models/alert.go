package models

import (
	"time"

	"gorm.io/gorm"
)

type Alert struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Type      string `json:"type" gorm:"size:50;not null"` // "deposit", "withdrawal", "qna", "rollingExchange", "point", "signup"
	Title     string `json:"title" gorm:"size:200;not null"`
	Message   string `json:"message" gorm:"type:text"`
	EntityID  uint   `json:"entityId"` // ID of the related entity (transaction ID, QNA ID, user ID, etc.)
	IsRead    bool   `json:"isRead" gorm:"default:false"`
	ReadAt    *time.Time `json:"readAt"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

