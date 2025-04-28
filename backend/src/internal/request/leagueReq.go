package requests

type LeagueRequest struct {
	Name string `gorm:"column:name;size:2048" json:"name" validate:"required,min=2"`
}
