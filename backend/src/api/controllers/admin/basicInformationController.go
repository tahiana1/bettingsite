package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
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
		Color:            "",          // Not available in current model
		OnOff:            user.Status, // Map status to OnOff
		AccountBlock:     user.Status,
		ResidentNumber:   "", // Not available in current model
		UseUSDT: func() string {
			if user.USDTAddress != "" {
				return "true"
			} else {
				return "false"
			}
		}(),
		WalletAddress:                          user.USDTAddress,
		LastDeposit:                            user.Profile.LastDeposit.Format("2006-01-02 15:04:05"),
		CurrencyExchangeRolling:                "0", // Default value
		CurrencyExchangeRollingBonus:           "0", // Default value
		ExchangeRollingBettingAmount:           "0", // Default value
		CurrencyRollover:                       "0", // Default value
		AmountHold:                             fmt.Sprintf("%.2f", user.Profile.Balance),
		AmountHoldPayment:                      "0", // Default value
		AmountHoldCollect:                      "0", // Default value
		Coupon:                                 fmt.Sprintf("%d", user.Profile.Coupon),
		CouponProcessing:                       "0", // Default value
		TotalLoss:                              "0", // Default value
		TotalLossProcessing:                    "0", // Default value
		RollingGold:                            fmt.Sprintf("%.2f", user.Profile.Roll),
		RollingGoldProcessing:                  "0",            // Default value
		SameIPCheck:                            user.CurrentIP, // Use current IP for same IP check
		RollingPercenty:                        "0",            // Default value
		SlotcityPriorityUse:                    "",             // Not available in current model
		WebLoginAvailable:                      "",             // Not available in current model
		ChangeOfDistributorProperties:          "",             // Not available in current model
		DelegationOfAdminstrator:               "",             // Not available in current model
		SignUpCode:                             "",             // Not available in current model
		CodeSignupAvailable:                    "",             // Not available in current model
		DisplayMemberCode:                      "",             // Not available in current model
		InitialLevelOfAcquaintanceRegistration: "",             // Not available in current model
		MemberPageAlarmSound:                   "",             // Not available in current model
		UseAttendanceCheck:                     "",             // Not available in current model
		UseRoulette:                            "",             // Not available in current model
		CustomerCenterInquiryAvailable:         "",             // Not available in current model
		CreatePost:                             "",             // Not available in current model
		WhiteCommentOnPost:                     "",             // Not available in current model
		PointsAwardedForThePost:                "",             // Not available in current model
		UsingVirtualAccountApi:                 "",             // Not available in current model
		UsingOfWinningPoints:                   "",             // Not available in current model
		UsePaybackPayment:                      "",             // Not available in current model
		UseRefundLimit:                         "",             // Not available in current model
		DailyFirstDepositBonusLimit:            "",             // Not available in current model
		SignUpFirstDepositBonusLimit:           "",             // Not available in current model
		ReplenishmentBonusLimit:                "",             // Not available in current model
		SurpriseBonusLimit:                     "",             // Not available in current model
		IgnoreOption:                           "",             // Not available in current model
		RollingConversionAutomaticApproval:     "",             // Not available in current model
		CutBettingHistory:                      "",             // Not available in current model
		MaximumAmountOfBettingHistoryReduction: "",             // Not available in current model
		PercentageReductionInBettingAmount:     "",             // Not available in current model
		WaitingTimeForReApplicationAfterCurrencyExchangeIsCompleted:   "", // Not available in current model
		WaitingTimeForReApplicationAfterChargingIsCompleted:           "", // Not available in current model
		WaitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted: "", // Not available in current model
		ChangeMemberProperties:                      "",             // Not available in current model
		Distributor:                                 "",             // Not available in current model
		ChangeOfMemberProperties:                    "",             // Not available in current model
		DisplayOfAdministrator:                      "",             // Not available in current model
		PartnerButtonDisplay:                        "",             // Not available in current model
		PartnerMultiAccessPossible:                  "",             // Not available in current model
		DisplayPartnerReductionDetail:               "",             // Not available in current model
		DisplayPartnerRollingPaymentRecoveryHistory: "",             // Not available in current model
		CreateSubDistributor:                        "",             // Not available in current model
		CreateSubordinatorDirectMember:              "",             // Not available in current model
		AccessToSubDetails:                          "",             // Not available in current model
		AccessToSubBankInformation:                  "",             // Not available in current model
		LowerConnectionCanBeKicked:                  "",             // Not available in current model
		SubMoneyPayable:                             "",             // Not available in current model
		LowerMoneyRecoveryPossible:                  "",             // Not available in current model
		LowerLosingChangePossible:                   "",             // Not available in current model
		LowerRollingChangeable:                      "",             // Not available in current model
		ReferalBenefitsMember:                       "",             // Not available in current model
		ReferalBenefitsMini:                         "",             // Not available in current model
		ReferalBenefitsVirtual:                      "",             // Not available in current model
		ReferalBenefitsSportsSinglePoles:            "",             // Not available in current model
		ReferalBenefitsSports2Poles:                 "",             // Not available in current model
		ReferalBenefitsSports3Poles:                 "",             // Not available in current model
		ReferalBenefitsSports4Poles:                 "",             // Not available in current model
		ReferalBenefitsSportsDapol:                  "",             // Not available in current model
		SportsBettingAllowed:                        "",             // Not available in current model
		MinimumFolderForSportsBetting:               "",             // Not available in current model
		AccountMemo:                                 "",             // Not available in current model
		AdminNote:                                   "",             // Not available in current model
		AdminMemo2:                                  "",             // Not available in current model
		XXX:                                         user.CurrentIP, // Use current IP for allowed IP address
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
		// Color field doesn't exist in current model - could add it later
		c.JSON(http.StatusOK, gin.H{
			"message": "Color field updated (not stored in database)",
			"field":   field,
			"value":   value,
		})
		return
	case "onoff":
		user.Status = value
	case "accountblock":
		user.Status = value
	case "residentNumber":
		// ResidentNumber field doesn't exist in current model - could add it later
		c.JSON(http.StatusOK, gin.H{
			"message": "Resident number field updated (not stored in database)",
			"field":   field,
			"value":   value,
		})
		return
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
