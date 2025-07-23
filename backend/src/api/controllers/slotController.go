package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

// API configuration
// const (
// 	baseURL     = "https://api.honorlink.org/api"
// 	bearerToken = "bZmLGdUGa123lKpTvxU9uFbDtCQUa0pdLzNfbxkn79f33cc4"
// )

func GetGameItems(c *gin.Context) {
	vendor := c.Query("vendor")
	gameType := c.Query("type")

	endpoint := fmt.Sprintf("https://api.honorlink.org/api/game-list?vendor=%s&type=%s", vendor, gameType)
	bearerToken := "bZmLGdUGa123lKpTvxU9uFbDtCQUa0pdLzNfbxkn79f33cc4"
	client := &http.Client{}
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create test request",
			"details": err.Error(),
		})
		return
	}
	req.Header.Set("Authorization", "Bearer "+bearerToken)

	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch game items",
			"details": err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to read response body",
			"details": err.Error(),
		})
		return
	}

	var gameItems []map[string]interface{}
	err = json.Unmarshal(body, &gameItems)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse game items",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gameItems})
}

// // getGameLaunchLink retrieves the game launch link with token refresh handling
// func getGameLaunchLink(username, nickname string, gameConfig GameConfig) (string, error) {

// }
