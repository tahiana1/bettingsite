package loaders

// import vikstrous/dataloadgen with your other imports
import (
	"context"
	"fmt"
	"time"

	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// qnaReader reads Qnas from a database
type qnaReader struct {
	db *gorm.DB
}

// getQnas implements a batch function that can retrieve many qnas by ID,
// for use in a dataloader
func (u *qnaReader) getQnas(ctx context.Context, nIDs []uint) ([]*models.Qna, []error) {
	var qnas []*models.Qna
	err := u.db.Where("id IN ?", nIDs).Find(&qnas).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	qnaMap := make(map[uint]*models.Qna, len(qnas))
	for _, qna := range qnas {
		qnaMap[qna.ID] = qna
	}

	// Match order of input IDs
	result := make([]*models.Qna, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := qnaMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("qna not found: %d", id)
		}
	}

	return result, errs
}

func (qr *qnaReader) getQnasByQnaID(ctx context.Context, nIDs []uint) ([]*models.Qna, []error) {
	var qnas []*models.Qna
	err := qr.db.Where("qna_id IN ?", nIDs).Find(&qnas).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map qna_id to qna
	qnaMap := make(map[uint]*models.Qna, len(qnas))
	for _, n := range qnas {
		qnaMap[n.ID] = n
	}

	results := make([]*models.Qna, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := qnaMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no qna found for qna_id: %d", uid)
		}
	}
	return results, errors
}

// GetQna returns single qna by id efficiently
func GetQna(ctx context.Context, qnaID uint) (*models.Qna, error) {
	loaders := For(ctx)
	return loaders.QnaLoader.Load(ctx, qnaID)
}

// GetQnas returns many qnas by ids efficiently
func (qr *qnaReader) GetQnas(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.QnaList, error) {
	var qnas []*models.Qna

	db := qr.db.Model(&models.Qna{}).Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Profile").Preload("Root").Preload("Parent")
	}).Preload("Domain")
	// Filtering

	db = helpers.ApplyFilters(db, filters)

	// Count total
	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}

	// Ordering
	db = helpers.ApplyOrders(db, orders)

	// Pagination

	db = helpers.ApplyPagination(db, pagination)

	// Query results

	if err := db.Find(&qnas).Error; err != nil {
		return nil, err
	}
	return &model.QnaList{
		Qnas:  qnas,
		Total: int32(count),
	}, nil
}

// CreateQna updates a qna by ID
func (qr *qnaReader) CreateQna(ctx context.Context, updates model.NewQnaInput) (*models.Qna, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()

	authUser, err := helpers.GetAuthUser(ctx)

	if err != nil {
		return nil, err
	}

	d, er := helpers.GetAccessDomain(ctx)

	if er != nil {
		return nil, er
	}

	qna := models.Qna{
		UserID:   authUser.ID,
		DomainID: d.ID,
		Question: updates.Question,
		Status:   "P",
	}

	if err := qr.db.Save(&qna).Error; err != nil {
		return nil, err
	}

	return &qna, nil
}

// UpdateQna updates a qna by ID
func (qr *qnaReader) UpdateQna(ctx context.Context, nID uint, updates model.UpdateQnaInput) (*models.Qna, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	qna := models.Qna{}

	if err := initializers.DB.Model(&qna).First(&qna, nID).Error; err != nil {
		return nil, err
	}

	if updates.Question != nil {
		qna.Question = *updates.Question
	}

	if updates.Answer != nil {
		qna.Answer = *updates.Answer
	}

	qr.db.Save(qna)

	return &qna, nil
}

// UpdateQna updates a qna by ID
func (qr *qnaReader) ReplyQna(ctx context.Context, nID uint, updates model.UpdateQnaInput) (*models.Qna, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	qna := models.Qna{}

	if err := initializers.DB.Model(&qna).First(&qna, nID).Error; err != nil {
		return nil, err
	}

	if updates.Answer != nil {
		qna.Answer = *updates.Answer
		qna.Status = "A"
	}
	t := time.Now()

	qna.RepliedAt = &t

	qr.db.Save(qna)

	return &qna, nil
}

// DeleteQna deletes a qna by ID (soft delete if GORM soft delete is enabled)
func (qr *qnaReader) DeleteQna(ctx context.Context, nid uint) (bool, error) {
	n := &models.Qna{}
	err := qr.db.Model(&models.Qna{}).First(&n, nid).Error
	if err != nil {
		return false, err
	}
	if err := qr.db.Delete(&models.Qna{}, nid).Error; err != nil {
		return false, err
	}
	return true, nil
}
