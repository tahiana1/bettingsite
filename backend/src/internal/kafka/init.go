package kafka

import (
	"os"

	"github.com/hotbrainy/go-betting/backend/api/controllers"
)

func InitKafka() {
	brokers := os.Getenv("KAFKA_BROKERS")
	InitWriter([]string{brokers}, "sports-odds")
	ConsumeMessages([]string{brokers}, "sports-odds", "sports-group", controllers.Broadcast)
}
