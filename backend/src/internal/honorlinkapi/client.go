package honorlinkapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
)

// CheckUserExists checks if a user exists in the HonorLink API
func CheckUserExists(username string) (bool, error) {
	token := os.Getenv("HONORLINK_TOKEN")
	if token == "" {
		token = "srDiqct6lH61a0zHNKPUu0IwE0mg7Ht38sALu3oWb5bf8e9d" // fallback
	}
	baseURL := "https://api.honorlink.org/api"

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

	req.Header.Set("Authorization", "Bearer "+token)
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
	case 404:
		return false, nil
	case 403:
		return false, nil
	default:
		return false, fmt.Errorf("unexpected status code: %d, response: %s", resp.StatusCode, string(body))
	}
}

// CreateUser creates a new user in the HonorLink API
func CreateUser(username string) error {
	token := os.Getenv("HONORLINK_TOKEN")
	if token == "" {
		token = "srDiqct6lH61a0zHNKPUu0IwE0mg7Ht38sALu3oWb5bf8e9d" // fallback
	}
	baseURL := "https://api.honorlink.org/api"

	reqURL := fmt.Sprintf("%s/user/create", baseURL)

	requestBody := map[string]string{
		"username": username,
		"nickname": username,
	}
	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", reqURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+token)
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

