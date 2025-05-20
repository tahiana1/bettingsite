package models

import (
	"time"

	"gorm.io/gorm"
)

type Domain struct {
	ID uint `json:"id" gorm:"primaryKey"`

	Name        string `json:"name" gorm:"size:100;unique" validate:"requiredmin=2"`
	Description string `json:"description"`
	OrderNum    uint   `json:"orderNum" gorm:"default:1"`

	UserID uint `json:"userId"`
	User   User `json:"owner" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`

	AutoReg bool `json:"autoReg"`
	Status  bool `json:"status"`

	UseTelegram       bool   `json:"useTelegram"`
	Telegram          string `json:"telegram"`
	TelegramLink      string `json:"telegramLink"`
	UseKakaoTalk      bool   `json:"useKakaoTalk"`
	KakaoTalk         string `json:"kakaoTalk"`
	KakaoTalkLink     string `json:"kakaoTalkLink"`
	UseServiceCenter  bool   `json:"useServiceCenter"`
	ServiceCenter     string `json:"serviceCenter"`
	ServiceCenterLink string `json:"serviceCenterLink"`
	UseLiveDomain     bool   `json:"useLiveDomain"`
	LiveDomain        string `json:"liveDomain"`
	LiveDomainLink    string `json:"liveDomainLink"`
	MemberLevel       uint   `json:"memberLevel"`
	DistributorLevel  uint   `json:"distributorLevel"`

	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	DeletedAt *gorm.DeletedAt `gorm:"index" json:"deletedAtomitempty"`
}
