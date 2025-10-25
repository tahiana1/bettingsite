package seeders

import (
	"fmt"
	"log"

	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// Helper function to create a mini game config with default values
func createMiniGameConfig(gameType string, level int) models.MiniGameConfig {
	// Base max betting value increases with level
	baseMaxBetting := float64(level) * 1000.0

	// Different game types can have different multipliers
	var multiplier float64
	switch gameType {
	case "eos1min":
		multiplier = 1.0
	case "eos2min":
		multiplier = 1.2
	case "eos3min":
		multiplier = 1.5
	case "eos4min":
		multiplier = 1.8
	case "eos5min":
		multiplier = 2.0
	default:
		multiplier = 1.0
	}

	return models.MiniGameConfig{
		GameType:        gameType,
		Level:           level,
		MaxBettingValue: baseMaxBetting * multiplier,
		MinBettingValue: 1.0,
		IsActive:        true,
	}
}

// SeedMiniGameConfigs creates default mini game configurations for all levels and game types
func SeedMiniGameConfigs() error {
	gameTypes := []string{"eos1min", "eos2min", "eos3min", "eos4min", "eos5min"}
	levels := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}

	var configs []models.MiniGameConfig

	// Create configs for each game type and level combination
	for _, gameType := range gameTypes {
		for _, level := range levels {
			config := createMiniGameConfig(gameType, level)
			configs = append(configs, config)
		}
	}

	// Create configs in database
	for _, config := range configs {
		// Check if config already exists
		var existingConfig models.MiniGameConfig
		result := initializers.DB.Where("game_type = ? AND level = ?", config.GameType, config.Level).First(&existingConfig)

		if result.Error != nil {
			// Config doesn't exist, create it
			if err := initializers.DB.Create(&config).Error; err != nil {
				return err
			}
		}
		// If config exists, skip it
	}

	return nil
}

// AutoSeedMiniGameConfigs checks if mini game configs exist and seeds them if needed
func AutoSeedMiniGameConfigs() {
	var count int64
	err := initializers.DB.Model(&models.MiniGameConfig{}).Count(&count).Error
	if err != nil {
		log.Printf("⚠️ Failed to check mini game configs count: %v", err)
		return
	}

	// Check if we have configs for all game types and levels
	expectedCount := 5 * 15 // 5 game types * 15 levels = 75 configs

	if count < int64(expectedCount) {
		fmt.Println("🌱 Mini game configs are incomplete, seeding default configurations...")
		err := SeedMiniGameConfigs()
		if err != nil {
			log.Printf("❌ Failed to seed mini game configs: %v", err)
			return
		}
		fmt.Println("✅ Successfully seeded mini game configurations!")
		fmt.Println("📊 Created configurations for:")
		fmt.Println("   - 5 game types (eos1min, eos2min, eos3min, eos4min, eos5min)")
		fmt.Println("   - 15 levels each (Level 1-15)")
		fmt.Printf("   - Total: %d configurations\n", expectedCount)
	} else {
		fmt.Printf("ℹ️ Mini game configs already have %d records, skipping seeding\n", count)
	}
}
