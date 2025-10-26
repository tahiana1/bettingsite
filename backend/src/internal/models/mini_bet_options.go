package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

// BallOption represents a single ball option in a combination bet
type BallOption struct {
	ID    uint   `json:"id" gorm:"primaryKey"`
	Color string `json:"color" gorm:"size:20;not null"` // "blue", "red", "green"
	Text  string `json:"text" gorm:"size:50;not null"`  // "Odd", "Even", "Under", "Over"
}

// MiniBetOption represents a betting option for mini games (EOS1Min, EOS2Min, etc.)
type MiniBetOption struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"size:100;not null"`
	Odds string `json:"odds" gorm:"size:20;not null"` // Stored as string to preserve precision

	// Betting type: single ball or combination
	Type string `json:"type" gorm:"size:20;not null"` // "single", "combination"

	// For single ball bets
	Ball *string `json:"ball" gorm:"size:20"` // "blue", "red", "green"
	Text *string `json:"text" gorm:"size:50"` // "Odd", "Even", "Under", "Over"

	// For combination bets - stored as JSON
	BallsJSON string       `json:"-" gorm:"type:text"`
	Balls     []BallOption `json:"balls" gorm:"-"` // Not stored in DB, populated from JSON

	// Game and category information
	GameType string `json:"gameType" gorm:"size:50;not null"` // "eos1min", "eos2min", etc.
	Category string `json:"category" gorm:"size:50;not null"` // "powerball", "normalball", "normalballsection", "oddeven", "threecombination"
	Level    int    `json:"level" gorm:"not null;default:1"`  // Level 1-15

	// Status and configuration
	Enabled bool `json:"enabled" gorm:"default:true"`

	// Order for display
	OrderNum int `json:"orderNum" gorm:"default:0"`

	// Timestamps
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// MiniGameConfig represents configuration for mini games
type MiniGameConfig struct {
	ID uint `json:"id" gorm:"primaryKey"`

	// Game identification
	GameType string `json:"gameType" gorm:"size:50;not null;uniqueIndex:idx_game_level"` // "eos1min", "eos2min", etc.

	// Level configuration
	Level int `json:"level" gorm:"not null;default:1;uniqueIndex:idx_game_level"`

	// Betting limits
	MaxBettingValue float64 `json:"maxBettingValue" gorm:"default:1000"`
	MinBettingValue float64 `json:"minBettingValue" gorm:"default:1"`

	// Game settings
	IsActive bool `json:"isActive" gorm:"default:true"`

	// Timestamps
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// BeforeCreate hook to serialize balls to JSON
func (m *MiniBetOption) BeforeCreate(tx *gorm.DB) error {
	if len(m.Balls) > 0 {
		ballsJSON, err := json.Marshal(m.Balls)
		if err != nil {
			return err
		}
		m.BallsJSON = string(ballsJSON)
	}
	return nil
}

// AfterFind hook to deserialize balls from JSON
func (m *MiniBetOption) AfterFind(tx *gorm.DB) error {
	if m.BallsJSON != "" {
		err := json.Unmarshal([]byte(m.BallsJSON), &m.Balls)
		if err != nil {
			return err
		}
	}
	return nil
}

// BeforeUpdate hook to serialize balls to JSON
func (m *MiniBetOption) BeforeUpdate(tx *gorm.DB) error {
	if len(m.Balls) > 0 {
		ballsJSON, err := json.Marshal(m.Balls)
		if err != nil {
			return err
		}
		m.BallsJSON = string(ballsJSON)
	}
	return nil
}
