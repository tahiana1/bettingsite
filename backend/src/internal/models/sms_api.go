package models

import (
	"time"

	"gorm.io/gorm"
)

type SMSApi struct {
	ID uint `json:"id"`

	Name     string `gorm:"size:500;" json:"name"`
	Url      string `gorm:"size:500;" json:"url"`
	Agent    string `gorm:"size:500;" json:"agent"`
	Password string `gorm:"size:500;" json:"password"`
	Token    string `gorm:"size:500;" json:"token"`

	OrderNum uint `json:"orderNum" gorm:"default:1"`

	Status bool `json:"status"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
