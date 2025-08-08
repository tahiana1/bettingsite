package models

import (
	"time"

	"gorm.io/gorm"
)

type CasinoBet struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Type string `json:"type" gorm:"size:100"`

	UserID        uint    `json:"userId"`
	GameID        uint    `json:"gameId"`
	Amount        float64 `json:"amount"`
	Status        bool    `json:"status"`
	GameName      string  `json:"gameName"`
	TransID       uint    `json:"transId"`
	WinningAmount uint    `json:"winningAmount"`
	BettingTime   uint    `json:"bettingTime"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
