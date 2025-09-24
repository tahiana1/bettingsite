package models

import (
	"time"

	"gorm.io/gorm"
)

type Contact struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Phone     string `json:"phone" gorm:"size:100" default:""`
	Telegram  string `json:"telegram" gorm:"size:100" default:""`
	KakaoTalk string `json:"kakaoTalk" gorm:"size:100" default:""`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
