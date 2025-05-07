package helpers

import (
	"errors"
	"fmt"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

func ParseDBError(err error) error {
	// GORM-specific: record not found
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return errors.New("record not found")
	}

	// PostgreSQL-specific error handling
	var pqErr *pq.Error
	if errors.As(err, &pqErr) {
		switch pqErr.Code {
		case "23505":
			return errors.New("duplicate value violates unique constraint")
		case "23503":
			return errors.New("foreign key violation")
		case "23502":
			return errors.New(fmt.Sprintf("null value in column \"%s\" violates not-null constraint", pqErr.Column))
		default:
			return errors.New(fmt.Sprintf("database error: %s", pqErr.Message))
		}
	}

	// Fallback: return generic message
	return err
}
