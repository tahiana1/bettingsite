package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID uint `json:"id"`

	Name     string `json:"name" gorm:"size:100"`
	Userid   string `json:"userid" gorm:"unique;not null;size:50"`
	Password string `json:"-" gorm:"size:255"`

	RootID   *uint `json:"rootId"`
	Root     *User `json:"root" gorm:"foreignKey:RootID"`
	ParentID *uint `json:"partentId"`
	Parent   *User `json:"parent" gorm:"foreignKey:ParentID"`

	Children      []User `json:"children" gorm:"foreignKey:ParentID"`
	ChildrenCount uint   `json:"childrenCount" gorm:"default:0"`

	Type                 string     `json:"type" gorm:"default:'G';size:20"`
	Role                 string     `json:"role" gorm:"default:'U';size:20"`
	PasswordResetToken   string     `json:"-" gorm:"size:255"`
	PasswordResetExpires *time.Time `json:"-"`

	Deposits    []Transaction `json:"deposits" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Withdrawals []Transaction `json:"withdrawals" gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`

	Profile Profile `json:"profile" gorm:"references:ID;constraint:OnDelete:CASCADE"`

	SecPassword string `json:"-" gorm:"size:255"`

	USDTAddress string `json:"usdtAddress" gorm:"size:64"`

	Status string `json:"status" gorm:"size:10;default:'P'"`

	BlackMemo bool `json:"blackMemo" gorm:"default:false"`

	CurrentIP   string `gorm:"column:current_ip;size:45" json:"currentIP"`
	IP          string `gorm:"column:ip;size:45" json:"ip"`
	OS          string `json:"os" gorm:"size:200"`
	Device      string `json:"device" gorm:"size:200"`
	FingerPrint string `json:"fingerPrint" gorm:"size:400"`

	OrderNum uint `json:"orderNum" gorm:"default:1"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
