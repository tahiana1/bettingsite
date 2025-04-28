package models

import (
	"time"

	"gorm.io/gorm"
)

type Rate struct {
	ID uint `json:"id" gorm:"primaryKey"`

	// Foreign Keys
	FixtureID uint    `json:"fixtureId" gorm:"index"`
	Fixture   Fixture `gorm:"foreignKey:FixtureID"`

	MarketID int    `json:"marketId"`
	Market   Market `gorm:"foreignKey:MarketID"`

	// Status Fields
	RateHomeStatus int `json:"rateHomeStatus"`
	RateAwayStatus int `json:"rateAwayStatus"`
	RateDrawStatus int `json:"rateDrawStatus"`

	// General Info
	LineScore string `json:"lineScore"`
	LockYn    int    `json:"lockYn"`
	ManualYn  int    `json:"manualYn"`
	Baseline  string `json:"baseLine"`

	// Home Side
	HomeBetCode  string  `json:"homeBetCode"`
	HomePickName string  `json:"homePickName"`
	HomeBase     float64 `json:"homeBase"`
	HomeLine     string  `json:"homeLine"`
	HomeRate     float64 `json:"homeRate"`

	// Draw Option
	DrawBetCode  string  `json:"drawBetCode"`
	DrawPickName string  `json:"drawPickName"`
	DrawBase     float64 `json:"drawBase"`
	DrawLine     string  `json:"drawLine"`
	DrawRate     float64 `json:"drawRate"`

	// Away Side
	AwayBetCode  string  `json:"awayBetCode"`
	AwayPickName string  `json:"awayPickName"`
	AwayBase     float64 `json:"awayBase"`
	AwayLine     string  `json:"awayLine"`
	AwayRate     float64 `json:"awayRate"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil

}
