package models

import (
	"time"

	"gorm.io/gorm"
)

type CasinoBet struct {
	ID            uint            `json:"id" gorm:"primaryKey"`
	Type          string          `json:"type" gorm:"size:100"`
	UserID        uint            `json:"userId"`
	User          *User           `json:"user" gorm:"foreignKey:UserID"`
	GameID        uint            `json:"gameId"`
	Amount        float64         `json:"amount"`
	Status        string          `json:"status"`
	GameName      string          `json:"gameName"`
	TransID       string          `json:"transId"`
	WinningAmount uint            `json:"winningAmount"`
	BettingTime   uint            `json:"bettingTime"`
	Details       interface{}     `json:"details" gorm:"type:jsonb"`
	BeforeAmount  float64         `json:"beforeAmount"`
	AfterAmount   float64         `json:"afterAmount"`
	CreatedAt     time.Time       `json:"createdAt"`
	UpdatedAt     time.Time       `json:"updatedAt"`
	DeletedAt     *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
