package validations

import (
	"github.com/go-playground/validator/v10"
	requests "github.com/hotbrainy/go-betting/backend/internal/request"
)

func ValidateLeague(leagueRequest requests.LeagueRequest) error {
	validate := validator.New()
	return validate.Struct(leagueRequest)
}
