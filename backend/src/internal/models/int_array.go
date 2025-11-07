package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"strings"
)

// IntArray is a custom type for PostgreSQL integer arrays
type IntArray []int

// Value implements the driver.Valuer interface for database writes
func (a IntArray) Value() (driver.Value, error) {
	if a == nil || len(a) == 0 {
		return "{}", nil
	}
	// Format as PostgreSQL array: {1,2,3}
	strValues := make([]string, len(a))
	for i, v := range a {
		strValues[i] = fmt.Sprintf("%d", v)
	}
	return "{" + strings.Join(strValues, ",") + "}", nil
}

// Scan implements the sql.Scanner interface for database reads
func (a *IntArray) Scan(value interface{}) error {
	if value == nil {
		*a = nil
		return nil
	}

	var str string
	switch v := value.(type) {
	case string:
		str = v
	case []byte:
		str = string(v)
	default:
		return fmt.Errorf("cannot scan %T into IntArray", value)
	}

	// Handle PostgreSQL array format: {1,2,3} or {1, 2, 3}
	str = strings.TrimSpace(str)
	if str == "{}" || str == "" {
		*a = IntArray{}
		return nil
	}

	// Remove curly braces
	str = strings.Trim(str, "{}")
	if str == "" {
		*a = IntArray{}
		return nil
	}

	// Split by comma and parse integers
	parts := strings.Split(str, ",")
	result := make(IntArray, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		var num int
		if _, err := fmt.Sscanf(part, "%d", &num); err != nil {
			return fmt.Errorf("cannot parse %q as integer: %w", part, err)
		}
		result = append(result, num)
	}

	*a = result
	return nil
}

// MarshalJSON implements json.Marshaler
func (a IntArray) MarshalJSON() ([]byte, error) {
	return json.Marshal([]int(a))
}

// UnmarshalJSON implements json.Unmarshaler
func (a *IntArray) UnmarshalJSON(data []byte) error {
	var ints []int
	if err := json.Unmarshal(data, &ints); err != nil {
		return err
	}
	*a = IntArray(ints)
	return nil
}

// String returns a comma-separated string representation
func (a IntArray) String() string {
	if len(a) == 0 {
		return ""
	}
	strValues := make([]string, len(a))
	for i, v := range a {
		strValues[i] = fmt.Sprintf("%d", v)
	}
	return strings.Join(strValues, ",")
}

