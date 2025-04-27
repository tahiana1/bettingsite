package models

import "gorm.io/gorm"

type Market struct {
	gorm.Model

	Name         string `json:"name" gorm:"size:255"`
	Type         string `json:"type" gorm:"size:255"`
	Desc         string `json:"desc" gorm:"size:255"`
	Family       int    `json:"family"`
	ProviderName string `json:"providerName" gorm:"size:50"`

	// One-to-Many Relationship
	Rates []Rate `json:"rates" gorm:"foreignKey:MarketID"`
}
