package models

import (
	"time"
)

type Attendance struct {
	ID uint `json:"id" gorm:"primaryKey"`

	UserID uint `json:"userId"`
	User   User `gorm:"foreignKey:UserID"`

	IP       string `json:"ip"`
	DeviceID string `json:"deviceId"`

	RequestCount uint `json:"requestCount"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `gorm:"index" json:"deletedAt,omitempty"`
}
