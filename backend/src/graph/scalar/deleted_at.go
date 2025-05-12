package scalar

import (
	"fmt"
	"io"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"gorm.io/gorm"
)

type DeletedAt gorm.DeletedAt

func (d DeletedAt) MarshalGQL(w io.Writer) {
	if !d.Valid {
		_, _ = w.Write([]byte("null"))
		return
	}
	_, _ = fmt.Fprintf(w, "%q", d.Time.Format(time.RFC3339))
}

func MarshalDeletedAt(d gorm.DeletedAt) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		if !d.Valid {
			_, _ = w.Write([]byte("null"))
			return
		}
		_, _ = fmt.Fprintf(w, "%q", d.Time.Format(time.RFC3339))
	})
}

func (d *DeletedAt) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("dates must be strings")
	}
	t, err := time.Parse(time.RFC3339, str)
	if err != nil {
		return fmt.Errorf("invalid time format: %w", err)
	}
	d.Time = t
	d.Valid = true
	return nil
}

func UnmarshalDeletedAt(v interface{}) (gorm.DeletedAt, error) {
	str, ok := v.(string)
	if !ok {
		return gorm.DeletedAt{}, fmt.Errorf("dates must be strings")
	}
	t, err := time.Parse(time.RFC3339, str)
	if err != nil {
		return gorm.DeletedAt{}, fmt.Errorf("invalid time format: %w", err)
	}
	var d = gorm.DeletedAt{}
	d.Time = t
	d.Valid = true
	return d, nil
}
