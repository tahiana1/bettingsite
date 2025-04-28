package models

import (
	"time"

	"gorm.io/gorm"
)

type Attendance struct {
	ID uint `json:"id" gorm:"primaryKey"`

	UserID uint `json:"userId"`
	User   User `gorm:"foreignKey:UserID"`

	IP       string `json:"ip"`
	DeviceID string `json:"deviceId"`

	RequestCount uint `json:"requestCount"`

	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt,omitempty"` // Use `omitempty` to omit if nil
}
