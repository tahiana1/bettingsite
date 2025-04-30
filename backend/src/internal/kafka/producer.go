package kafka

import (
	"context"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

var Writer *kafka.Writer

func InitWriter(brokers []string, topic string) {
	Writer = kafka.NewWriter(kafka.WriterConfig{
		Brokers:  brokers,
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	})
}

func PublishMessage(msg []byte) {
	err := Writer.WriteMessages(context.Background(), kafka.Message{
		Key:   []byte(time.Now().Format(time.RFC3339)),
		Value: msg,
	})
	if err != nil {
		log.Println("Kafka publish error:", err)
	}
}
