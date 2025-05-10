package helpers

import (
	"fmt"
	"strconv"

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
		field := f.Field
		value := f.Value

		// if !allowedMap[field] || f.Op == nil {
		// 	continue
		// }
		s, err := strconv.ParseBool(value)
		if err == nil {
			switch *f.Op {
			case model.OpEq:
				db = db.Where(fmt.Sprintf("%s = ?", field), s)
			case model.OpNeq:
				db = db.Where(fmt.Sprintf("%s != ?", field), s)
			}
		} else {
			switch *f.Op {
			case model.OpEq:
				db = db.Where(fmt.Sprintf("%s = ?", field), value)
			case model.OpNeq:
				db = db.Where(fmt.Sprintf("%s != ?", field), value)
			case model.OpGt:
				db = db.Where(fmt.Sprintf("%s > ?", field), value)
			case model.OpGte:
				db = db.Where(fmt.Sprintf("%s >= ?", field), value)
			case model.OpLt:
				db = db.Where(fmt.Sprintf("%s < ?", field), value)
			case model.OpLte:
				db = db.Where(fmt.Sprintf("%s <= ?", field), value)
			case model.OpLike:
			case model.OpIlike:
				db = db.Where(fmt.Sprintf("%s ILIKE ?", field), "%"+value+"%")
			case model.OpIsNull:
				db = db.Where(fmt.Sprintf("%s IS NULL", field))
			case model.OpIsNotNull:
				db = db.Where(fmt.Sprintf("%s IS NOT NULL", field))
			case model.OpIn:
				db = db.Where(fmt.Sprintf("%s IN ?", field), value)
			case model.OpNotIn:
				db = db.Where(fmt.Sprintf("%s NOT IN ?", field), value)
			}
		}

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
		db = db.Limit(10).Offset(0)
	}
	return db
}
