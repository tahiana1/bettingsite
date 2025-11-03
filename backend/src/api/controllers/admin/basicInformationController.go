package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// BasicInformationResponse represents the response structure for basic information
type BasicInformationResponse struct {
	ID                                                            string `json:"id"`
	Nickname                                                      string `json:"nickname"`
	ExchangePassword                                              string `json:"exchangePassword"`
	Allas                                                         string `json:"allas"`
	Depositor                                                     string `json:"depositor"`
	BankName                                                      string `json:"bankName"`
	AccountNumber                                                 string `json:"accountNumber"`
	CellphoneCarrier                                              string `json:"cellphoneCarrier"`
	Cellphone                                                     string `json:"cellphone"`
	Birthday                                                      string `json:"birthday"`
	TopDistributor                                                string `json:"topDistributor"`
	Recommender                                                   string `json:"recommender"`
	Level                                                         int32  `json:"level"`
	MemberType                                                    string `json:"memberType"`
	Color                                                         string `json:"color"`
	OnOff                                                         string `json:"onOff"`
	AccountBlock                                                  string `json:"accountBlock"`
	ResidentNumber                                                string `json:"residentNumber"`
	UseUSDT                                                       string `json:"useUSDT"`
	WalletAddress                                                 string `json:"walletAddress"`
	LastDeposit                                                   string `json:"lastDeposit"`
	CurrencyExchangeRolling                                       string `json:"currencyExchangeRolling"`
	CurrencyExchangeRollingBonus                                  string `json:"currencyExchangeRollingBonus"`
	ExchangeRollingBettingAmount                                  string `json:"exchangeRollingBettingAmount"`
	CurrencyRollover                                              string `json:"currencyRollover"`
	AmountHold                                                    string `json:"amountHold"`
	AmountHoldPayment                                             string `json:"amountHoldPayment"`
	AmountHoldCollect                                             string `json:"amountHoldCollect"`
	Coupon                                                        string `json:"coupon"`
	CouponProcessing                                              string `json:"couponProcessing"`
	TotalLoss                                                     string `json:"totalLoss"`
	TotalLossProcessing                                           string `json:"totalLossProcessing"`
	RollingGold                                                   string `json:"rollingGold"`
	RollingGoldProcessing                                         string `json:"rollingGoldProcessing"`
	SameIPCheck                                                   string `json:"sameIPCheck"`
	RollingPercenty                                               string `json:"rollingPercenty"`
	SlotcityPriorityUse                                           string `json:"slotcityPriorityUse"`
	WebLoginAvailable                                             string `json:"webLoginAvailable"`
	ChangeOfDistributorProperties                                 string `json:"changeOfDistributorProperties"`
	DelegationOfAdminstrator                                      string `json:"delegationOfAdminstrator"`
	SignUpCode                                                    string `json:"signUpCode"`
	CodeSignupAvailable                                           string `json:"codeSignupAvailable"`
	DisplayMemberCode                                             string `json:"displayMemberCode"`
	InitialLevelOfAcquaintanceRegistration                        string `json:"initialLevelOfAcquaintanceRegistration"`
	MemberPageAlarmSound                                          string `json:"memberPageAlarmSound"`
	UseAttendanceCheck                                            string `json:"useAttendanceCheck"`
	UseRoulette                                                   string `json:"useRoulette"`
	CustomerCenterInquiryAvailable                                string `json:"customerCenterInquiryAvailable"`
	CreatePost                                                    string `json:"createPost"`
	WhiteCommentOnPost                                            string `json:"whiteCommentOnPost"`
	PointsAwardedForThePost                                       string `json:"pointsAwardedForThePost"`
	UsingVirtualAccountApi                                        string `json:"usingVirtualAccountApi"`
	UsingOfWinningPoints                                          string `json:"usingOfWinningPoints"`
	UsePaybackPayment                                             string `json:"usePaybackPayment"`
	UseRefundLimit                                                string `json:"useRefundLimit"`
	DailyFirstDepositBonusLimit                                   string `json:"dailyFirstDepositBonusLimit"`
	SignUpFirstDepositBonusLimit                                  string `json:"signUpFirstDepositBonusLimit"`
	ReplenishmentBonusLimit                                       string `json:"replenishmentBonusLimit"`
	SurpriseBonusLimit                                            string `json:"surpriseBonusLimit"`
	IgnoreOption                                                  string `json:"ignoreOption"`
	RollingConversionAutomaticApproval                            string `json:"rollingConversionAutomaticApproval"`
	CutBettingHistory                                             string `json:"cutBettingHistory"`
	MaximumAmountOfBettingHistoryReduction                        string `json:"maximumAmountOfBettingHistoryReduction"`
	PercentageReductionInBettingAmount                            string `json:"percentageReductionInBettingAmount"`
	WaitingTimeForReApplicationAfterCurrencyExchangeIsCompleted   string `json:"waitingTimeForReApplicationAfterCurrencyExchangeIsCompleted"`
	WaitingTimeForReApplicationAfterChargingIsCompleted           string `json:"waitingTimeForReApplicationAfterChargingIsCompleted"`
	WaitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted string `json:"waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted"`
	ChangeMemberProperties                                        string `json:"changeMemberProperties"`
	Distributor                                                   string `json:"distributor"`
	ChangeOfMemberProperties                                      string `json:"changeOfMemberProperties"`
	DisplayOfAdministrator                                        string `json:"displayOfAdministrator"`
	PartnerButtonDisplay                                          string `json:"partnerButtonDisplay"`
	PartnerMultiAccessPossible                                    string `json:"partnerMultiAccessPossible"`
	DisplayPartnerReductionDetail                                 string `json:"displayPartnerReductionDetail"`
	DisplayPartnerRollingPaymentRecoveryHistory                   string `json:"displayPartnerRollingPaymentRecoveryHistory"`
	CreateSubDistributor                                          string `json:"createSubDistributor"`
	CreateSubordinatorDirectMember                                string `json:"createSubordinatorDirectMember"`
	AccessToSubDetails                                            string `json:"accessToSubDetails"`
	AccessToSubBankInformation                                    string `json:"accessToSubBankInformation"`
	LowerConnectionCanBeKicked                                    string `json:"lowerConnectionCanBeKicked"`
	SubMoneyPayable                                               string `json:"subMoneyPayable"`
	LowerMoneyRecoveryPossible                                    string `json:"lowerMoneyRecoveryPossible"`
	LowerLosingChangePossible                                     string `json:"lowerLosingChangePossible"`
	LowerRollingChangeable                                        string `json:"lowerRollingChangeable"`
	ReferalBenefitsMember                                         string `json:"referalBenefitsMember"`
	ReferalBenefitsMini                                           string `json:"referalBenefitsMini"`
	ReferalBenefitsVirtual                                        string `json:"referalBenefitsVirtual"`
	ReferalBenefitsSportsSinglePoles                              string `json:"referalBenefitsSportsSinglePoles"`
	ReferalBenefitsSports2Poles                                   string `json:"referalBenefitsSports2Poles"`
	ReferalBenefitsSports3Poles                                   string `json:"referalBenefitsSports3Poles"`
	ReferalBenefitsSports4Poles                                   string `json:"referalBenefitsSports4Poles"`
	ReferalBenefitsSportsDapol                                    string `json:"referalBenefitsSportsDapol"`
	SportsBettingAllowed                                          string `json:"sportsBettingAllowed"`
	MinimumFolderForSportsBetting                                 string `json:"minimumFolderForSportsBetting"`
	AccountMemo                                                   string `json:"accountMemo"`
	AdminNote                                                     string `json:"adminNote"`
	AdminMemo2                                                    string `json:"adminMemo2"`
	XXX                                                           string `json:"xxx"`
	OS                                                            string `json:"os"`
	Device                                                        string `json:"device"`
	FingerPrint                                                   string `json:"fingerPrint"`
	IP                                                            string `json:"ip"`
	Live                                                          string `json:"live"`
	Slot                                                          string `json:"slot"`
	Hold                                                          string `json:"hold"`
	EntireLosing                                                  string `json:"entireLosing"`
	LiveLosingBeDang                                              string `json:"liveLosingBeDang"`
	SlotLosingBeDang                                              string `json:"slotLosingBeDang"`
	HoldLosingBeDang                                              string `json:"holdLosingBeDang"`
	LosingMethod                                                  string `json:"losingMethod"`
	MembershipDeposit                                             string `json:"membershipDeposit"`
	MembershipWithdrawal                                          string `json:"membershipWithdrawal"`
	TotalWithdrawal                                               string `json:"totalWithdrawal"`
	NumberOfMembers                                               string `json:"numberOfMembers"`
	RollingHoldings                                               string `json:"rollingHoldings"`
	LiveBetting                                                   string `json:"liveBetting"`
	LiveWinning                                                   string `json:"liveWinning"`
	SlotBetting                                                   string `json:"slotBetting"`
	SlotJackpot                                                   string `json:"slotJackpot"`
	RollingRate                                                   string `json:"rollingRate"`
	RollingTransition                                             string `json:"rollingTransition"`
	LosingRate                                                    string `json:"losingRate"`
	LosingSettlement                                              string `json:"losingSettlement"`
	PartnershipRolling                                            string `json:"partnershipRolling"`
	PartnershipMoneyInHand                                        string `json:"partnershipMoneyInHand"`
	CreatedAt                                                     string `json:"createdAt"`
	UpdatedAt                                                     string `json:"updatedAt"`
	CurrentIP                                                     string `json:"currentIP"`
}

