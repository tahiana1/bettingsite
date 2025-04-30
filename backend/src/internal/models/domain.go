package models

import (
	"time"

	"gorm.io/gorm"
)

type Domain struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Name     string `json:"name" gorm:"size:100;unique" validate:"required,min=2"`
	Desc     string `json:"desc"`
	OrderNum uint   `json:"orderNum" gorm:"default:1"`

	UserID uint `json:"userId"`
	User   User `json:"owner" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	Active bool `json:"active"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}
