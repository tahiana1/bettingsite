package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

// API configuration
// const (
// 	baseURL     = "https://api.honorlink.org/api"
// 	bearerToken = "srDiqct6lH61a0zHNKPUu0IwE0mg7Ht38sALu3oWb5bf8e9d"
// )

func GetGameItems(c *gin.Context) {
	vendor := c.Query("vendor")
	gameType := c.Query("type")

	endpoint := fmt.Sprintf("https://api.honorlink.org/api/game-list?vendor=%s&type=%s", vendor, gameType)
	bearerToken := "srDiqct6lH61a0zHNKPUu0IwE0mg7Ht38sALu3oWb5bf8e9d"
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
func GetSlotLaunchLink(c *gin.Context) {
	username := c.Query("username")
	nickname := c.Query("nickname")
	gameID := c.Query("game_id")
	vendor := c.Query("vendor")

	reqURL, err := url.Parse("https://api.honorlink.org/api/game-launch-link")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse game launch link",
			"details": err.Error(),
		})
		return
	}

	q := reqURL.Query()
	q.Set("username", username)
	q.Set("nickname", nickname)
	q.Set("game_id", fmt.Sprintf("%v", gameID))
	q.Set("vendor", vendor)

	// Use user token if provided, otherwise use bearer token
	// if userToken != "" {
	// 	q.Set("token", userToken)
	// }

	reqURL.RawQuery = q.Encode()

	req, err := http.NewRequest("GET", reqURL.String(), nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create test request",
			"details": err.Error(),
		})
		return
	}

	// Set appropriate headers
	req.Header.Set("Authorization", "Bearer "+bearerToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
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

	if resp.StatusCode != 200 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to get game link",
			"details": fmt.Sprintf("status: %d, body: %s", resp.StatusCode, string(body)),
		})
		return
	}

	// Parse response to get the link
	var response map[string]interface{}
	if err := json.Unmarshal(body, &response); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to parse game link",
			"details": err.Error(),
		})
		return
	}

	// Try different possible response field names
	for _, field := range []string{"link", "url", "game_link"} {
		if link, ok := response[field].(string); ok {
			c.JSON(http.StatusOK, gin.H{"data": link})
			return
		}
	}

	// If no link found in response, return the raw response
	c.JSON(http.StatusOK, gin.H{"data": string(body)})
}
