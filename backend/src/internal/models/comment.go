package models

import (
	"time"

	"gorm.io/gorm"
)

type Comment struct {
	ID uint `json:"id" gorm:"primaryKey"`

	PostID uint   `gorm:"foreignkey:PostID" json:"postID" binding:"required,gt=0"`
	UserID uint   `gorm:"foreignkey:UserID"`
	Body   string `json:"body" gorm:"type:text"`
	User   User   `json:"user"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