// GetBasicInformation fetch the all informations with userid value
func GetBasicInformation(c *gin.Context) {
	userid := c.Param("userid")

	// Find user by userid (could be either userid string or ID number)
	var user models.User
	var result *gorm.DB

	// Try to find by ID first (if userid is a number)
	if id, err := strconv.Atoi(userid); err == nil {
		result = initializers.DB.Where("id = ?", id).Preload("Profile").First(&user)
	} else {
		// If not a number, search by userid string
		result = initializers.DB.Where("userid = ?", userid).Preload("Profile").First(&user)
	}

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	// Map user data to response
	response := BasicInformationResponse{
		ID:               user.Userid,
		Nickname:         user.Profile.Nickname,
		ExchangePassword: user.SecPassword,
		Allas:            user.Name,
		Depositor:        user.Profile.HolderName,
		BankName:         user.Profile.BankName,
		AccountNumber:    user.Profile.AccountNumber,
		Cellphone:        user.Profile.Mobile,
		Birthday:         user.Profile.Birthday.Format("2006-01-02"),
		TopDistributor:   user.Profile.Referral,
		Recommender:      user.Profile.Referral,
		Level:            user.Profile.Level,
		MemberType:       user.Type,
		Color:            user.Color,
		OnOff:            user.Status, // Map status to OnOff
		AccountBlock:     user.Status,
		ResidentNumber:   user.ResidentNumber,
		UseUSDT: func() string {
			if user.USDTAddress != "" {
				return "true"
			} else {
				return "false"
			}
		}(),
		WalletAddress:                user.USDTAddress,
		LastDeposit:                  user.Profile.LastDeposit.Format("2006-01-02 15:04:05"),
		CurrencyExchangeRolling:      "0", // Default value
		CurrencyExchangeRollingBonus: "0", // Default value
		ExchangeRollingBettingAmount: "0", // Default value
		CurrencyRollover:             "0", // Default value
		AmountHold:                   fmt.Sprintf("%.2f", user.Profile.Balance),
		AmountHoldPayment:            "0", // Default value
		AmountHoldCollect:            "0", // Default value
		Coupon:                       fmt.Sprintf("%d", user.Profile.Coupon),
		CouponProcessing:             "0", // Default value
		TotalLoss:                    "0", // Default value
		TotalLossProcessing:          "0", // Default value
		RollingGold:                  fmt.Sprintf("%.2f", user.Profile.Roll),
		RollingGoldProcessing:        "0",            // Default value
		SameIPCheck:                  user.CurrentIP, // Use current IP for same IP check
		RollingPercenty:              "0",            // Default value
		SlotcityPriorityUse: func() string {
			if user.SlotcityPriorityUse {
				return "true"
			}
			return "false"
		}(),
		WebLoginAvailable:                      user.WebLoginAvailable,
		ChangeOfDistributorProperties:          user.ChangeOfDistributorProperties,
		DelegationOfAdminstrator:               user.DelegationOfAdministrator,
		SignUpCode:                             user.SignUpCode,
		CodeSignupAvailable:                    user.CodeSignupAvailable,
		DisplayMemberCode:                      user.DisplayMemberCode,
		InitialLevelOfAcquaintanceRegistration: user.InitialLevelOfAcquaintanceRegistration,
		MemberPageAlarmSound:                   user.MemberPageAlarmSound,
		UseAttendanceCheck:                     user.UseAttendanceCheck,
		UseRoulette:                            user.UseRoulette,
		CustomerCenterInquiryAvailable:         user.CustomerCenterInquiryAvailable,
		CreatePost:                             user.CreatePost,
		WhiteCommentOnPost:                     user.WhiteCommentOnPost,
		PointsAwardedForThePost:                user.PointsAwardedForThePost,
		UsingVirtualAccountApi:                 user.UsingVirtualAccountApi,
		UsingOfWinningPoints:                   user.UsingOfWinningPoints,
		UsePaybackPayment:                      user.UsePaybackPayment,
		UseRefundLimit:                         user.UseRefundLimit,
		DailyFirstDepositBonusLimit:            user.DailyFirstDepositBonusLimit,
		SignUpFirstDepositBonusLimit:           user.SignUpFirstDepositBonusLimit,
		ReplenishmentBonusLimit:                user.ReplenishmentBonusLimit,
		SurpriseBonusLimit:                     user.SurpriseBonusLimit,
		IgnoreOption:                           user.IgnoreOption,
		RollingConversionAutomaticApproval:     user.RollingConversionAutomaticApproval,
		CutBettingHistory:                      user.CutBettingHistory,
		MaximumAmountOfBettingHistoryReduction: user.MaximumAmountOfBettingHistoryReduction,
		PercentageReductionInBettingAmount:     user.PercentageReductionInBettingAmount,
		WaitingTimeForReApplicationAfterCurrencyExchangeIsCompleted:   fmt.Sprintf("%d", user.WaitingTimeAfterCurrencyExchange),
		WaitingTimeForReApplicationAfterChargingIsCompleted:           fmt.Sprintf("%d", user.WaitingTimeAfterCharging),
		WaitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted: fmt.Sprintf("%d", user.WaitingTimeForExchangeRequest),
		ChangeMemberProperties:                      user.ChangeMemberProperties,
		Distributor:                                 user.Distributor,
		ChangeOfMemberProperties:                    user.ChangeOfMemberProperties,
		DisplayOfAdministrator:                      user.DisplayOfAdministrator,
		PartnerButtonDisplay:                        user.PartnerButtonDisplay,
		PartnerMultiAccessPossible:                  user.PartnerMultiAccessPossible,
		DisplayPartnerReductionDetail:               user.DisplayPartnerReductionDetail,
		DisplayPartnerRollingPaymentRecoveryHistory: user.DisplayPartnerRollingPaymentRecoveryHistory,
		CreateSubDistributor:                        user.CreateSubDistributor,
		CreateSubordinatorDirectMember:              user.CreateSubordinatorDirectMember,
		AccessToSubDetails:                          user.AccessToSubDetails,
		AccessToSubBankInformation:                  user.AccessToSubBankInformation,
		LowerConnectionCanBeKicked:                  user.LowerConnectionCanBeKicked,
		SubMoneyPayable:                             user.SubMoneyPayable,
		LowerMoneyRecoveryPossible:                  user.LowerMoneyRecoveryPossible,
		LowerLosingChangePossible:                   user.LowerLosingChangePossible,
		LowerRollingChangeable:                      user.LowerRollingChangeable,
		ReferalBenefitsMember:                       user.ReferalBenefitsMember,
		ReferalBenefitsMini:                         user.ReferalBenefitsMini,
		ReferalBenefitsVirtual:                      user.ReferalBenefitsVirtual,
		ReferalBenefitsSportsSinglePoles:            user.ReferalBenefitsSportsSinglePoles,
		ReferalBenefitsSports2Poles:                 user.ReferalBenefitsSports2Poles,
		ReferalBenefitsSports3Poles:                 user.ReferalBenefitsSports3Poles,
		ReferalBenefitsSports4Poles:                 user.ReferalBenefitsSports4Poles,
		ReferalBenefitsSportsDapol:                  user.ReferalBenefitsSportsDapol,
		SportsBettingAllowed:                        user.SportsBettingAllowed,
		MinimumFolderForSportsBetting:               user.MinimumFolderForSportsBetting,
		AccountMemo:                                 user.AccountMemo,
		AdminNote:                                   user.AdminNote,
		AdminMemo2:                                  user.AdminMemo2,
		XXX:                                         user.AllowedIPAddress,
		OS:                                          user.OS,
		Device:                                      user.Device,
		FingerPrint:                                 user.FingerPrint,
		IP:                                          user.IP,
		Live:                                        fmt.Sprintf("%.2f", user.Live),
		Slot:                                        fmt.Sprintf("%.2f", user.Slot),
		Hold:                                        fmt.Sprintf("%.2f", user.Hold),
		EntireLosing:                                fmt.Sprintf("%.2f", user.EntireLosing),
		LiveLosingBeDang:                            fmt.Sprintf("%.2f", user.LiveLosingBeDang),
		SlotLosingBeDang:                            fmt.Sprintf("%.2f", user.SlotLosingBeDang),
		HoldLosingBeDang:                            fmt.Sprintf("%.2f", user.HoldLosingBeDang),
		LosingMethod:                                user.LosingMethod,
		MembershipDeposit:                           fmt.Sprintf("%.2f", user.MembershipDeposit),
		MembershipWithdrawal:                        fmt.Sprintf("%.2f", user.MembershipWithdrawal),
		TotalWithdrawal:                             fmt.Sprintf("%.2f", user.TotalWithdrawal),
		NumberOfMembers:                             fmt.Sprintf("%d", user.NumberOfMembers),
		RollingHoldings:                             fmt.Sprintf("%.2f", user.RollingHoldings),
		LiveBetting:                                 fmt.Sprintf("%.2f", user.LiveBetting),
		LiveWinning:                                 fmt.Sprintf("%.2f", user.LiveWinning),
		SlotBetting:                                 fmt.Sprintf("%.2f", user.SlotBetting),
		SlotJackpot:                                 fmt.Sprintf("%.2f", user.SlotJackpot),
		RollingRate:                                 fmt.Sprintf("%.2f", user.RollingRate),
		RollingTransition:                           fmt.Sprintf("%.2f", user.RollingTransition),
		LosingRate:                                  fmt.Sprintf("%.2f", user.LosingRate),
		LosingSettlement:                            fmt.Sprintf("%.2f", user.LosingSettlement),
		PartnershipRolling:                          fmt.Sprintf("%.2f", user.PartnershipRolling),
		PartnershipMoneyInHand:                      fmt.Sprintf("%.2f", user.PartnershipMoneyInHand),
		CreatedAt:                                   user.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:                                   user.UpdatedAt.Format("2006-01-02 15:04:05"),
		CurrentIP:                                   user.CurrentIP,
	}

	c.JSON(http.StatusOK, response)
}

