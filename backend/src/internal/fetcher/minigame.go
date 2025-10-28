package fetcher

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// EOSPowerballResult represents the result from the EOS Powerball API
type EOSPowerballResult struct {
	Date           string        `json:"date"`
	Times          int64         `json:"times"`
	DateRound      int           `json:"date_round"`
	Ball           []interface{} `json:"ball"`            // Can be numbers or string
	PowBallOE      string        `json:"pow_ball_oe"`     // 홀 (odd) / 짝 (even)
	PowBallUnover  string        `json:"pow_ball_unover"` // 오버 (over) / 언더 (under)
	DefBallSum     string        `json:"def_ball_sum"`
	DefBallOE      string        `json:"def_ball_oe"`      // 홀 (odd) / 짝 (even)
	DefBallUnover  string        `json:"def_ball_unover"`  // 오버 (over) / 언더 (under)
	DefBallSize    string        `json:"def_ball_size"`    // 작 (small) / 중 (medium) / 큰 (large)
	DefBallSection string        `json:"def_ball_section"` // A, B, C, D, E
	FixedDateRound string        `json:"fixed_date_round"`
}

type EOSPowerballFetcher struct {
	BaseURL string
	Client  *http.Client
}

func NewEOS1MinPowerballFetcher() *EOSPowerballFetcher {
	return &EOSPowerballFetcher{
		BaseURL: "https://ntry.com/data/json/games/eos_powerball/1min/result.json",
		Client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// FetchResult fetches the current EOS Powerball result
func (e *EOSPowerballFetcher) FetchResult() (*EOSPowerballResult, error) {
	// Create request
	req, err := http.NewRequest("GET", e.BaseURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Add headers
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	req.Header.Add("User-Agent", "EOS-Powerball-Fetcher/1.0")

	// Make request
	resp, err := e.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	// Check if response is successful
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var result EOSPowerballResult
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	return &result, nil
}

// StartPeriodicFetching starts the periodic fetching of EOS Powerball results
func (e *EOSPowerballFetcher) StartPeriodicFetching() {
	ticker := time.NewTicker(10 * time.Second)

	go func() {
		fmt.Println("🚀 Starting EOS Powerball API polling every 10 seconds...")

		// Initial fetch
		e.fetchAndLogResult()

		// Periodic fetching
		for range ticker.C {
			e.fetchAndLogResult()
		}
	}()
}

// ManualFetch allows manual triggering of the fetch for testing
func (e *EOSPowerballFetcher) ManualFetch() {
	fmt.Println("🔄 Manual fetch triggered...")
	e.fetchAndLogResult()
}

func (e *EOSPowerballFetcher) fetchAndLogResult() {
	result, err := e.FetchResult()
	if err != nil {
		fmt.Printf("❌ Failed to fetch EOS Powerball result: %v\n", err)
		return
	}

	// filter the data from database (powerball_histories) where date is today and round is today
	var existingHistory models.PowerballHistory
	if err := initializers.DB.Where("drawing_date = ? AND round = ?", result.Date, result.DateRound).First(&existingHistory).Error; err == nil {
		fmt.Printf("⏭️  Powerball result already exists in database (Date: %s, Round: %d)\n", result.Date, result.DateRound)
		return
	}

	// Log the results
	fmt.Printf("✅ EOS Powerball Result:\n")
	fmt.Printf("   Date: %s\n", result.Date)
	fmt.Printf("   Round: %d\n", result.DateRound)
	fmt.Printf("   Times: %d\n", result.Times)
	fmt.Printf("   Balls: %v\n", result.Ball)
	fmt.Printf("   Power Ball OE: %s, Unover: %s\n", result.PowBallOE, result.PowBallUnover)
	fmt.Printf("   Def Ball Sum: %s, OE: %s, Unover: %s, Size: %s, Section: %s\n",
		result.DefBallSum, result.DefBallOE, result.DefBallUnover, result.DefBallSize, result.DefBallSection)
	fmt.Printf("   Fixed Date Round: %s\n", result.FixedDateRound)
	fmt.Printf("   Fetched at: %s\n", time.Now().Format("2006-01-02 15:04:05"))
	fmt.Println("   " + strings.Repeat("-", 50))
}
