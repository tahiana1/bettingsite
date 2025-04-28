package models

import (
	"time"

	"gorm.io/gorm"
)

type Fixture struct {
	ID uint `json:"id" gorm:"primaryKey"`

	SportID uint  `json:"sportId"`
	Sport   Sport `gorm:"foreignKey:SportID" json:"sport"`

	NationID uint   `json:"nationId"`
	Nation   Nation `gorm:"foreignKey:NationID" json:"nation"`

	LeagueID uint   `json:"leagueId"`
	League   League `json:"league"`

	HomeTeamID uint `json:"homeTeamId"`
	HomeTeam   Team `gorm:"foreignKey:HomeTeamID" json:"homeTeam"`

	AwayTeamID uint `json:"awayTeamId"`
	AwayTeam   Team `gorm:"foreignKey:AwayTeamID" json:"awayTeam"`

	StartDate    time.Time `json:"startDate"`
	StartDateMod string    `json:"startDateMod"`
	GameStatus   string    `json:"gameStatus"`
	Period       string    `json:"period"`
	HomeScore    int       `json:"homeScore"`
	AwayScore    int       `json:"awayScore"`
	Group        int       `json:"group"`
	EsportsType  int       `json:"esportsType"`
	OrigRateInfo *string   `json:"origRateInfo"` // Can be changed depending on actual type
	GroupCnt     int       `json:"groupCnt"`
	Rates        []Rate    `gorm:"foreignKey:FixtureID;" json:"rates"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}
