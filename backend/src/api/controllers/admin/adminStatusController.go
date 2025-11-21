package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
)

// GetAdminStatus handles GET request for admin status page
// Query parameters:
//   - page: page number (default: 1)
//   - pageSize: items per page (default: 25)
//   - search: search term for userid, nickname, holderName, or phone
//   - role: filter by role (default: "A" for admin)
//   - onlineStatus: filter by online status (optional: "true" or "false")
func GetAdminStatus(c *gin.Context) {
	var users []models.User
	var total int64

	// Get query parameters
	pageStr := c.DefaultQuery("page", "1")
	pageSizeStr := c.DefaultQuery("pageSize", "25")
	search := c.Query("search")
	role := c.DefaultQuery("role", "A")
	onlineStatus := c.Query("onlineStatus")

	// Convert pagination
	page, _ := strconv.Atoi(pageStr)
	pageSize, _ := strconv.Atoi(pageSizeStr)
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 25
	}
	offset := (page - 1) * pageSize

	// Build query
	db := initializers.DB.Model(&models.User{}).
		Preload("Profile").
		Preload("Parent").
		Preload("Root").
		Joins("Profile")

	// Always filter by role
	db = db.Where("users.role = ?", role)

	// Filter by online status if provided
	if onlineStatus != "" {
		onlineStatusBool := onlineStatus == "true" || onlineStatus == "1"
		db = db.Where("users.online_status = ?", onlineStatusBool)
	}

	// Apply search filter
	if search != "" && strings.TrimSpace(search) != "" {
		searchTerm := "%" + strings.TrimSpace(search) + "%"
		db = db.Where(
			"users.userid ILIKE ? OR profiles.nickname ILIKE ? OR profiles.holder_name ILIKE ? OR profiles.phone ILIKE ?",
			searchTerm, searchTerm, searchTerm, searchTerm,
		)
	}

	// Get total count before pagination
	if err := db.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to count users",
		})
		return
	}

	// Apply pagination and ordering
	db = db.Order("users.order_num").
		Order("users.updated_at DESC").
		Limit(pageSize).
		Offset(offset)

	// Execute query
	if err := db.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch users",
		})
		return
	}

	// Format response
	response := gin.H{
		"users": users,
		"total": total,
		"page":  page,
		"pageSize": pageSize,
	}

	c.JSON(http.StatusOK, response)
}

