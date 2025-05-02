package scalar

import (
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/99designs/gqlgen/graphql"
)

type MyCustomBooleanScalar bool

func MarshalTime(t time.Time) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		w.Write([]byte(`"` + t.Format(time.RFC3339) + `"`))
	})
}

func UnmarshalTime(v interface{}) (time.Time, error) {
	str, ok := v.(string)
	if !ok {
		return time.Time{}, fmt.Errorf("time must be a string")
	}
	return time.Parse(time.RFC3339, str)
}

func MarshalMyCustomBooleanScalar(b bool) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		if b {
			w.Write([]byte("true"))
		} else {
			w.Write([]byte("false"))
		}
	})
}

func UnmarshalMyCustomBooleanScalar(v interface{}) (bool, error) {
	switch v := v.(type) {
	case string:
		return "true" == strings.ToLower(v), nil
	case int:
		return v != 0, nil
	case bool:
		return v, nil
	default:
		return false, fmt.Errorf("%T is not a bool", v)
	}
}
