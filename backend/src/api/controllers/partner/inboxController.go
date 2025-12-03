package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	responses "github.com/hotbrainy/go-betting/backend/internal/response"
)

// GetPartnerInboxes returns inbox messages for users under the partner's management
func GetPartnerInboxes(c *gin.Context) {
	// Get the authenticated partner user
	authUser, exists := c.Get("authUser")
	if !exists {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}

	partner, ok := authUser.(models.User)
	if !ok {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Invalid user"))
		return
	}

	// Get pagination parameters
	pageStr := c.DefaultQuery("page", "1")
	page, _ := strconv.Atoi(pageStr)
	if page < 1 {
		page = 1
	}

	perPageStr := c.DefaultQuery("perPage", "10")
	perPage, _ := strconv.Atoi(perPageStr)
	if perPage < 1 {
		perPage = 10
	}

	// Get filter parameters
	searchQuery := c.Query("search")
	statusFilter := c.Query("status")

	// Build query for inboxes where the recipient user's parent_id = partner.ID
	query := initializers.DB.Model(&models.Inbox{}).
		Joins("JOIN users ON users.id = inboxes.user_id").
		Where("users.parent_id = ?", partner.ID).
		Preload("User")

	// Apply search filter (title, description, user userid)
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		query = query.Where(
			"LOWER(inboxes.title) LIKE ? OR LOWER(inboxes.description) LIKE ? OR LOWER(users.userid) LIKE ?",
			searchPattern, searchPattern, searchPattern,
		)
	}

	// Apply status filter
	if statusFilter != "" {
		status := statusFilter == "true"
		query = query.Where("inboxes.status = ?", status)
	}

	// Get total count
	var total int64
	query.Model(&models.Inbox{}).Count(&total)

	// Apply pagination and ordering
	offset := (page - 1) * perPage
	var inboxes []models.Inbox
	if err := query.
		Offset(offset).
		Limit(perPage).
		Order("inboxes.order_num ASC, inboxes.created_at DESC").
		Find(&inboxes).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    inboxes,
		"pagination": gin.H{
			"current_page": page,
			"from":         offset + 1,
			"to":           offset + len(inboxes),
			"last_page":    (int(total) + perPage - 1) / perPage,
			"per_page":     perPage,
			"total":        total,
		},
	})
}

// CreatePartnerInbox creates a new inbox message for a user under the partner's management
func CreatePartnerInbox(c *gin.Context) {
	// Get the authenticated partner user
	authUser, exists := c.Get("authUser")
	if !exists {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}

	partner, ok := authUser.(models.User)
	if !ok {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Invalid user"))
		return
	}

	// Get the inbox data from request
	var inboxInput struct {
		UserID      uint   `json:"userId" binding:"required"`
		Title       string `json:"title" binding:"required,min=2"`
		Description string `json:"description" binding:"required,min=2"`
		Status      *bool  `json:"status"`
		OrderNum    *uint  `json:"orderNum"`
	}

	if err := c.ShouldBindJSON(&inboxInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			format_errors.BadRequestError(c, errs)
			return
		}
		format_errors.BadRequestError(c, err)
		return
	}

	// Verify that the target user is under this partner
	var targetUser models.User
	if err := initializers.DB.First(&targetUser, inboxInput.UserID).Error; err != nil {
		format_errors.NotFoundError(c, fmt.Errorf("Target user not found"))
		return
	}

	if targetUser.ParentID == nil || *targetUser.ParentID != partner.ID {
		format_errors.ForbbidenError(c, fmt.Errorf("You can only create inboxes for users under your management"))
		return
	}

	// Create the inbox
	inbox := models.Inbox{
		Title:       inboxInput.Title,
		Description: inboxInput.Description,
		UserID:      inboxInput.UserID,
		FromID:      partner.ID,
		Status:      true,
	}

	if inboxInput.Status != nil {
		inbox.Status = *inboxInput.Status
	}

	if inboxInput.OrderNum != nil {
		inbox.OrderNum = *inboxInput.OrderNum
	}

	if err := initializers.DB.Create(&inbox).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Load the user relation
	initializers.DB.Preload("User").First(&inbox, inbox.ID)

	c.JSON(http.StatusOK, responses.Status{
		Data:    inbox,
		Message: "Inbox created successfully!",
	})
}

