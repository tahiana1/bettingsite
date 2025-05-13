package models

import (
	"time"

	"gorm.io/gorm"
)

type AdminPermission struct {
	ID uint `json:"id"`

	UserID uint `json:"userId" gorm:"unique;not null"`
	User   User `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Membership  bool `json:"membership"`
	Financials  bool `json:"financials"`
	Qna         bool `json:"qna"`
	Game        bool `json:"game"`
	Settlement  bool `json:"settlement"`
	Sale        bool `json:"sale"`
	Statistical bool `json:"statistical"`
	IP          bool `json:"ip"`
	Dwdelete    bool `json:"dwdelete"`

	Status bool `json:"status"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
