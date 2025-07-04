package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

// GameConfig holds the configuration for different game types
type GameConfig struct {
	GameID any
	Vendor string
}

// gameConfigs maps game names to their configurations
var gameConfigs = map[string]GameConfig{
	"Evolution":     {GameID: "evolution_baccarat_sicbo", Vendor: "evolution"},
	"Taishan":       {GameID: "taishan_baccarat", Vendor: "taishan"},
	"Asia Gaming":   {GameID: 0, Vendor: "Asia Gaming"},
	"Ejugi":         {GameID: "ezugi", Vendor: "ezugi"},
	"Allbet":        {GameID: "allBet_lobby", Vendor: "AllBet"},
	"Dream Gaming":  {GameID: "dgcasino", Vendor: "DreamGame"},
	"Pragmatic":     {GameID: "101", Vendor: "PragmaticPlay"},
	"Sexy Casino":   {GameID: "MX-LIVE-001", Vendor: "sexybcrt"},
	"Vivogaming":    {GameID: "vivo_lobby", Vendor: "vivo"},
	"WM Casino":     {GameID: "wmcasino", Vendor: "WM Live"},
	"BetgamesTV":    {GameID: "bg_baccarat", Vendor: "Betgames.tv"},
	"Bota Casino":   {GameID: "botacasino_baccarat", Vendor: "botacasino"},
	"Skywind":       {GameID: "sw_ro_spbac", Vendor: "Skywind"},
	"Dowin":         {GameID: "dowin_baccarat", Vendor: "dowin"},
	"Playtech":      {GameID: "ubal", Vendor: "PlayTech"},
	"One Touch":     {GameID: "onetouch_baccarat", Vendor: "onetouch"},
	"ALG Casino":    {GameID: "absolutelive", Vendor: "absolute"},
	"7Mojos":        {GameID: "7mojos_baccarat", Vendor: "7mojos"},
	"Hilton Casino": {GameID: "hiltoncasino_baccarat", Vendor: "hiltoncasino"},
}

// Default game configuration
var defaultGameConfig = GameConfig{
	GameID: "evolution_baccarat_sicbo",
	Vendor: "evolution",
}

// API configuration
const (
	baseURL     = "https://api.honorlink.org/api"
	bearerToken = "bZmLGdUGa123lKpTvxU9uFbDtCQUa0pdLzNfbxkn79f33cc4"
)

// TestAPIConnection tests the connection to the HonorLink API
func TestAPIConnection(c *gin.Context) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/user", baseURL), nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create test request",
			"details": err.Error(),
		})
		return
	}

	req.Header.Set("Authorization", "Bearer "+bearerToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to connect to API",
			"details": err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to read response",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":       "API connection test completed",
		"status_code":  resp.StatusCode,
		"response":     string(body),
		"base_url":     baseURL,
		"bearer_token": bearerToken[:10] + "...", // Only show first 10 chars for security
	})
}

func GetGameLink(c *gin.Context) {
	// Get parameters from query
	username := c.Query("username")
	gameName := c.Query("gameName")

	// Validate required parameters
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Username parameter is required",
		})
		return
	}

	// Set nickname to be the same as username
	nickname := username

	// Get game configuration
	gameConfig := getGameConfig(gameName)

	// Debug: Log the request details
	fmt.Printf("Debug: Checking user existence for username: %s, gameName: %s\n", username, gameName)

	// Ensure user exists
	if err := ensureUserExists(username); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to ensure user exists",
			"details": err.Error(),
		})
		return
	}

	// Get game launch link
	gameLink, err := getGameLaunchLink(username, nickname, gameConfig)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to get game link",
			"details": err.Error(),
		})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{
		"message": "Game link retrieved successfully",
		"link":    gameLink,
	})
}

// getGameConfig returns the game configuration for the given game name
func getGameConfig(gameName string) GameConfig {
	if gameName == "" {
		return defaultGameConfig
	}

	if config, exists := gameConfigs[gameName]; exists {
		// Use gameName as vendor as requested
		config.Vendor = strings.ToLower(strings.ReplaceAll(gameName, " ", ""))
		return config
	}

	// Return default config with gameName as vendor
	return GameConfig{
		GameID: "evolution_baccarat_sicbo",
		Vendor: strings.ToLower(strings.ReplaceAll(gameName, " ", "")),
	}
}

