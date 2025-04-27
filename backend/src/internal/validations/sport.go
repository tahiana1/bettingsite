package validations

import (
	"github.com/go-playground/validator/v10"
	requests "github.com/hotbrainy/go-betting/backend/internal/request"
)

func ValidateSport(sportRequest requests.SportRequest) error {
	validate := validator.New()
	return validate.Struct(sportRequest)
}
