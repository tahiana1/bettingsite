package models

import (
	"time"

	"gorm.io/gorm"
)

type AdminMenu struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Path        string `gorm:"not null;size:1000;" json:"path"`
	Icon        string `gorm:"size:1000;" json:"icon"`
	Key         string `gorm:"not null;size:200;" json:"key"`
	Label       string `gorm:"not null;size:200;" json:"label"`
	Description string `json:"description"`

	ParentID *uint       // Null for root menus
	Parent   *AdminMenu  `gorm:"foreignKey:ParentID"`
	Children []AdminMenu `json:"children" gorm:"foreignKey:ParentID"`

	Status bool `json:"status"`

	OrderNum uint `json:"orderNum" gorm:"default:1"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
