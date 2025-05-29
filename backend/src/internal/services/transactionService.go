package services

import (
	"context"
	"encoding/json"
	"math/rand"
	"time"

	"github.com/hotbrainy/go-betting/backend/internal/models"
	"github.com/hotbrainy/go-betting/backend/internal/redis"
)

type TransactionMessage struct {
	Type      string  `json:"type"`
	Username  string  `json:"username"`
	Amount    float64 `json:"amount"`
	Timestamp string  `json:"timestamp"`
}

var firstNames = []string{"John", "Jane", "Mike", "Sarah", "David", "Lisa", "Tom", "Emma", "Alex", "Sophia", "Harry", "Jack", "Oliver", "Charlie", "Jacob", "George", "Oscar", "Thomas", "James", "William"}
var lastNames = []string{"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"}

func generateFakeTransaction() TransactionMessage {
	rand.Seed(time.Now().UnixNano())

	firstName := firstNames[rand.Intn(len(firstNames))]
	lastName := lastNames[rand.Intn(len(lastNames))]
	username := firstName[:2] + "****" + lastName[:2]

	amount := float64(rand.Intn(10000)) + 1000
	transactionType := "deposit"
	if rand.Float32() < 0.5 {
		transactionType = "withdraw"
	}

	return TransactionMessage{
		Type:      transactionType,
		Username:  username,
		Amount:    amount,
		Timestamp: time.Now().Format("15:04:05"),
	}
}

func BroadcastTransaction(transaction *models.Transaction) {
	message := TransactionMessage{
		Type:      transaction.Type,
		Username:  transaction.User.Profile.Nickname,
		Amount:    transaction.Amount,
		Timestamp: transaction.TransactionAt.Format("15:04:05"),
	}

	messageBytes, _ := json.Marshal(message)
	redis.Client.Publish(context.Background(), "transactions", string(messageBytes))
}

func StartFakeTransactionGenerator() {
	ticker := time.NewTicker(500 * time.Millisecond)
	go func() {
		for range ticker.C {
			message := generateFakeTransaction()
			messageBytes, _ := json.Marshal(message)
			redis.Client.Publish(context.Background(), "transactions", string(messageBytes))
		}
	}()
}
