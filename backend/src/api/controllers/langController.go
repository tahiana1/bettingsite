package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

func GetLang(c *gin.Context) {

	locale := c.Param("locale")
	cwd, _ := os.Getwd()
	lang, err := os.ReadFile(filepath.Join(cwd, "static", "lang", locale))
	fmt.Println(filepath.Join(cwd, "static", "lang", locale))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to read JSON file"})
		return
	}
	c.Data(http.StatusOK, "application/json", lang)
}

// GetPublicContactInfo retrieves contact information for public use (no authentication required)
func GetPublicContactInfo(c *gin.Context) {
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
