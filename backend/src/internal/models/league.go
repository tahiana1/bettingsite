package models

import "gorm.io/gorm"

type League struct {
	gorm.Model

	Code string `gorm:"size:20" json:"code"`
	Name string `gorm:"size:100" json:"name"`
	Logo string `gorm:"size:200" json:"logo"`

	// Foreign Keys
	NationID uint   `json:"nationId"`
	Nation   Nation `gorm:"foreignKey:NationID" json:"nation"`
	OrderNum uint   `json:"orderNum" gorm:"default:1"`

	SportID uint  `json:"sportId"`
	Sport   Sport `gorm:"foreignKey:SportID" json:"sport"`

	// One-to-Many Relationship
	Fixtures []Fixture `gorm:"foreignKey:LeagueID" json:"fixtures"`
}
