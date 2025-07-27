package models

import (
	"time"
)

type Level struct {
	ID uint `json:"id" gorm:"primaryKey"`

	MinimumDepositAmount                   uint `json:"minimumDepositAmount" gorm:"default:0"`
	MinimumWithdrawAmount                  uint `json:"minimumWithdrawAmount" gorm:"default:0"`
	MaximumDepositAmount                   uint `json:"maximumDepositAmount" gorm:"default:0"`
	MaximumWithdrawalAmount                uint `json:"maximumDepositAmount" gorm:"default:0"`
	PointAwardedWhenWritingAPost           uint `json:"pointAwardedWhenWritingAPost" gorm:"default:0"`
	PostPointsPerDayLimit                  uint `json:"postPointsPerDayLimit" gorm:"default:0"`
	MinimumPointCoversionAmount            uint `json:"minimumPointCoversionAmount" gorm:"default:0"`
	DepositAmountUnit                      uint `json:"depositAmountUnit" gorm:"default:0"`
	WithdrawalAmountUnit                   uint `json:"withdrawalAmountUnit" gorm:"default:0"`
	EnterPasswordWhenInquiringAboutAccount bool `json:"enterPasswordWhenInquiringAboutAccount" gorm:"default:false"`
	MinigameSingleDropPoints               uint `json:"minigameSingleDropPoints" gorm:"default:0"`
	MinigameCombinationLossPoints          uint `json:"minigameCombinationLossPoints" gorm:"default:0"`
	TotalPointsForMinigames                uint `json:"totalPointsForMinigames" gorm:"default:0"`
	SportsLiveSinglePoleDrawPoints         uint `json:"sportsLiveSinglePoleDrawPoints" gorm:"default:0"`
	SportsLive2PoleDrawPoints              uint `json:"sportsLive2PoleDrawPoints" gorm:"default:0"`
	SportsLive3PoleDrawPoints              uint `json:"sportsLive3PoleDrawPoints" gorm:"default:0"`
	SportsLive4PoleDrawPoints              uint `json:"sportsLive4PoleDrawPoints" gorm:"default:0"`
	SportsLiveDapolLostPoints              uint `json:"sportsLiveDapolLostPoints" gorm:"default:0"`
	SportsLiveTotalDrawPoints              uint `json:"sportsLiveTotalDrawPoints" gorm:"default:0"`
	SportsPreMatchSinglePoleDrawPoints     uint `json:"sportsPreMatchSinglePoleDrawPoints" gorm:"default:0"`
	SportsPreMatch2PoleDrawPoints          uint `json:"sportsPreMatch2PoleDrawPoints" gorm:"default:0"`
	SportsPreMatch3PoleDrawPoints          uint `json:"sportsPreMatch3PoleDrawPoints" gorm:"default:0"`
	SportsPreMatch4PoleDrawPoints          uint `json:"sportsPreMatch4PoleDrawPoints" gorm:"default:0"`
	SportsPreMatchDapolLostPoints          uint `json:"sportsPreMatchDapolLostPoints" gorm:"default:0"`
	SportsPreMatchTotalDrawPoints          uint `json:"sportsPreMatchTotalDrawPoints" gorm:"default:0"`
	MaximumAmountOfSportsWiningPoints1Day  uint `json:"maximumAmountOfSportsWiningPoints1Day" gorm:"default:0"`
	VirtualGameSinglePoleDrawPoints        uint `json:"virtualGameSinglePoleDrawPoints" gorm:"default:0"`
	VirtualGameDapolLossingPoints          uint `json:"virtualGameDapolLossingPoints" gorm:"default:0"`
	VirtualGameTotalDrawPoints             uint `json:"virtualGameTotalDrawPoints" gorm:"default:0"`
	CasinoLiveMaxRolling                   uint `json:"casinoLiveMaxRolling" gorm:"default:0"`
	CasinoLiveMinimumRolling               uint `json:"casinoLiveMinimumRolling" gorm:"default:0"`
	CasinoSlotMaxRolling                   uint `json:"casinoSlotMaxRolling" gorm:"default:0"`
	CasinoSlotsMinimumRolling              uint `json:"casinoSlotsMinimumRolling" gorm:"default:0"`
	HoldemPokerMaxRolling                  uint `json:"holdemPokerMaxRolling" gorm:"default:0"`
	HoldemPokerMinimumRolling              uint `json:"holdemPokerMinimumRolling" gorm:"default:0"`
	MinigameMinimumRolling                 uint `json:"minigameMinimumRolling" gorm:"default:0"`
	MinigameMinimumBetAmount               uint `json:"minigameMinimumBetAmount" gorm:"default:0"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
