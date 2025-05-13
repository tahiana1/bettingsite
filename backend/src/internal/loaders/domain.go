package loaders

// import vikstrous/dataloadgen with your other imports
import (
	"context"
	"fmt"

	"github.com/hotbrainy/go-betting/backend/db/initializers"
	"github.com/hotbrainy/go-betting/backend/graph/model"
	"github.com/hotbrainy/go-betting/backend/internal/helpers"
	"github.com/hotbrainy/go-betting/backend/internal/models"
	"gorm.io/gorm"
)

// domainReader reads Domains from a database
type domainReader struct {
	db *gorm.DB
}

// getDomains implements a batch function that can retrieve many domains by ID,
// for use in a dataloader
func (u *domainReader) getDomains(ctx context.Context, nIDs []uint) ([]*models.Domain, []error) {
	var domains []*models.Domain
	err := u.db.Where("id IN ?", nIDs).Find(&domains).Error
	if err != nil {
		return nil, []error{err}
	}

	// Create a map for easy lookup by ID
	domainMap := make(map[uint]*models.Domain, len(domains))
	for _, domain := range domains {
		domainMap[domain.ID] = domain
	}

	// Match order of input IDs
	result := make([]*models.Domain, len(nIDs))
	errs := make([]error, len(nIDs))
	for i, id := range nIDs {
		if p, ok := domainMap[id]; ok {
			result[i] = p
			errs[i] = nil
		} else {
			result[i] = nil
			errs[i] = fmt.Errorf("domain not found: %d", id)
		}
	}

	return result, errs
}

func (dr *domainReader) getDomainsByDomainID(ctx context.Context, nIDs []uint) ([]*models.Domain, []error) {
	var domains []*models.Domain
	err := dr.db.Where("domain_id IN ?", nIDs).Find(&domains).Error
	if err != nil {
		return nil, []error{err}
	}

	// Map domain_id to domain
	domainMap := make(map[uint]*models.Domain, len(domains))
	for _, n := range domains {
		domainMap[n.ID] = n
	}

	results := make([]*models.Domain, len(nIDs))
	errors := make([]error, len(nIDs))
	for i, uid := range nIDs {
		if p, ok := domainMap[uid]; ok {
			results[i] = p
		} else {
			errors[i] = fmt.Errorf("no domain found for domain_id: %d", uid)
		}
	}
	return results, errors
}

// GetDomain returns single domain by id efficiently
func GetDomain(ctx context.Context, domainID uint) (*models.Domain, error) {
	loaders := For(ctx)
	return loaders.DomainLoader.Load(ctx, domainID)
}

// GetDomains returns many domains by ids efficiently
func (dr *domainReader) GetDomains(ctx context.Context, filters []*model.Filter, orders []*model.Order, pagination *model.Pagination) (*model.DomainList, error) {
	var domains []*models.Domain

	db := dr.db.Model(&models.Domain{}).Joins("User").Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, userid, name")
	})
	// Filtering

	db = helpers.ApplyFilters(db, filters)

	// Count total
	var count int64
	if err := db.Count(&count).Error; err != nil {
		return nil, err
	}

	// Ordering
	db = helpers.ApplyOrders(db, orders)

	db = db.Order("order_num asc")

	// Pagination

	db = helpers.ApplyPagination(db, pagination)

	// Query results

	if err := db.Find(&domains).Error; err != nil {
		return nil, err
	}
	return &model.DomainList{
		Domains: domains,
		Total:   int32(count),
	}, nil
}

// CreateDomain updates a domain by ID
func (dr *domainReader) CreateDomain(ctx context.Context, updates model.NewDomainInput) (*models.Domain, error) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic111:", r)
		}
	}()

	domain := models.Domain{
		Name:        updates.Name,
		Description: updates.Description,
		Status:      true,
	}

	if updates.Status != nil {
		domain.Status = *updates.Status
	}
	fmt.Println(updates)

	if err := dr.db.Save(&domain).Error; err != nil {
		return nil, err
	}

	return &domain, nil
}

// UpdateDomain updates a domain by ID
func (dr *domainReader) UpdateDomain(ctx context.Context, nID uint, updates model.UpdateDomainInput) (*models.Domain, error) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered from panic:", r)
		}
	}()

	domain := models.Domain{}

	if err := initializers.DB.Model(&domain).First(&domain, nID).Error; err != nil {
		return nil, err
	}

	if updates.Name != nil {
		domain.Name = *updates.Name
	}

	if updates.UserID != nil {
		domain.UserID = *updates.UserID
	}

	if updates.Description != nil {
		domain.Description = *updates.Description
	}

	if updates.AutoReg != nil {
		domain.AutoReg = *updates.AutoReg
	}
	if updates.Status != nil {
		domain.Status = *updates.Status
	}

	if updates.OrderNum != nil {
		domain.OrderNum = *updates.OrderNum
	}

	if updates.UseTelegram != nil {
		domain.UseTelegram = *updates.UseTelegram
	}

	if updates.Telegram != nil {
		domain.Telegram = *updates.Telegram
	}

	if updates.TelegramLink != nil {
		domain.TelegramLink = *updates.TelegramLink
	}

	if updates.UseKakaoTalk != nil {
		domain.UseKakaoTalk = *updates.UseKakaoTalk
	}

	if updates.KakaoTalk != nil {
		domain.KakaoTalk = *updates.KakaoTalk
	}

	if updates.KakaoTalkLink != nil {
		domain.KakaoTalkLink = *updates.KakaoTalkLink
	}

	if updates.UseLiveDomain != nil {
		domain.UseLiveDomain = *updates.UseLiveDomain
	}
	if updates.LiveDomain != nil {
		domain.LiveDomain = *updates.LiveDomain
	}
	if updates.LiveDomainLink != nil {
		domain.LiveDomainLink = *updates.LiveDomainLink
	}

	if updates.UseServiceCenter != nil {
		domain.UseServiceCenter = *updates.UseServiceCenter
	}
	if updates.ServiceCenterLink != nil {
		domain.ServiceCenterLink = *updates.ServiceCenterLink
	}
	if updates.ServiceCenter != nil {
		domain.ServiceCenter = *updates.ServiceCenter
	}

	if updates.MemberLevel != nil {
		domain.MemberLevel = *updates.MemberLevel
	}
	if updates.DistributorLevel != nil {
		domain.DistributorLevel = *updates.DistributorLevel
	}

	dr.db.Save(domain)

	return &domain, nil
}

// DeleteDomain deletes a domain by ID (soft delete if GORM soft delete is enabled)
func (dr *domainReader) DeleteDomain(ctx context.Context, nid uint) (bool, error) {
	n := &models.Domain{}
	err := dr.db.Model(&models.Domain{}).First(&n, nid).Error
	if err != nil {
		return false, err
	}
	if err := dr.db.Delete(&models.Domain{}, nid).Error; err != nil {
		return false, err
	}
	return true, nil
}
