package models

import (
	"time"

	"gorm.io/gorm"
)

type Market struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Name         string `json:"name" gorm:"size:255"`
	Type         string `json:"type" gorm:"size:255"`
	Desc         string `json:"desc" gorm:"size:255"`
	Family       int    `json:"family"`
	ProviderName string `json:"providerName" gorm:"size:50"`

	// One-to-Many Relationship
	Rates []Rate `json:"rates" gorm:"foreignKey:MarketID"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}
