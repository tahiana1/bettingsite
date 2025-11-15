package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"strings"
)

// UintArray is a custom type for PostgreSQL integer arrays (uint)
type UintArray []uint

// Value implements the driver.Valuer interface for database writes
func (a UintArray) Value() (driver.Value, error) {
	if len(a) == 0 {
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
func (a *UintArray) Scan(value interface{}) error {
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
		return fmt.Errorf("cannot scan %T into UintArray", value)
	}

	// Handle PostgreSQL array format: {1,2,3} or {1, 2, 3}
	str = strings.TrimSpace(str)
	if str == "{}" || str == "" {
		*a = UintArray{}
		return nil
	}

	// Remove curly braces
	str = strings.Trim(str, "{}")
	if str == "" {
		*a = UintArray{}
		return nil
	}

	// Split by comma and parse integers
	parts := strings.Split(str, ",")
	result := make(UintArray, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		var num uint
		if _, err := fmt.Sscanf(part, "%d", &num); err != nil {
			return fmt.Errorf("cannot parse %q as uint: %w", part, err)
		}
		result = append(result, num)
	}

	*a = result
	return nil
}

// MarshalJSON implements json.Marshaler
func (a UintArray) MarshalJSON() ([]byte, error) {
	return json.Marshal([]uint(a))
}

// UnmarshalJSON implements json.Unmarshaler
func (a *UintArray) UnmarshalJSON(data []byte) error {
	var uints []uint
	if err := json.Unmarshal(data, &uints); err != nil {
		return err
	}
	*a = UintArray(uints)
	return nil
}

// String returns a comma-separated string representation
func (a UintArray) String() string {
	if len(a) == 0 {
		return ""
	}
	strValues := make([]string, len(a))
	for i, v := range a {
		strValues[i] = fmt.Sprintf("%d", v)
	}
	return strings.Join(strValues, ",")
}
