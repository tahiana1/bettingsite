package models

import (
	"time"
)

type Menu struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Path  string `gorm:"not null" json:"path"`
	Name  string `gorm:"not null" json:"name"`
	Label string `gorm:"not null" json:"label"`

	ParentID *uint  // Null for root menus
	Parent   *Menu  `gorm:"foreignKey:ParentID"`
	Children []Menu `gorm:"foreignKey:ParentID"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
