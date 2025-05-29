package models

import (
	"time"

	"gorm.io/gorm"
)

type Bulletin struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Type string `json:"type" gorm:"size:100"`

	Title        string     `json:"title" gorm:"size:500" validate:"required,min=2"`
	Category     *uint      `json:"category,omitempty"`
	NickName     string     `json:"nickname,omitempty"`
	Description  string     `json:"description" gorm:"type:text"`
	Recommend    uint       `json:"recommend,omitempty"`
	NotRecommend uint       `json:"notrecommend,omitempty"`
	UserID       uint       `json:"userId"`
	Level        *uint      `json:"level,omitempty"`
	Status       bool       `json:"status"`
	Allas        *uint      `json:"allas,omitempty"`
	Top          bool       `json:"top" gorm:"default:false"`
	Check        uint       `json:"check"`
	DomainID     *uint      `json:"domainId" gorm:"index"`
	Domain       *Domain    `json:"domain" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Views        uint       `json:"views"`
	CreatedDate  *time.Time `json:"createdDate,omitempty"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
