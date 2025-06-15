package models

import (
	"time"

	"gorm.io/gorm"
)

type Qna struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Type   string `json:"type" gorm:"size:200"`
	UserID uint   `json:"userId"`
	User   User   `json:"user" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	DomainID      uint   `json:"domainId" `
	Domain        Domain `json:"domain" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	QuestionTitle string `json:"questionTitle"`
	Question      string `json:"question"`
	AnswerTitle   string `json:"answerTitle"`
	Answer        string `json:"answer"`

	Status string `json:"status" gorm:"size:200"`

	RepliedAt *time.Time `json:"repliedAt"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
