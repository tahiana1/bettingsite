package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	responses "github.com/hotbrainy/go-betting/backend/internal/response"
)

// Get fetch the all sports
func GetSports(c *gin.Context) {

	today := time.Now().Truncate(24 * time.Hour)
	tomorrow := today.Add(24 * time.Hour)
	fmt.Println(today)
	fmt.Println(tomorrow)
	sportsWithLeagueCount := []responses.Sport{}

	err := initializers.DB.
		Model(&models.Sport{}).
		Select("sports.id, sports.name, COUNT(fixtures.id) as fixture_count").
		Joins("LEFT JOIN fixtures ON fixtures.sport_id = sports.id AND fixtures.start_date >= ? AND fixtures.start_date < ?", today, tomorrow).
		Group("sports.id").
		Scan(&sportsWithLeagueCount).Error

	if err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": sportsWithLeagueCount})

}
