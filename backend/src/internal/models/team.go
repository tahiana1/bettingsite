package models

import (
	"time"

	"gorm.io/gorm"
)

type Team struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Code        string `json:"code" gorm:"size:50;unique" validate:"required,min=2"`
	Name        string `json:"name" gorm:"size:100;unique" validate:"required,min=2"`
	Logo        string `json:"logo" gorm:"size:200"`
	Description string `json:"description" gorm:"size:1024;default:''"`
	OrderNum    uint   `json:"orderNum" gorm:"default:1"`
	ShowYn      bool   `json:"showYn" gorm:"default:true"`

	// Foreign keys and relationships
	SportID uint  `json:"sportId"`
	Sport   Sport `gorm:"foreignKey:SportID"`

	NationID uint   `json:"nationId"`
	Nation   Nation `gorm:"foreignKey:NationID"`

	HomeFixtures []Fixture `json:"homeFixtures" gorm:"foreignKey:HomeTeamID"`
	AwayFixtures []Fixture `json:"awayFixtures" gorm:"foreignKey:AwayTeamID"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
