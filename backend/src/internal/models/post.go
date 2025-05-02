package models

import (
	"time"
)

type Post struct {
	ID uint `json:"id" gorm:"primaryKey"`

	CategoryID uint     `gorm:"foreignkey:CategoryID" json:"categoryID"`
	Title      string   `gorm:"not null" json:"title"`
	Body       string   `gorm:"type:text" json:"body"`
	UserID     uint     `gorm:"foreignkey:UserID" json:"userID"`
	Category   Category `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` // Ensures FK constraints
	User       User     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Comments   []Comment

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
