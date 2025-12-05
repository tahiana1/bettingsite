package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// PartnerUserBasicInformationResponse represents the response structure for user basic information
type PartnerUserBasicInformationResponse struct {
	ID                              string `json:"id"`
	Nickname                        string `json:"nickname"`
	Depositor                       string `json:"depositor"`
	AccountNumber                   string `json:"accountNumber"`
	ResidentNumber                  string `json:"residentNumber"`
	Birthday                        string `json:"birthday"`
	CellphoneCarrier                string `json:"cellphoneCarrier"`
	Cellphone                       string `json:"cellphone"`
	Level                           string `json:"level"`
	CurrentIP                       string `json:"currentIP"`
	RecentlyAccessedDomains         string `json:"recentlyAccessedDomains"`
	LastAccessDate                  string `json:"lastAccessDate"`
	Affiliation                     string `json:"affiliation"`
	Distributor                     string `json:"distributor"`
	SignUpPath                      string `json:"signUpPath"`
	RegistrationDomain              string `json:"registrationDomain"`
	DateOfRegistration              string `json:"dateOfRegistration"`
	SubscriptionIP                  string `json:"subscriptionIP"`
	AmountHold                      string `json:"amountHold"`
	Point                           string `json:"point"`
	LosingMoney                     string `json:"losingMoney"`
	RollingGold                     string `json:"rollingGold"`
	RollingPercentyLive             string `json:"rollingPercentyLive"`
	RollingPercentySlot             string `json:"rollingPercentySlot"`
	RollingPercentyHoldem           string `json:"rollingPercentyHoldem"`
	RollingPercentySportsSinglePole string `json:"rollingPercentySportsSinglePole"`
	RollingPercentySportsDupol      string `json:"rollingPercentySportsDupol"`
	RollingPercentySports3Pole      string `json:"rollingPercentySports3Pole"`
	RollingPercentySports4Pole      string `json:"rollingPercentySports4Pole"`
	RollingPercentySports5Pole      string `json:"rollingPercentySports5Pole"`
	RollingPercentySportsDapol      string `json:"rollingPercentySportsDapol"`
	RollingPercentyVirtualGame      string `json:"rollingPercentyVirtualGame"`
}

// checkPartnerUserAccess checks if the requested userid is the logged-in partner or a sub-user
// Sub-users are those where parent_id == partner.ID
func checkPartnerUserAccess(c *gin.Context, userid string) (*models.User, error) {
	// Get the authenticated partner user
	authUser, exists := c.Get("authUser")
	if !exists {
		return nil, fmt.Errorf("❌ Unauthorized")
	}

	partner, ok := authUser.(models.User)
	if !ok {
		return nil, fmt.Errorf("❌ Invalid user")
	}

	// Verify partner has role P
	if partner.Role != "P" {
		return nil, fmt.Errorf("❌ Access denied: Only partners can access this resource")
	}

	// Find the requested user
	var targetUser models.User
	var result *gorm.DB

	// Try to find by ID first (if userid is a number)
	if id, err := strconv.Atoi(userid); err == nil {
		result = initializers.DB.Where("id = ?", id).Preload("Profile").First(&targetUser)
	} else {
		// If not a number, search by userid string
		result = initializers.DB.Where("userid = ?", userid).Preload("Profile").First(&targetUser)
	}

	if result.Error != nil {
		return nil, fmt.Errorf("User not found")
	}

	// Check if the target user is the logged-in partner
	if targetUser.ID == partner.ID {
		return &targetUser, nil
	}

	// Check if the target user is a sub-user (parent_id = partner.ID)
	if targetUser.ParentID != nil && *targetUser.ParentID == partner.ID {
		return &targetUser, nil
	}

	// Access denied - user is not the partner or a sub-user
	return nil, fmt.Errorf("Access denied: You can only access your own information or your sub-users' information")
}

