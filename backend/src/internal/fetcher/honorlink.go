package fetcher

import (
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

type User struct {
	Username string `json:"username"`
}

type HonorLinkTransaction struct {
	ID            interface{} `json:"id"` // Can be string or number
	UserID        string      `json:"userId"`
	Username      string      `json:"username"`
	Amount        float64     `json:"amount"`
	Type          string      `json:"type"`
	Status        string      `json:"status"`
	User          User        `json:"user"`
	Details       Details     `json:"details"`
	CreatedAt     time.Time   `json:"createdAt"`
	UpdatedAt     time.Time   `json:"updatedAt"`
	BalanceBefore float64     `json:"before"`
}

type Details struct {
	Game Game `json:"game"`
}

type Game struct {
	Vendor string `json:"vendor"`
	Type   string `json:"type"`
}

// GetIDString returns the ID as a string, handling both string and numeric IDs
func (t *HonorLinkTransaction) GetIDString() string {
	switch v := t.ID.(type) {
	case string:
		return v
	case float64:
		return strconv.FormatFloat(v, 'f', 0, 64)
	case int:
		return strconv.Itoa(v)
	case int64:
		return strconv.FormatInt(v, 10)
	default:
		return fmt.Sprintf("%v", v)
	}
}

type HonorLinkResponse struct {
	Success bool                   `json:"success"`
	Data    []HonorLinkTransaction `json:"data"`
	Total   int                    `json:"total"`
	Page    int                    `json:"page"`
	PerPage int                    `json:"perPage"`
}

type HonorLinkFetcher struct {
	BaseURL string
	Token   string
	Client  *http.Client
}

func NewHonorLinkFetcher() *HonorLinkFetcher {
	token := os.Getenv("HONORLINK_TOKEN")
	if token == "" {
		token = "bZmLGdUGa123lKpTvxU9uFbDtCQUa0pdLzNfbxkn79f33cc4" // fallback
	}

	return &HonorLinkFetcher{
		BaseURL: "https://api.honorlink.org/api/transactions",
		Token:   token,
		Client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (h *HonorLinkFetcher) FetchTransactions(start, end time.Time, page, perPage int) (*HonorLinkResponse, error) {
	// Create URL with query parameters
	baseURL, err := url.Parse(h.BaseURL)
	if err != nil {
		return nil, fmt.Errorf("invalid base URL: %v", err)
	}

	params := url.Values{}
	params.Add("start", start.Format("2006-01-02 15:04:05"))
	params.Add("end", end.Format("2006-01-02 15:04:05"))
	params.Add("page", fmt.Sprintf("%d", page))
	params.Add("perPage", fmt.Sprintf("%d", perPage))

	baseURL.RawQuery = params.Encode()

	// Create request
	req, err := http.NewRequest("GET", baseURL.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Add authorization header
	req.Header.Add("Authorization", "Bearer "+h.Token)
	req.Header.Add("Content-Type", "application/json")

	// Make request
	resp, err := h.Client.Do(req)
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
	var response HonorLinkResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	return &response, nil
}

func (h *HonorLinkFetcher) StartPeriodicFetching() {
	ticker := time.NewTicker(5 * time.Minute)

	go func() {
		fmt.Println("🚀 Starting HonorLink API polling every 2 minutes...")

		// Initial fetch
		h.fetchAndLogTransactions()

		// Periodic fetching
		for range ticker.C {
			h.fetchAndLogTransactions()
		}
	}()
}

// ManualFetch allows manual triggering of the fetch for testing
func (h *HonorLinkFetcher) ManualFetch() {
	fmt.Println("🔄 Manual fetch triggered...")
	h.fetchAndLogTransactions()
}

func (h *HonorLinkFetcher) fetchAndLogTransactions() {
	// Set time range to last 12 minutes
	end := time.Now()
	start := end.Add(-1 * 24 * time.Hour) // 14 days ago
	fmt.Println(start, end, "date")
	response, err := h.FetchTransactions(start, end, 1, 100)

	// end := time.Now()
	// start := end.Add(-2 * time.Minute)
	// fmt.Println(start, end, "date")
	// response, err := h.FetchTransactions(start, end, 1, 100)
	if err != nil {
		fmt.Printf("❌ Error fetching HonorLink transactions: %v\n", err)
		return
	}

	// Log the results
	fmt.Printf("✅ HonorLink API Response:\n")
	fmt.Printf("   Time Range: %s to %s\n", start.Format("2006-01-02 15:04:05"), end.Format("2006-01-02 15:04:05"))
	fmt.Printf("   Success: %t\n", response.Success)
	fmt.Printf("   Total Transactions: %d\n", response.Total)
	fmt.Printf("   Page: %d\n", response.Page)
	fmt.Printf("   Per Page: %d\n", response.PerPage)
	fmt.Printf("   Transactions in this page: %d\n", len(response.Data))

	if len(response.Data) > 0 {
		fmt.Printf("   Sample transactions:\n")
		for i, transaction := range response.Data {
			// if i >= 5 { // Show only first 5 transactions
			// 	break
			// }
			// check transaction id is exist in transction table explation
			var transactionDB models.Transaction
			if err := initializers.DB.Where("explation = ?", transaction.GetIDString()).First(&transactionDB).Error; err == nil {
				fmt.Printf("❌ Transaction with explation %s already exists\n", transaction.GetIDString())
				continue
			} else {
				fmt.Printf("%d. ID: %s, UserID: %s, Username: '%s', Amount: %.2f, Type: %s, Status: %s\n",
					i+1, transaction.GetIDString(), transaction.UserID, transaction.User.Username, transaction.Amount, transaction.Type, transaction.Status)
				h.processTransaction(transaction)
			}
		}
	} else {
		fmt.Printf("   No transactions found in the specified time ran	 ge\n")
	}

	fmt.Printf("   Fetched at: %s\n", time.Now().Format("2006-01-02 15:04:05"))
	fmt.Println("   " + strings.Repeat("-", 50))
}

// processTransaction handles individual HonorLink transactions
func (h *HonorLinkFetcher) processTransaction(hlTransaction HonorLinkTransaction) {
	// Find user by matching transaction.Username or UserID with user.userid field
	var user models.User
	var err error

	// Try to find user by Username first, then by UserID if Username is empty
	useridToSearch := hlTransaction.User.Username
	if useridToSearch == "" {
		useridToSearch = hlTransaction.UserID
	}

	if useridToSearch == "" {
		fmt.Printf("❌ Both Username and UserID are empty for transaction ID %s\n", hlTransaction.GetIDString())
		return
	}

	if err = initializers.DB.Where("userid = ?", useridToSearch).First(&user).Error; err != nil {
		fmt.Printf("❌ Error finding user with userid %s: %v\n", useridToSearch, err)
		return
	}

	// Get user's profile to check current balance
	var profile models.Profile
	if err := initializers.DB.Where("user_id = ?", user.ID).First(&profile).Error; err != nil {
		fmt.Printf("❌ Error finding user profile for ID %d: %v\n", user.ID, err)
		return
	}

	// Calculate balance before and after
	var balanceBefore float64
	var gameType string
	balanceBefore = hlTransaction.BalanceBefore
	if hlTransaction.Type == "bet" {
		gameType = "bet"
	} else if hlTransaction.Type == "win" {
		gameType = "win"
	}

	if hlTransaction.Type == "bet" || hlTransaction.Type == "win" {
		//Create transaction record
		transaction := models.Transaction{
			UserID:        user.ID,
			Amount:        hlTransaction.Amount,
			Type:          gameType,
			Shortcut:      hlTransaction.Details.Game.Vendor + "|" + hlTransaction.Details.Game.Type,
			Explation:     hlTransaction.GetIDString(),
			BalanceBefore: balanceBefore,
			BalanceAfter:  balanceBefore + hlTransaction.Amount,
			Status:        "success",
		}

		// Save transaction to database
		if err := initializers.DB.Create(&transaction).Error; err != nil {
			fmt.Printf("❌ Error creating transaction record: %v\n", err)
			return
		}

		// if err := initializers.DB.Model(&profile).Update("balance", balanceAfter).Error; err != nil {
		// 	fmt.Printf("❌ Error updating user balance: %v\n", err)
		// 	return
		// }

		rollingGoldAmount := math.Abs(hlTransaction.Amount * float64(user.Live) / 100)
		transactionRolling := models.Transaction{
			UserID:        user.ID,
			Amount:        hlTransaction.Amount,
			Type:          "Rolling",
			Shortcut:      hlTransaction.Details.Game.Vendor + "|" + hlTransaction.Details.Game.Type,
			Explation:     hlTransaction.GetIDString(),
			BalanceBefore: float64(profile.Roll),
			BalanceAfter:  float64(profile.Roll) + rollingGoldAmount,
			Status:        "success",
		}
		if err := initializers.DB.Create(&transactionRolling).Error; err != nil {
			fmt.Printf("❌ Error creating transaction record: %v\n", err)
			return
		}

		fmt.Printf("✅ Successfully processed HonorLink transaction: ID=%s, User=%d, Amount=%.2f\n",
			hlTransaction.GetIDString(), user.ID, hlTransaction.Amount)
	}
}
