package models

import (
	"time"

	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

type Category struct {
	ID uint `json:"id"`

	Name  string `gorm:"unique;not null" json:"name"`
	Slug  string `gorm:"unique;not null" json:"slug"`
	Posts []Post

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}

func (category *Category) BeforeCreate(tx *gorm.DB) (err error) {
	category.Slug = slug.Make(category.Name)

	return
}
