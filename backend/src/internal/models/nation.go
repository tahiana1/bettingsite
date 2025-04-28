package models

import (
	"time"

	"gorm.io/gorm"
)

type Nation struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Code     string `json:"code" gorm:"size:10"`
	Name     string `json:"name" gorm:"size:100"`
	Alias    string `json:"alias" gorm:"size:8"`
	Flag     string `json:"flag" gorm:"size:200"`
	OrderNum int    `json:"orderNum"`

	// One-to-Many Relationship with League
	Leagues []League `json:"leagues" gorm:"foreignKey:NationID"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}
