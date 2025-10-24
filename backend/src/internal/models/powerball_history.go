package models

import (
	"time"

	"gorm.io/gorm"
)

type PowerballHistory struct {
	ID              uint            `json:"id" gorm:"primaryKey"`
	GameType        string          `json:"gameType"`
	GameDate        string          `json:"gameDate"`
	GameTime        string          `json:"gameTime"`
	GameResult      string          `json:"gameResult"`
	GameNumber      string          `json:"gameNumber"`
	GameBonusNumber string          `json:"gameBonusNumber"`
	CreatedAt       time.Time       `json:"createdAt"`
	UpdatedAt       time.Time       `json:"updatedAt"`
	DeletedAt       *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
