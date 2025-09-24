package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// GetContactInfo retrieves the current contact information
func GetContactInfo(c *gin.Context) {
	var contact models.Contact

	// Get the first contact record (assuming there's only one global contact info)
	result := initializers.DB.First(&contact)

	if result.Error != nil {
		// If no contact record exists, return empty values
		contact = models.Contact{
			Phone:     "",
			Telegram:  "",
			KakaoTalk: "",
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    contact,
	})
}

// UpdateContactInfo updates the contact information
func UpdateContactInfo(c *gin.Context) {
	var contactInput struct {
		Phone     string `json:"phone"`
		Telegram  string `json:"telegram"`
		KakaoTalk string `json:"kakaoTalk"`
	}

	if err := c.ShouldBindJSON(&contactInput); err != nil {
		format_errors.BadRequestError(c, err)
		return
	}

	var contact models.Contact

	// Try to find existing contact record
	result := initializers.DB.First(&contact)

	if result.Error != nil {
		// If no contact record exists, create a new one
		contact = models.Contact{
			Phone:     contactInput.Phone,
			Telegram:  contactInput.Telegram,
			KakaoTalk: contactInput.KakaoTalk,
		}

		if err := initializers.DB.Create(&contact).Error; err != nil {
			format_errors.InternalServerError(c, err)
			return
		}
	} else {
		// Update existing contact record
		contact.Phone = contactInput.Phone
		contact.Telegram = contactInput.Telegram
		contact.KakaoTalk = contactInput.KakaoTalk

		if err := initializers.DB.Save(&contact).Error; err != nil {
			format_errors.InternalServerError(c, err)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Contact information updated successfully",
		"data":    contact,
	})
}
