package models

import (
	"time"

	"gorm.io/gorm"
)

type Sport struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Code       string `json:"code" gorm:"size:50;unique" validate:"required,min=2"`
	Name       string `json:"name" gorm:"size:100;unique" validate:"required,min=2"`
	Icon       string `json:"icon" gorm:"size:200"`
	InstantMsg string `json:"instantMsg" gorm:"size:1024;default:''"`
	OrderNum   uint   `json:"orderNum" gorm:"default:1"`
	ShowYn     bool   `json:"showYn" gorm:"default:true"`

	Leagues []League `json:"leagues"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil

}
