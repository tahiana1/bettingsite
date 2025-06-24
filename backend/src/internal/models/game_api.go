package models

import (
	"time"

	"gorm.io/gorm"
)

type GameAPI struct {
	ID              uint            `json:"id" gorm:"primaryKey"`
	UserID          uint            `json:"userId"`
	ApiCompanyName  string          `json:"apiCompanyName"`
	GameApiName     string          `json:"gameApiName"`
	GameCompanyName string          `json:"gameCompanyName"`
	GameType        string          `json:"gameType"`
	Other           string          `json:"other"`
	Type            string          `json:"type"`
	WhetherToUse    bool            `json:"whetherToUse"`
	OrderNum        uint            `json:"orderNum" gorm:"default:1"`
	CreatedAt       time.Time       `json:"createdAt"`
	UpdatedAt       time.Time       `json:"updatedAt"`
	DeletedAt       *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
