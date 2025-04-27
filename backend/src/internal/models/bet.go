package models

import (
	"time"

	"gorm.io/gorm"
)

type Bet struct {
	gorm.Model

	// Foreign Keys
	UserID    uint    `json:"userId"`
	User      User    `gorm:"foreignKey:UserID"`
	FixtureID uint    `json:"fixtureId"`
	Fixture   Fixture `gorm:"foreignKey:FixtureID"`
	MarketID  uint    `json:"marketId"`
	Market    Market  `gorm:"foreignKey:MarketID"`

	// Bet Details
	Selection       string  `json:"selection" gorm:"size:100"`       // e.g., "Over", "Under", "Team A"
	Odds            float64 `json:"odds" gorm:"not null"`            // Decimal odds
	Stake           float64 `json:"stake" gorm:"not null"`           // Amount bet
	PotentialPayout float64 `json:"potentialPayout" gorm:"not null"` // Stake * Odds

	Status string  `json:"status" gorm:"size:20;default:'pending'"` // "pending", "won", "lost", etc.
	Result *string `json:"result" gorm:"size:20"`                   // "win", "lose", "void", or null

	PlacedAt  time.Time  `json:"placedAt" gorm:"autoCreateTime"` // Auto-filled by GORM
	SettledAt *time.Time `json:"settledAt"`                      // Null until resolved
}
