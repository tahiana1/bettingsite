package models

import (
	"time"

	"gorm.io/gorm"
)

type Domain struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Name        string `json:"name" gorm:"size:100;unique" validate:"required,min=2"`
	Description string `json:"description"`
	OrderNum    uint   `json:"orderNum" gorm:"default:1"`

	UserID uint `json:"userId"`
	User   User `json:"owner" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	AutoReg bool `json:"autoReg"`
	Status  bool `json:"status"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
