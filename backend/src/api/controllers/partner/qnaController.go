package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/hotbrainy/go-betting/backend/db/initializers"
	format_errors "github.com/hotbrainy/go-betting/backend/internal/format-errors"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	responses "github.com/hotbrainy/go-betting/backend/internal/response"
	"gorm.io/gorm"
)

// GetPartnerQnas returns QNAs for users under the partner's management
func GetPartnerQnas(c *gin.Context) {
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

	perPageStr := c.DefaultQuery("perPage", "25")
	perPage, _ := strconv.Atoi(perPageStr)
	if perPage < 1 {
		perPage = 25
	}

	// Get filter parameters
	statusFilter := c.Query("status")
	typeFilter := c.Query("type")
	searchQuery := c.Query("search")

	// Build query for QNAs where the user's parent_id = partner.ID
	query := initializers.DB.Model(&models.Qna{}).
		Joins("JOIN users ON users.id = qnas.user_id").
		Where("users.parent_id = ?", partner.ID).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Preload("Profile").Preload("Root").Preload("Parent")
		})

	// Apply status filter
	if statusFilter != "" {
		query = query.Where("qnas.status = ?", statusFilter)
	}

	// Apply type filter
	if typeFilter != "" {
		query = query.Where("qnas.type = ?", typeFilter)
	}

	// Apply search filter (question title, question content, user userid)
	if searchQuery != "" {
		searchPattern := "%" + strings.ToLower(searchQuery) + "%"
		query = query.Where(
			"LOWER(qnas.question_title) LIKE ? OR LOWER(qnas.question) LIKE ? OR LOWER(users.userid) LIKE ?",
			searchPattern, searchPattern, searchPattern,
		)
	}

	// Get total count
	var total int64
	query.Model(&models.Qna{}).Count(&total)

	// Apply pagination and ordering
	offset := (page - 1) * perPage
	var qnas []models.Qna
	if err := query.
		Offset(offset).
		Limit(perPage).
		Order("qnas.created_at DESC").
		Find(&qnas).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    qnas,
		"pagination": gin.H{
			"current_page": page,
			"from":         offset + 1,
			"to":           offset + len(qnas),
			"last_page":    (int(total) + perPage - 1) / perPage,
			"per_page":     perPage,
			"total":        total,
		},
	})
}

// ReplyPartnerQna replies to a QNA
func ReplyPartnerQna(c *gin.Context) {
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

	// Get QNA ID from URL
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		format_errors.BadRequestError(c, fmt.Errorf("Invalid QNA ID"))
		return
	}

	// Get the reply data from request
	var replyInput struct {
		Answer string `json:"answer" binding:"required"`
	}

	if err := c.ShouldBindJSON(&replyInput); err != nil {
		if errs, ok := err.(validator.ValidationErrors); ok {
			format_errors.BadRequestError(c, errs)
			return
		}
		format_errors.BadRequestError(c, err)
		return
	}

	// Find the QNA and verify it belongs to a user under this partner
	var qna models.Qna
	if err := initializers.DB.
		Joins("JOIN users ON users.id = qnas.user_id").
		Where("qnas.id = ? AND users.parent_id = ?", id, partner.ID).
		First(&qna).Error; err != nil {
		format_errors.NotFound(c, err, "QNA not found or not authorized")
		return
	}

	// Update the QNA with the answer
	qna.Answer = replyInput.Answer
	qna.Status = "A"
	now := time.Now()
	qna.RepliedAt = &now

	if err := initializers.DB.Save(&qna).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Load the user relation
	initializers.DB.Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Profile").Preload("Root").Preload("Parent")
	}).First(&qna, qna.ID)

	c.JSON(http.StatusOK, responses.Status{
		Data:    qna,
		Message: "QNA replied successfully!",
	})
}

// UpdatePartnerQnaStatus updates a QNA status
func UpdatePartnerQnaStatus(c *gin.Context) {
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

	// Get QNA ID from URL
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		format_errors.BadRequestError(c, fmt.Errorf("Invalid QNA ID"))
		return
	}

	// Get the update data from request
	var updateInput struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&updateInput); err != nil {
		format_errors.BadRequestError(c, err)
		return
	}

	// Find the QNA and verify it belongs to a user under this partner
	var qna models.Qna
	if err := initializers.DB.
		Joins("JOIN users ON users.id = qnas.user_id").
		Where("qnas.id = ? AND users.parent_id = ?", id, partner.ID).
		First(&qna).Error; err != nil {
		format_errors.NotFound(c, err, "QNA not found or not authorized")
		return
	}

	// Update status
	qna.Status = updateInput.Status

	if err := initializers.DB.Save(&qna).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	// Load the user relation
	initializers.DB.Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Profile").Preload("Root").Preload("Parent")
	}).First(&qna, qna.ID)

	c.JSON(http.StatusOK, responses.Status{
		Data:    qna,
		Message: "QNA status updated successfully!",
	})
}

// CompletePartnerQna marks a QNA as completed
func CompletePartnerQna(c *gin.Context) {
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

	// Get QNA ID from URL
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		format_errors.BadRequestError(c, fmt.Errorf("Invalid QNA ID"))
		return
	}

	// Find the QNA and verify it belongs to a user under this partner
	var qna models.Qna
	if err := initializers.DB.
		Joins("JOIN users ON users.id = qnas.user_id").
		Where("qnas.id = ? AND users.parent_id = ?", id, partner.ID).
		First(&qna).Error; err != nil {
		format_errors.NotFound(c, err, "QNA not found or not authorized")
		return
	}

	// Update status to "F" (completed)
	qna.Status = "F"

	if err := initializers.DB.Save(&qna).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "QNA completed successfully!",
	})
}

// DeletePartnerQna deletes a QNA
func DeletePartnerQna(c *gin.Context) {
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

	// Get QNA ID from URL
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		format_errors.BadRequestError(c, fmt.Errorf("Invalid QNA ID"))
		return
	}

	// Find the QNA and verify it belongs to a user under this partner
	var qna models.Qna
	if err := initializers.DB.
		Joins("JOIN users ON users.id = qnas.user_id").
		Where("qnas.id = ? AND users.parent_id = ?", id, partner.ID).
		First(&qna).Error; err != nil {
		format_errors.NotFound(c, err, "QNA not found or not authorized")
		return
	}

	// Delete the QNA (soft delete)
	if err := initializers.DB.Delete(&qna).Error; err != nil {
		format_errors.InternalServerError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "QNA deleted successfully!",
	})
}
