package helpers

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/hotbrainy/go-betting/backend/graph/model"
	"gorm.io/gorm"
)

// AllowedFilterFields defines which fields can be filtered
var AllowedFilterFields = []string{
	"id",
	"name",
	"userid",
	"role",
	"usdtAddress",
	"currentIP",
	"IP",
	"status",
	"orderNum",
	"createdAt",
	"updatedAt",
	"deletedAt",
}

// toMap converts a slice of strings to a map for O(1) lookups
func toMap(fields []string) map[string]bool {
	m := make(map[string]bool, len(fields))
	for _, field := range fields {
		m[field] = true
	}
	return m
}

// ApplyFilters adds WHERE conditions to the GORM DB query based on filters
func ApplyFilters(db *gorm.DB, filters []*model.Filter) *gorm.DB {
	// allowedMap := toMap(AllowedFilterFields)
	for _, f := range filters {
		db = applySingleFilter(db, f)
	}
	return db
}

func ApplyOrders(db *gorm.DB, orders []*model.Order) *gorm.DB {
	// Ordering
	if orders != nil {
		for _, o := range orders {
			field := o.Field
			dir := "asc"
			if *o.Direction == model.OrderDirectionDesc {
				dir = "desc"
			}
			db = db.Order(fmt.Sprintf("%s %s", CamelToSnake(field), dir))
		}
	}
	return db
}

func ApplyPagination(db *gorm.DB, pagination *model.Pagination) *gorm.DB {
	if pagination != nil {
		db = db.Limit(int(*pagination.Limit)).Offset(int(*pagination.Offset))
	} else {
		db = db.Limit(25).Offset(0)
	}
	return db
}

// applySingleFilter handles one Filter (including recursive OR/AND)
func applySingleFilter(db *gorm.DB, f *model.Filter) *gorm.DB {
	if f == nil {
		return db
	}

	// Handle OR group

	// Handle OR group
	if len(f.Or) > 0 {
		var orDB *gorm.DB
		for i, sub := range f.Or {
			subDB := applySingleFilter(db.Session(&gorm.Session{}), sub)
			if i == 0 {
				orDB = subDB
			} else {
				orDB = orDB.Or(subDB)
			}
		}
		return db.Where(orDB) // orDB contains the OR-ed filters
	}

	// Handle AND group
	if len(f.And) > 0 {
		for _, sub := range f.And {
			db = applySingleFilter(db, sub)
		}
		return db
	}

	// Handle single condition
	field := *f.Field
	value := *f.Value

	if f.Op == nil {
		return db
	}

	switch *f.Op {
	case model.OpEq:
		if value == "true" || value == "false" {
			s, err := strconv.ParseBool(value)
			if err == nil {
				db = db.Where(fmt.Sprintf("%s = ?", field), s)
			}
		} else {
			db = db.Where(fmt.Sprintf("%s = ?", field), value)
		}

	case model.OpNeq:
		if value == "true" || value == "false" {
			s, err := strconv.ParseBool(value)
			if err == nil {
				db = db.Where(fmt.Sprintf("%s != ?", field), s)
			}
		} else {
			db = db.Where(fmt.Sprintf("%s != ?", field), value)
		}

	case model.OpGt:
		db = db.Where(fmt.Sprintf("%s > ?", field), value)

	case model.OpGte:
		db = db.Where(fmt.Sprintf("%s >= ?", field), value)

	case model.OpLt:
		db = db.Where(fmt.Sprintf("%s < ?", field), value)

	case model.OpLte:
		db = db.Where(fmt.Sprintf("%s <= ?", field), value)

	case model.OpLike:
		db = db.Where(fmt.Sprintf("%s LIKE ?", field), "%"+value+"%")

	case model.OpIlike:
		db = db.Where(fmt.Sprintf("%s ILIKE ?", field), "%"+value+"%")

	case model.OpIsNull:
		db = db.Where(fmt.Sprintf("%s IS NULL", field))

	case model.OpIsNotNull:
		db = db.Where(fmt.Sprintf("%s IS NOT NULL", field))

	case model.OpIn:
		db = db.Where(fmt.Sprintf("%s IN ?", field), strings.Split(value, ","))

	case model.OpNotIn:
		db = db.Where(fmt.Sprintf("%s NOT IN ?", field), strings.Split(value, ","))

		// You can add more ops like BETWEEN, NOT_BETWEEN if needed
	}

	return db
}