// GetPartnerUserBasicInformation fetch the basic information with userid value
func GetPartnerUserBasicInformation(c *gin.Context) {
	userid := c.Param("userid")

	// Check access authorization
	targetUser, err := checkPartnerUserAccess(c, userid)
	if err != nil {
		format_errors.ForbbidenError(c, err)
		return
	}

	// Get parent user info for affiliation
	var affiliation string
	if targetUser.ParentID != nil {
		var parentUser models.User
		if err := initializers.DB.First(&parentUser, *targetUser.ParentID).Preload("Profile").Error; err == nil {
			affiliation = fmt.Sprintf("%s(%s)", parentUser.Userid, parentUser.Profile.Nickname)
		}
	} else {
		// If no parent, show own info
		affiliation = fmt.Sprintf("%s(%s)", targetUser.Userid, targetUser.Profile.Nickname)
	}

	// Get distributor value (0 for member, 1 for distributor)
	distributor := "0"
	if targetUser.Role == "P" || targetUser.Role == "D" {
		distributor = "1"
	}

	// Get sign-up path (default to "Administrator" or from domain)
	signUpPath := "관리자" // Default to "Administrator" in Korean
	if targetUser.Domain != "" {
		signUpPath = targetUser.Domain
	}

	// Get registration domain
	registrationDomain := targetUser.Domain
	if registrationDomain == "" {
		registrationDomain = "N/A"
	}

	// Format dates
	dateOfRegistration := targetUser.CreatedAt.Format("2006-01-02 15:04:05")
	lastAccessDate := targetUser.UpdatedAt.Format("2006-01-02 15:04:05")
	if targetUser.CurrentIP != "" {
		// Use a more recent timestamp if available
		lastAccessDate = targetUser.UpdatedAt.Format("2006-01-02 15:04:05")
	}

	// Get subscription IP (IP at registration time)
	subscriptionIP := targetUser.IP
	if subscriptionIP == "" {
		subscriptionIP = ""
	}

	// Get recently accessed domains (from user's domain field or current domain)
	recentlyAccessedDomains := targetUser.Domain
	if recentlyAccessedDomains == "" {
		recentlyAccessedDomains = "N/A"
	}

	// Get losing money (total loss from bets)
	var losingMoney float64
	initializers.DB.Model(&models.Bet{}).
		Where("user_id = ? AND status = ?", targetUser.ID, "lost").
		Select("COALESCE(SUM(stake), 0)").
		Scan(&losingMoney)

	// Get cellphone carrier (extract from mobile if available, default to SKT)
	cellphoneCarrier := "SKT" // Default
	// You might want to extract this from the mobile number or store it separately

	// Format level
	level := fmt.Sprintf("%d레벨", targetUser.Profile.Level)
	if targetUser.Profile.Level >= 13 {
		if targetUser.Profile.Level == 13 {
			level = "VIP 1"
		} else if targetUser.Profile.Level == 14 {
			level = "VIP 2"
		} else if targetUser.Profile.Level == 15 {
			level = "Premium"
		}
	}

	response := PartnerUserBasicInformationResponse{
		ID:                              targetUser.Userid,
		Nickname:                        targetUser.Profile.Nickname,
		Depositor:                       targetUser.Profile.HolderName,
		AccountNumber:                   fmt.Sprintf("%d", targetUser.ID),
		ResidentNumber:                  targetUser.ResidentNumber,
		Birthday:                        targetUser.Profile.Birthday.Format("2006-01-02"),
		CellphoneCarrier:                cellphoneCarrier,
		Cellphone:                       targetUser.Profile.Mobile,
		Level:                           level,
		CurrentIP:                       targetUser.CurrentIP,
		RecentlyAccessedDomains:         recentlyAccessedDomains,
		LastAccessDate:                  lastAccessDate,
		Affiliation:                     affiliation,
		Distributor:                     distributor,
		SignUpPath:                      signUpPath,
		RegistrationDomain:              registrationDomain,
		DateOfRegistration:              dateOfRegistration,
		SubscriptionIP:                  subscriptionIP,
		AmountHold:                      fmt.Sprintf("%.0f", targetUser.Profile.Balance),
		Point:                           fmt.Sprintf("%d", targetUser.Profile.Point),
		LosingMoney:                     fmt.Sprintf("%.0f", losingMoney),
		RollingGold:                     fmt.Sprintf("%.0f", targetUser.Profile.Roll),
		RollingPercentyLive:             fmt.Sprintf("%.1f", targetUser.Live),
		RollingPercentySlot:             fmt.Sprintf("%.1f", targetUser.Slot),
		RollingPercentyHoldem:           fmt.Sprintf("%.1f", targetUser.Hold),
		RollingPercentySportsSinglePole: "0.0",
		RollingPercentySportsDupol:      "0.0",
		RollingPercentySports3Pole:      "0.0",
		RollingPercentySports4Pole:      "0.0",
		RollingPercentySports5Pole:      "0.0",
		RollingPercentySportsDapol:      "0.0",
		RollingPercentyVirtualGame:      "0.0",
	}

	c.JSON(http.StatusOK, response)
}

// UpdatePartnerUserBasicInformationRequest represents the request structure for updating basic information
type UpdatePartnerUserBasicInformationRequest struct {
	Field string `json:"field"`
	Value string `json:"value"`
}

// UpdatePartnerUserBasicInformation handles updates for user basic information fields
func UpdatePartnerUserBasicInformation(c *gin.Context) {
	userid := c.Param("userid")
	var req UpdatePartnerUserBasicInformationRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request format",
		})
		return
	}

	// Check access authorization
	targetUser, err := checkPartnerUserAccess(c, userid)
	if err != nil {
		format_errors.ForbbidenError(c, err)
		return
	}

	// Update the specific field based on the incoming field name
	field := req.Field
	value := req.Value

	switch field {
	case "nickname":
		targetUser.Profile.Nickname = value
		if err := initializers.DB.Save(&targetUser.Profile).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to update profile",
			})
			return
		}
	case "depositor":
		targetUser.Profile.HolderName = value
		if err := initializers.DB.Save(&targetUser.Profile).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to update profile",
			})
			return
		}
	case "accountnumber":
		targetUser.Profile.AccountNumber = value
		if err := initializers.DB.Save(&targetUser.Profile).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to update profile",
			})
			return
		}
	case "cellphone":
		targetUser.Profile.Mobile = value
		if err := initializers.DB.Save(&targetUser.Profile).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to update profile",
			})
			return
		}
	case "birthday":
		// Parse birthday from YYYY-MM-DD format
		if birthday, err := time.Parse("2006-01-02", value); err == nil {
			targetUser.Profile.Birthday = birthday
			if err := initializers.DB.Save(&targetUser.Profile).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Failed to update profile",
				})
				return
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid date format. Use YYYY-MM-DD",
			})
			return
		}
	case "level":
		if level, err := strconv.Atoi(value); err == nil {
			targetUser.Profile.Level = int32(level)
			if err := initializers.DB.Save(&targetUser.Profile).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "Failed to update profile",
				})
				return
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid level format. Must be a number",
			})
			return
		}
	default:
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Unknown or non-editable field: " + field,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Field updated successfully",
		"field":   field,
		"value":   value,
	})
}
