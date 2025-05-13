package models

import (
	"time"

	"gorm.io/gorm"
)

type Setting struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Status bool `json:"status"` // true - normal, false - under maintenance

	Title         string `json:"name" gorm:"size:500" validate:"required,min=2"` //inspect title
	Description   string `json:"description"`                                    // inspect desc
	PrimaryDomain uint   `json:"primaryDomain"`

	UserID uint `json:"userId"`
	User   User `json:"author" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	OrderNum uint `json:"orderNum" gorm:"default:1"`

	TotalExStatus bool      `json:"totalExStatus"`
	TotalExFrom   time.Time `json:"totalExFrom"`
	TotalExTo     time.Time `json:"totalExTo"`

	TotalReStatus bool      `json:"totalReStatus"`
	TotalReFrom   time.Time `json:"totalReFrom"`
	TotalReTo     time.Time `json:"totalReTo"`

	UserExStatus bool      `json:"userExStatus"`
	UserExFrom   time.Time `json:"userExFrom"`
	UserExTo     time.Time `json:"userExTo"`

	UserReStatus bool      `json:"userReStatus"`
	UserReFrom   time.Time `json:"userReFrom"`
	UserReTo     time.Time `json:"userReTo"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
