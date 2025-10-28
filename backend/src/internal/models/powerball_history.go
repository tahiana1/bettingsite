package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type PowerballHistory struct {
	ID uint `json:"id" gorm:"primaryKey"`

	GameType      string  `json:"gameType"`
    Category      string  `json:"category"`
	UserID        uint    `json:"userId"`
	Amount        float64 `json:"amount"`
	Odds          float64 `json:"odds"`
	PickSelection string  `json:"pickSelection"`

	// Bet option reference and details
	BetOptionID   *uint   `json:"betOptionId" gorm:"column:bet_option_id"`
	BetType       string  `json:"betType" gorm:"size:20"` // "single" or "combination"
	BetBall       *string `json:"betBall" gorm:"size:20"`      // For single bets
	BetText       *string `json:"betText" gorm:"size:50"`      // For single bets
	BetBallsJSON  string  `json:"-" gorm:"type:text"`          // For combination bets
	BetBalls      []BallOption `json:"betBalls" gorm:"-"`      // Not stored in DB, populated from JSON

	Result        string  `json:"result"`
	Status        string  `json:"status"`
	Round         uint    `json:"round"`

	// Drawing result fields
	DrawingDate    string `json:"date"`
	Times          uint64 `json:"times"`
	FixedDateRound string `json:"fixedDateRound"`

	// Ball numbers (first 5 are default balls, last is powerball)
	Ball1     int `json:"ball1"`
	Ball2     int `json:"ball2"`
	Ball3     int `json:"ball3"`
	Ball4     int `json:"ball4"`
	Ball5     int `json:"ball5"`
	PowerBall int `json:"powerBall"`

	// Powerball characteristics
	PowBallOddEven   string `json:"powBallOe" gorm:"column:pow_ball_oe"`
	PowBallUnderOver string `json:"powBallUnover" gorm:"column:pow_ball_unover"`

	// Default ball characteristics
	DefBallSum       int    `json:"defBallSum" gorm:"column:def_ball_sum"`
	DefBallOddEven   string `json:"defBallOe" gorm:"column:def_ball_oe"`
	DefBallUnderOver string `json:"defBallUnover" gorm:"column:def_ball_unover"`
	DefBallSize      string `json:"defBallSize" gorm:"column:def_ball_size"`
	DefBallSection   string `json:"defBallSection" gorm:"column:def_ball_section"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}

// TableName returns the table name for the model
func (PowerballHistory) TableName() string {
	return "powerball_histories"
}

// BeforeCreate hook to serialize betBalls to JSON
func (p *PowerballHistory) BeforeCreate(tx *gorm.DB) error {
	if len(p.BetBalls) > 0 {
		ballsJSON, err := json.Marshal(p.BetBalls)
		if err != nil {
			return err
		}
		p.BetBallsJSON = string(ballsJSON)
	}
	return nil
}

// AfterFind hook to deserialize betBalls from JSON
func (p *PowerballHistory) AfterFind(tx *gorm.DB) error {
	if p.BetBallsJSON != "" {
		err := json.Unmarshal([]byte(p.BetBallsJSON), &p.BetBalls)
		if err != nil {
			return err
		}
	}
	return nil
}

// BeforeUpdate hook to serialize betBalls to JSON
func (p *PowerballHistory) BeforeUpdate(tx *gorm.DB) error {
	if len(p.BetBalls) > 0 {
		ballsJSON, err := json.Marshal(p.BetBalls)
		if err != nil {
			return err
		}
		p.BetBallsJSON = string(ballsJSON)
	}
	return nil
}
