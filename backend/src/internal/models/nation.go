package models

import "gorm.io/gorm"

type Nation struct {
	gorm.Model

	Code     string `json:"code" gorm:"size:10"`
	Name     string `json:"name" gorm:"size:100"`
	Flag     string `json:"flag" gorm:"size:200"`
	OrderNum int    `json:"orderNum"`

	// One-to-Many Relationship with League
	Leagues []League `json:"leagues" gorm:"foreignKey:NationID"`
}