// UpdateBasicInformationRequest represents the request structure for updating basic information
type UpdateBasicInformationRequest struct {
	Field string `json:"field"`
	Value string `json:"value"`
}

// UpdateBasicInformation handles updates for user basic information fields
func UpdateBasicInformation(c *gin.Context) {
	userid := c.Param("userid")
	var req UpdateBasicInformationRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request format",
		})
		return
	}

	// Find user by userid (could be either userid string or ID number)
	var user models.User
	var result *gorm.DB

	// Try to find by ID first (if userid is a number)
	if id, err := strconv.Atoi(userid); err == nil {
		result = initializers.DB.Where("id = ?", id).Preload("Profile").First(&user)
	} else {
		// If not a number, search by userid string
		result = initializers.DB.Where("userid = ?", userid).Preload("Profile").First(&user)
	}

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	// Update the specific field based on the incoming field name
	field := req.Field
	value := req.Value

	switch field {
	case "id":
		user.Userid = value
	case "nickname":
		updateProfileField(c, userid, field, value, []string{"Profile.Nickname"})
		return
	case "exchangePassword":
		user.SecPassword = value
	case "allas":
		user.Name = value
	case "depositor":
		updateProfileField(c, userid, field, value, []string{"Profile.HolderName"})
		return
	case "bankName":
		updateProfileField(c, userid, field, value, []string{"Profile.BankName"})
		return
	case "accountnumber":
		updateProfileField(c, userid, field, value, []string{"Profile.AccountNumber"})
		return
	case "cellphone":
		updateProfileField(c, userid, field, value, []string{"Profile.Mobile"})
		return
	case "birthday":
		updateProfileField(c, userid, field, value, []string{"Profile.Birthday"})
		return
	case "topDistributor":
		updateProfileField(c, userid, field, value, []string{"Profile.Referral"})
		return
	case "recommender":
		updateProfileField(c, userid, field, value, []string{"Profile.Referral"})
		return
	case "level":
		updateProfileField(c, userid, field, value, []string{"Profile.Level"})
		return
	case "memberType":
		user.Type = value
	case "color":
		user.Color = value
	case "onoff":
		user.Status = value
	case "accountblock":
		user.Status = value
	case "residentNumber":
		user.ResidentNumber = value
	case "useUSDT":
		if value == "true" && user.USDTAddress == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "USDT wallet address is required when enabling USDT",
			})
			return
		}
		// USDT use is determined by whether address exists, so no direct field to update
		c.JSON(http.StatusOK, gin.H{
			"message": "USDT usage determined by wallet address availability",
			"field":   field,
			"value":   value,
		})
		return
	case "walletAddress":
		user.USDTAddress = value
	case "amountHold":
		updateProfileField(c, userid, field, value, []string{"Profile.Balance"})
		return
	case "coupon":
		updateProfileField(c, userid, field, value, []string{"Profile.Coupon"})
		return
	case "rollingGold":
		updateProfileField(c, userid, field, value, []string{"Profile.Roll"})
		return

	// New fields for admin settings and permissions
	case "slotcityPriorityUse":
		user.SlotcityPriorityUse = (value == "true" || value == "1")
	case "webLoginAvailable":
		user.WebLoginAvailable = value
	case "changeOfDistributorProperties":
		user.ChangeOfDistributorProperties = value
	case "delegationOfAdminstrator":
		user.DelegationOfAdministrator = value
	case "signUpCode":
		user.SignUpCode = value
	case "codeSignupAvailable":
		user.CodeSignupAvailable = value
	case "displayMemberCode":
		user.DisplayMemberCode = value
	case "initialLevelOfAcquaintanceRegistration":
		user.InitialLevelOfAcquaintanceRegistration = value
	case "memberPageAlarmSound":
		user.MemberPageAlarmSound = value
	case "useAttendanceCheck":
		user.UseAttendanceCheck = value
	case "useRoulette":
		user.UseRoulette = value
	case "customerCenterInquiryAvailable":
		user.CustomerCenterInquiryAvailable = value
	case "createPost":
		user.CreatePost = value
	case "whiteCommentOnPost":
		user.WhiteCommentOnPost = value
	case "pointsAwardedForThePost":
		user.PointsAwardedForThePost = value
	case "usingVirtualAccountApi":
		user.UsingVirtualAccountApi = value
	case "usingOfWinningPoints":
		user.UsingOfWinningPoints = value
	case "usePaybackPayment":
		user.UsePaybackPayment = value
	case "useRefundLimit":
		user.UseRefundLimit = value
	case "dailyFirstDepositBonusLimit":
		user.DailyFirstDepositBonusLimit = value
	case "signUpFirstDepositBonusLimit":
		user.SignUpFirstDepositBonusLimit = value
	case "replenishmentBonusLimit":
		user.ReplenishmentBonusLimit = value
	case "surpriseBonusLimit":
		user.SurpriseBonusLimit = value
	case "ignoreOption":
		user.IgnoreOption = value
	case "rollingConversionAutomaticApproval":
		user.RollingConversionAutomaticApproval = value
	case "cutBettingHistory":
		user.CutBettingHistory = value
	case "maximumAmountOfBettingHistoryReduction":
		user.MaximumAmountOfBettingHistoryReduction = value
	case "percentageReductionInBettingAmount":
		user.PercentageReductionInBettingAmount = value
	case "waitingTimeForReApplicationAfterCurrencyExchangeIsCompleted":
		if waitTime, err := strconv.Atoi(value); err == nil {
			user.WaitingTimeAfterCurrencyExchange = waitTime
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid waiting time format. Must be a number",
			})
			return
		}
	case "waitingTimeForReApplicationAfterChargingIsCompleted":
		if waitTime, err := strconv.Atoi(value); err == nil {
			user.WaitingTimeAfterCharging = waitTime
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid waiting time format. Must be a number",
			})
			return
		}
	case "waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted":
		if waitTime, err := strconv.Atoi(value); err == nil {
			user.WaitingTimeForExchangeRequest = waitTime
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid waiting time format. Must be a number",
			})
			return
		}
	case "changeMemberProperties":
		user.ChangeMemberProperties = value
	case "distributor":
		user.Distributor = value
	case "changeOfMemberProperties":
		user.ChangeOfMemberProperties = value
	case "displayOfAdministrator":
		user.DisplayOfAdministrator = value
	case "partnerButtonDisplay":
		user.PartnerButtonDisplay = value
	case "partnerMultiAccessPossible":
		user.PartnerMultiAccessPossible = value
	case "displayPartnerReductionDetail":
		user.DisplayPartnerReductionDetail = value
	case "displayPartnerRollingPaymentRecoveryHistory":
		user.DisplayPartnerRollingPaymentRecoveryHistory = value
	case "createSubDistributor":
		user.CreateSubDistributor = value
	case "createSubordinatorDirectMember":
		user.CreateSubordinatorDirectMember = value
	case "accessToSubDetails":
		user.AccessToSubDetails = value
	case "accessToSubBankInformation":
		user.AccessToSubBankInformation = value
	case "lowerConnectionCanBeKicked":
		user.LowerConnectionCanBeKicked = value
	case "subMoneyPayable":
		user.SubMoneyPayable = value
	case "lowerMoneyRecoveryPossible":
		user.LowerMoneyRecoveryPossible = value
	case "lowerLosingChangePossible":
		user.LowerLosingChangePossible = value
	case "lowerRollingChangeable":
		user.LowerRollingChangeable = value
	case "referalBenefitsMember":
		user.ReferalBenefitsMember = value
	case "referalBenefitsMini":
		user.ReferalBenefitsMini = value
	case "referalBenefitsVirtual":
		user.ReferalBenefitsVirtual = value
	case "referalBenefitsSportsSinglePoles":
		user.ReferalBenefitsSportsSinglePoles = value
	case "referalBenefitsSports2Poles":
		user.ReferalBenefitsSports2Poles = value
	case "referalBenefitsSports3Poles":
		user.ReferalBenefitsSports3Poles = value
	case "referalBenefitsSports4Poles":
		user.ReferalBenefitsSports4Poles = value
	case "referalBenefitsSportsDapol":
		user.ReferalBenefitsSportsDapol = value
	case "sportsBettingAllowed":
		user.SportsBettingAllowed = value
	case "minimumFolderForSportsBetting":
		user.MinimumFolderForSportsBetting = value
	case "accountMemo":
		user.AccountMemo = value
	case "adminNote":
		user.AdminNote = value
	case "adminMemo2":
		user.AdminMemo2 = value
	case "xxx":
		user.AllowedIPAddress = value
	case "onlineStatus":
		// Convert string value to boolean
		oldStatus := user.OnlineStatus
		newStatus := (value == "true" || value == "1")
		
		// If changing from true to false, notify user to logout
		if oldStatus && !newStatus {
			user.OnlineStatus = newStatus
			// Save first to update the status
			if err := initializers.DB.Save(&user).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Failed to update user",
				})
				return
			}
			// Notify user via Redis to logout
			if err := helpers.NotifyUserLogout(user.ID); err != nil {
				// Log error but don't fail the request since status is already updated
				fmt.Printf("Warning: Failed to notify user logout via Redis: %v\n", err)
			}
			
			c.JSON(http.StatusOK, gin.H{
				"message": "User online status updated and logout notification sent",
				"field":   field,
				"value":   value,
			})
			return
		}
		
		user.OnlineStatus = newStatus
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Unknown field: " + field,
		})
		return
	}

	// Save the user changes
	if err := initializers.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update user",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Field updated successfully",
		"field":   field,
		"value":   value,
	})
}

