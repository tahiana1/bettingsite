package responses

import "time"

type Sport struct {
	ID           uint     `json:"id"`
	Code         string   `json:"code"`
	Name         string   `json:"name"`
	Icon         string   `json:"icon"`
	Leagues      []League // `json:"leagues" gorm:"foreignKey:ID;references:SportID;constraint:OnDelete:CASCADE"`
	LeagueCount  uint     `json:"leagueCount"`
	FixtureCount uint     `json:"fixtureCount"`
}

type Nation struct {
	ID   uint   `json:"id"`
	Code string `json:"code"`
	Name string `json:"name"`
	Flag string `json:"flag"`
}

type Team struct {
	ID   uint   `json:"id"`
	Code string `json:"code" gorm:"size:50;unique"`
	Name string `json:"name" gorm:"size:100;unique"`
	Logo string `json:"logo" gorm:"size:200"`
	Desc string `json:"desc" gorm:"size:1024;default:''"`
}

type Fixture struct {
	ID         uint      `json:"id"`
	LeagueID   uint      `json:"leagueId"`
	StartDate  time.Time `json:"startDate"`
	HomeTeamID uint      `json:"homeTeamId"`
	HomeTeam   Team      `gorm:"foreignKey:HomeTeamID" json:"homeTeam"`

	AwayTeamID uint `json:"awayTeamId"`
	AwayTeam   Team `gorm:"foreignKey:AwayTeamID" json:"awayTeam"`

	HomeScore  int    `json:"homeScore"`
	AwayScore  int    `json:"awayScore"`
	GameStatus string `json:"gameStatus"`

	Rates []Rate `json:"rates"`
}

type League struct {
	ID       uint   `json:"id"`
	Code     string `json:"code"`
	Name     string `json:"name"`
	Logo     string `json:"logo"`
	SportID  uint   `json:"sportId"`
	Sport    Sport  `json:"sport"`
	NationID uint   `json:"nationId"`
	Nation   Nation `json:"nation"`

	Fixtures []Fixture `json:"fixtures,omitempty"`
	// FixtureCount uint      `json:"fixtureCount,omitempty"`
}
