package requests

type SportRequest struct {
	Code       string `gorm:"column:code;size:50;unique" json:"code" validate:"required,min=2"`
	Name       string `gorm:"column:name;size:100;unique" json:"name" validate:"required,min=2"`
	InstantMsg string `gorm:"column:instant_msg;size:1024;default:''" json:"instantMsg"`
	OrderNum   uint   `gorm:"column:order_num;default:1" json:"orderNum"`
	ShowYn     bool   `gorm:"column:show_yn;default:true" json:"showYn"`
}