// updateProfileField is a helper function to update Profile fields
func updateProfileField(c *gin.Context, userid string, field string, value string, profileFields []string) {
	// Find user by userid (could be either userid string or ID number)
	var user models.User
	var result *gorm.DB

	// Try to find by ID first (if userid is a number)
	if id, err := strconv.Atoi(userid); err == nil {
		result = initializers.DB.Where("id = ?", id).Preload("Profile").First(&user)
	} else {
		// If not a number, search by userid string
		result = initializers.DB.Where("userid = ?", userid).Preload("Profile").First(&user)
	}

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	// Update Profile fields based on the field name
	switch field {
	case "nickname":
		user.Profile.Nickname = value
	case "depositor":
		user.Profile.HolderName = value
	case "bankName":
		user.Profile.BankName = value
	case "accountnumber":
		user.Profile.AccountNumber = value
	case "cellphone":
		user.Profile.Mobile = value
	case "birthday":
		if birthday, err := time.Parse("2006-01-02", value); err == nil {
			user.Profile.Birthday = birthday
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid date format. Use YYYY-MM-DD",
			})
			return
		}
	case "topDistributor", "recommender":
		user.Profile.Referral = value
	case "level":
		if level, err := strconv.Atoi(value); err == nil {
			user.Profile.Level = int32(level)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid level format. Must be a number",
			})
			return
		}
	case "amountHold":
		if balance, err := strconv.ParseFloat(value, 64); err == nil {
			user.Profile.Balance = balance
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid balance format. Must be a number",
			})
			return
		}
	case "coupon":
		if coupon, err := strconv.Atoi(value); err == nil {
			user.Profile.Coupon = int32(coupon)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid coupon format. Must be a number",
			})
			return
		}
	case "rollingGold":
		if roll, err := strconv.ParseFloat(value, 64); err == nil {
			user.Profile.Roll = roll
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid roll format. Must be a number",
			})
			return
		}
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Unknown profile field: " + field,
		})
		return
	}

	// Save the profile changes
	if err := initializers.DB.Save(&user.Profile).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update profile",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile field updated successfully",
		"field":   field,
		"value":   value,
	})
}
