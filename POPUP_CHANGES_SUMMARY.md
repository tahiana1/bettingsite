# Popup Settings Page - Changes Summary

## Overview
The Popup settings page has been transformed from a table-based layout to a card-based layout, with new database fields added to support more granular control over popup display settings.

## Changes Made

### 1. Database Model Updates (`backend/src/internal/models/popup.go`)
Added three new fields to the `Popup` model:
- **DisplayType** (string): Controls when/where to display the popup
  - Options: `"standard"`, `"center"`, `"doesn't exist"`
  - Default: `"standard"`
- **Width** (uint): Popup width in pixels
  - Default: `0` (no width restriction)
- **Height** (uint): Popup height in pixels (minimum)
  - Default: `0` (no height limit)

### 2. GraphQL Schema Updates (`backend/src/graph/schema/popup.graphql`)
Updated the GraphQL schema to include the new fields:
- Added `displayType`, `width`, and `height` to the `Popup` type
- Added these fields to `NewPopupInput` (for creation)
- Added these fields to `UpdatePopupInput` (for updates)

### 3. Backend Logic Updates (`backend/src/internal/loaders/popup.go`)
Updated the Create and Update functions:
- `CreatePopup`: Now handles the new fields with appropriate defaults
- `UpdatePopup`: Now updates the new fields when provided

### 4. Frontend Type Updates (`frontend/src/src/types/index.d.ts`)
Updated the TypeScript `Popup` interface to include:
```typescript
displayType: string;
width: number;
height: number;
```

### 5. GraphQL Queries/Mutations (`frontend/src/src/actions/popup.ts`)
Updated all GraphQL operations to include the new fields:
- `FILTER_POPUP` query
- `CREATE_POPUP` mutation
- `UPDATE_POPUP` mutation

### 6. UI Transformation (`frontend/src/src/app/(admin)/admin/settings/popup/page.tsx`)
Complete redesign from table-based to card-based layout:

#### Old Design:
- Table view with rows for each popup
- Separate modal for creating new popups
- Separate modal for editing existing popups

#### New Design:
- **"Create New Popup" Card** at the top with inline form
- **Individual Cards** for each existing popup with inline editing
- Each card includes:
  - Popup title input
  - Display Type dropdown (standard/center/doesn't exist)
  - Width input (with hint: "if 0, no width restriction")
  - Height input (with hint: "if 0, no height limit")
  - Rich text editor (Quill) for content
  - Duration date range picker
  - Status toggle
  - Order number input
  - "Change" and "Delete" buttons

### 7. GraphQL Schema Regeneration
Ran `go run github.com/99designs/gqlgen generate` to regenerate the GraphQL code with the new schema.

## Migration

### Database Migration
The database will be automatically migrated when the backend restarts, thanks to GORM's `AutoMigrate` feature. The new columns (`display_type`, `width`, `height`) will be added to the `popups` table automatically.

**No manual SQL migration is required.**

### Existing Data
Existing popups in the database will have:
- `display_type` = `"standard"` (default)
- `width` = `0` (no restriction)
- `height` = `0` (no limit)

## How to Test

1. **Start the services:**
   ```bash
   docker compose up --build
   ```

2. **Access the admin panel:**
   - Navigate to the Popup Settings page in the admin interface

3. **Test creating a new popup:**
   - Fill in the "Create New Popup" form
   - Select a display type
   - Set width and height values
   - Add content using the rich text editor
   - Click "Registration"

4. **Test editing existing popups:**
   - Scroll down to see existing popup cards
   - Modify any field
   - Click "Change" to save

5. **Test deleting popups:**
   - Click "Delete" button on any popup card
   - Confirm the deletion

## Translation Keys Needed

The following translation keys should be added to your i18n files:
- `createNewPopup` - "Create a new popup"
- `popupTitle` - "Pop-up title"
- `afterLoggingInPopupTitle` - "After logging in Pop-up title" (placeholder)
- `displayType` - "Display Type"
- `standard` - "standard"
- `center` - "center"
- `doesntExist` - "doesn't exist"
- `width` - "Width"
- `heightMinimum` - "Height (minimum)"
- `if0NoWidthRestriction` - "if 0, there is no width restriction"
- `if0NoHeightLimit` - "if 0, there is no height limit"
- `content` - "Content"
- `registration` - "registration"
- `popup` - "Pop-up"
- `settings` - "Settings"
- `change` - "change"
- `loading` - "Loading..."
- `success` - "Success"
- `popupCreatedSuccessfully` - "Popup created successfully"
- `popupUpdatedSuccessfully` - "Popup updated successfully"
- `popupDeletedSuccessfully` - "Popup deleted successfully"

## Files Modified

### Backend:
1. `/backend/src/internal/models/popup.go`
2. `/backend/src/graph/schema/popup.graphql`
3. `/backend/src/internal/loaders/popup.go`
4. GraphQL generated files (auto-generated)

### Frontend:
1. `/frontend/src/src/types/index.d.ts`
2. `/frontend/src/src/actions/popup.ts`
3. `/frontend/src/src/app/(admin)/admin/settings/popup/page.tsx`

## Notes

- The card-based layout provides a more intuitive interface for managing popups
- Each popup can now be edited inline without opening a modal
- The display type field allows for future control over when/where popups appear
- Width and height controls give precise control over popup dimensions
- All existing functionality (create, read, update, delete) is preserved