// ensureUserExists checks if user exists and creates if necessary
func ensureUserExists(username string) error {
	userExists, err := checkUserExists(username)
	if err != nil {
		return fmt.Errorf("failed to check user existence: %w", err)
	}

	if !userExists {
		if err := createUser(username); err != nil {
			return fmt.Errorf("failed to create user: %w", err)
		}
	}

	return nil
}

// checkUserExists checks if a user exists in the HonorLink API
func checkUserExists(username string) (bool, error) {
	reqURL, err := url.Parse(fmt.Sprintf("%s/user", baseURL))
	if err != nil {
		return false, fmt.Errorf("failed to parse URL: %w", err)
	}

	q := reqURL.Query()
	q.Set("username", username)
	reqURL.RawQuery = q.Encode()

	req, err := http.NewRequest("GET", reqURL.String(), nil)
	if err != nil {
		return false, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+bearerToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return false, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body for debugging
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, fmt.Errorf("failed to read response body: %w", err)
	}

	switch resp.StatusCode {
	case 200:
		return true, nil
	case 403:
		return false, nil
	default:
		return false, fmt.Errorf("unexpected status code: %d, response: %s", resp.StatusCode, string(body))
	}
}

// createUser creates a new user in the HonorLink API
func createUser(username string) error {
	reqURL := fmt.Sprintf("%s/user/create", baseURL)

	requestBody := map[string]string{
		"username": username,
	}
	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", reqURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+bearerToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if resp.StatusCode != 200 {
		return fmt.Errorf("failed to create user, status: %d, response: %s", resp.StatusCode, string(body))
	}

	return nil
}

// getGameLaunchLink retrieves the game launch link with token refresh handling
func getGameLaunchLink(username, nickname string, gameConfig GameConfig) (string, error) {
	// First try with the original bearer token
	gameLink, err := requestGameLaunchLink(username, nickname, gameConfig, bearerToken, "")
	if err == nil {
		return gameLink, nil
	}

	// If we get a 403 or 401 error, try to refresh the token and retry
	if err != nil && (strings.Contains(err.Error(), "status: 403") || strings.Contains(err.Error(), "status: 401")) {
		newToken, refreshErr := refreshUserToken(username)
		if refreshErr != nil {
			return "", fmt.Errorf("failed to refresh token: %v, original error: %v", refreshErr, err)
		}

		gameLink, err = requestGameLaunchLink(username, nickname, gameConfig, "", newToken)
		if err != nil {
			return "", fmt.Errorf("failed to get game link with refreshed token: %v", err)
		}

		return gameLink, nil
	}

	return "", err
}

// refreshUserToken refreshes the user token
func refreshUserToken(username string) (string, error) {
	reqURL := fmt.Sprintf("%s/user/refresh-token", baseURL)

	requestBody := map[string]string{
		"username": username,
	}
	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("PATCH", reqURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+bearerToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("failed to refresh token, status: %d, response: %s", resp.StatusCode, string(body))
	}

	var response map[string]interface{}
	if err := json.Unmarshal(body, &response); err != nil {
		return "", err
	}

	if token, ok := response["token"].(string); ok {
		return token, nil
	}

	return "", fmt.Errorf("token not found in response: %s", string(body))
}

// requestGameLaunchLink makes the actual API request to get the game launch link
func requestGameLaunchLink(username, nickname string, gameConfig GameConfig, bearerToken, userToken string) (string, error) {
	reqURL, err := url.Parse(fmt.Sprintf("%s/game-launch-link", baseURL))
	if err != nil {
		return "", err
	}

	q := reqURL.Query()
	q.Set("username", username)
	q.Set("nickname", nickname)
	q.Set("game_id", fmt.Sprintf("%v", gameConfig.GameID))
	q.Set("vendor", gameConfig.Vendor)

	// Use user token if provided, otherwise use bearer token
	if userToken != "" {
		// q.Set("token", userToken)
	}

	reqURL.RawQuery = q.Encode()

	req, err := http.NewRequest("GET", reqURL.String(), nil)
	if err != nil {
		return "", err
	}

	// Set appropriate headers
	if bearerToken != "" {
		req.Header.Set("Authorization", "Bearer "+bearerToken)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("failed to get game link, status: %d, body: %s", resp.StatusCode, string(body))
	}

	// Parse response to get the link
	var response map[string]interface{}
	if err := json.Unmarshal(body, &response); err != nil {
		return "", err
	}

	// Try different possible response field names
	for _, field := range []string{"link", "url", "game_link"} {
		if link, ok := response[field].(string); ok {
			return link, nil
		}
	}

	// If no link found in response, return the raw response
	return string(body), nil
}
