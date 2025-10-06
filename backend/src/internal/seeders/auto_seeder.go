package seeders

import (
	"fmt"
	"log"

	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// AutoSeedLevels checks if the levels table is empty and seeds it if needed
// This function should be called after database initialization
func AutoSeedLevels() {
	var count int64
	err := initializers.DB.Model(&models.Level{}).Count(&count).Error
	if err != nil {
		log.Printf("⚠️ Failed to check levels count: %v", err)
		return
	}

	if count == 0 {
		fmt.Println("🌱 Levels table is empty, seeding default levels...")
		err := SeedLevels()
		if err != nil {
			log.Printf("❌ Failed to seed levels: %v", err)
			return
		}
		fmt.Println("✅ Successfully seeded 15 default levels!")
		fmt.Println("📊 Created levels:")
		fmt.Println("   - 12 Regular levels (Level 1-12)")
		fmt.Println("   - 2 VIP levels (VIP 1-2)")
		fmt.Println("   - 1 Premium level")
	} else {
		fmt.Printf("ℹ️ Levels table already has %d records, skipping seeding\n", count)
	}
}
