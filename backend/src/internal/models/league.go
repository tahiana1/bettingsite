package models

import (
	"time"
)

type League struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Code string `gorm:"size:20" json:"code"`
	Name string `gorm:"size:100" json:"name"`
	Logo string `gorm:"size:200" json:"logo"`

	// Foreign Keys
	NationID uint   `json:"nationId"`
	Nation   Nation `gorm:"foreignKey:NationID" json:"nation"`

	SportID uint  `json:"sportId"`
	Sport   Sport `gorm:"foreignKey:SportID" json:"sport"`

	OrderNum uint `json:"orderNum" gorm:"default:1"`

	// One-to-Many Relationship
	Fixtures []Fixture `gorm:"foreignKey:LeagueID" json:"fixtures"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
