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

	Type         string           `json:"type" gorm:"default:'G';size:20"` // User type
	Role         string           `json:"role" gorm:"default:'U';size:20"` // Admin, Partner, User
	PermissionID *uint            `json:"permissionId"`
	Permission   *AdminPermission `json:"permission"`

	Level string `json:"level" gorm:"default:'G';size:20"` // Role level Top - T, Middle-M, General-G

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

	Live float64 `json:"live" gorm:"default:1.0"`
	Slot float64 `json:"slot" gorm:"default:1.0"`
	Hold float64 `json:"hold" gorm:"default:0"`

	EntireLosing     float64 `json:"entireLosing" gorm:"default:0"`
	LiveLosingBeDang float64 `json:"liveLosingBeDang" gorm:"default:0"`
	SlotLosingBeDang float64 `json:"slotLosingBeDang" gorm:"default:0"`
	HoldLosingBeDang float64 `json:"holdLosingBeDang" gorm:"default:0"`

	LosingMethod string `json:"losingMethod" gorm:"default:'(input-output)*rate%'"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`
}
