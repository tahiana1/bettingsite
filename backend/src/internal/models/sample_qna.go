package models

import (
	"time"

	"gorm.io/gorm"
)

type SampleQna struct {
	ID uint `json:"id"`

	Site     string `gorm:"size:500;" json:"site"`
	AnswerTitle string `gorm:"size:500;" json:"answerTitle"`
	AnswerContent string `gorm:"type:text;" json:"answerContent"`
	Use      bool `json:"use"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}