// UpdatePartnerInbox updates an inbox message
func UpdatePartnerInbox(c *gin.Context) {
	// Get the authenticated partner user
	authUser, exists := c.Get("authUser")
	if !exists {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}

	partner, ok := authUser.(models.User)
	if !ok {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Invalid user"))
		return
	}

	// Get inbox ID from URL
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		format_errors.BadRequestError(c, fmt.Errorf("Invalid inbox ID"))
		return
	}

	// Get the update data from request
	var updateInput struct {
		Title       *string `json:"title"`
		Description *string `json:"description"`
		Status      *bool   `json:"status"`
		OrderNum    *uint   `json:"orderNum"`
	}

	if err := c.ShouldBindJSON(&updateInput); err != nil {
		format_errors.BadRequestError(c, err)
		return
	}

	// Find the inbox and verify it belongs to a user under this partner
	var inbox models.Inbox
	if err := initializers.DB.
		Joins("JOIN users ON users.id = inboxes.user_id").
		Where("inboxes.id = ? AND users.parent_id = ?", id, partner.ID).
		First(&inbox).Error; err != nil {
		format_errors.NotFoundError(c, fmt.Errorf("Inbox not found or not authorized"))
		return
	}

	// Update fields
	if updateInput.Title != nil {
		inbox.Title = *updateInput.Title
	}

	if updateInput.Description != nil {
		inbox.Description = *updateInput.Description
	}

	if updateInput.Status != nil {
		inbox.Status = *updateInput.Status
	}

	if updateInput.OrderNum != nil {
		inbox.OrderNum = *updateInput.OrderNum
	}

	if err := initializers.DB.Save(&inbox).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Load the user relation
	initializers.DB.Preload("User").First(&inbox, inbox.ID)

	c.JSON(http.StatusOK, responses.Status{
		Data:    inbox,
		Message: "Inbox updated successfully!",
	})
}

// DeletePartnerInbox deletes an inbox message
func DeletePartnerInbox(c *gin.Context) {
	// Get the authenticated partner user
	authUser, exists := c.Get("authUser")
	if !exists {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}

	partner, ok := authUser.(models.User)
	if !ok {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Invalid user"))
		return
	}

	// Get inbox ID from URL
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		format_errors.BadRequestError(c, fmt.Errorf("Invalid inbox ID"))
		return
	}

	// Find the inbox and verify it belongs to a user under this partner
	var inbox models.Inbox
	if err := initializers.DB.
		Joins("JOIN users ON users.id = inboxes.user_id").
		Where("inboxes.id = ? AND users.parent_id = ?", id, partner.ID).
		First(&inbox).Error; err != nil {
		format_errors.NotFoundError(c, fmt.Errorf("Inbox not found or not authorized"))
		return
	}

	// Delete the inbox (soft delete)
	if err := initializers.DB.Delete(&inbox).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Inbox deleted successfully!",
	})
}

// GetPartnerUsers returns users under the partner's management for dropdown
func GetPartnerUsers(c *gin.Context) {
	// Get the authenticated partner user
	authUser, exists := c.Get("authUser")
	if !exists {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Unauthorized"))
		return
	}

	partner, ok := authUser.(models.User)
	if !ok {
		format_errors.UnauthorizedError(c, fmt.Errorf("❌ Invalid user"))
		return
	}

	// Get search parameter
	searchQuery := c.Query("search")

	// Build query for users under this partner
	query := initializers.DB.Model(&models.User{}).
		Where("parent_id = ?", partner.ID).
		Select("id, userid, name")

	// Apply search filter
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		query = query.Where("LOWER(userid) LIKE ? OR LOWER(name) LIKE ?", searchPattern, searchPattern)
	}

	// Get users
	var users []models.User
	if err := query.Limit(20).Order("userid ASC").Find(&users).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    users,
	})
}

