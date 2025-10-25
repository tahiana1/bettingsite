# Mini Bet Options API Documentation

## Overview
This document describes the Mini Bet Options API endpoints for managing betting options in mini games like EOS1Min, EOS2Min, etc.

## Models

### MiniBetOption
- `id`: Primary key
- `name`: Betting option name (e.g., "Powerball Odd")
- `odds`: Odds as string (e.g., "1.95")
- `type`: "single" or "combination"
- `ball`: Ball color for single bets ("blue", "red", "green")
- `text`: Ball text for single bets ("Odd", "Even", "Under", "Over")
- `balls`: Array of ball options for combination bets
- `gameType`: Game type (e.g., "eos1min", "eos2min")
- `category`: "powerball" or "normalball"
- `level`: Level 1-15
- `enabled`: Boolean status
- `orderNum`: Display order

### MiniGameConfig
- `id`: Primary key
- `gameType`: Game type identifier
- `level`: Level 1-15
- `maxBettingValue`: Maximum betting amount
- `minBettingValue`: Minimum betting amount
- `isActive`: Game status

## API Endpoints

### Public Endpoints (No Authentication Required)

#### GET /api/v1/mini/options
Get all mini bet options with optional filtering.

**Query Parameters:**
- `gameType`: Filter by game type (e.g., "eos1min")
- `category`: Filter by category ("powerball", "normalball")
- `level`: Filter by level (1-15)
- `enabled`: Filter by enabled status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Powerball Odd",
      "odds": "1.95",
      "type": "single",
      "ball": "blue",
      "text": "Odd",
      "gameType": "eos1min",
      "category": "powerball",
      "level": 1,
      "enabled": true,
      "orderNum": 1
    }
  ],
  "count": 1
}
```

#### GET /api/v1/mini/options/:id
Get a specific mini bet option by ID.

#### GET /api/v1/mini/configs
Get mini game configurations.

### Protected Endpoints (Authentication Required)

#### POST /api/v1/mini/options
Create a new mini bet option.

**Request Body:**
```json
{
  "name": "Powerball Odd",
  "odds": "1.95",
  "type": "single",
  "ball": "blue",
  "text": "Odd",
  "gameType": "eos1min",
  "category": "powerball",
  "level": 1,
  "enabled": true,
  "orderNum": 1
}
```

#### PUT /api/v1/mini/options/:id
Update an existing mini bet option.

#### DELETE /api/v1/mini/options/:id
Soft delete a mini bet option.

#### PATCH /api/v1/mini/options/:id/toggle
Toggle the enabled status of a mini bet option.

#### PUT /api/v1/mini/options/bulk-update
Update multiple mini bet options at once.

**Request Body:**
```json
{
  "options": [
    {
      "id": 1,
      "enabled": true,
      "odds": "2.0",
      "orderNum": 1
    }
  ]
}
```

#### PUT /api/v1/mini/configs
Update mini game configuration.

### Admin Endpoints (Admin Authentication Required)

All admin endpoints are prefixed with `/api/v1/admin/mini/` and include:

- `GET /options` - Get all options (admin view)
- `GET /options/:id` - Get specific option
- `POST /options` - Create new option
- `PUT /options/:id` - Update option
- `DELETE /options/:id` - Hard delete option
- `PATCH /options/:id/toggle` - Toggle status
- `PUT /options/bulk-update` - Bulk update
- `POST /options/initialize-defaults` - Initialize default options
- `GET /configs` - Get configurations
- `PUT /configs` - Update configurations

## Frontend Integration

The frontend can now make Axios requests to these endpoints:

```javascript
// Get all options for EOS1Min level 1
const response = await axios.get('/api/v1/mini/options?gameType=eos1min&level=1');

// Create new option
const newOption = await axios.post('/api/v1/mini/options', {
  name: 'New Option',
  odds: '2.0',
  type: 'single',
  ball: 'blue',
  text: 'Odd',
  gameType: 'eos1min',
  category: 'powerball',
  level: 1,
  enabled: true,
  orderNum: 10
});

// Update option
const updatedOption = await axios.put(`/api/v1/mini/options/${id}`, updateData);

// Toggle status
const toggledOption = await axios.patch(`/api/v1/mini/options/${id}/toggle`);

// Delete option
await axios.delete(`/api/v1/mini/options/${id}`);
```

## Database Migration

To use these models, you'll need to run database migrations to create the tables:

```sql
-- MiniBetOption table
CREATE TABLE mini_bet_options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    odds VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    ball VARCHAR(20),
    text VARCHAR(50),
    balls_json TEXT,
    game_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    enabled BOOLEAN DEFAULT true,
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- MiniGameConfig table
CREATE TABLE mini_game_configs (
    id SERIAL PRIMARY KEY,
    game_type VARCHAR(50) NOT NULL UNIQUE,
    level INTEGER NOT NULL DEFAULT 1,
    max_betting_value DECIMAL(10,2) DEFAULT 1000,
    min_betting_value DECIMAL(10,2) DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

## Features Implemented

✅ Complete CRUD operations for mini bet options
✅ Support for both single and combination bets
✅ Game type and category filtering
✅ Level-based configuration
✅ Enable/disable functionality
✅ Bulk update operations
✅ Admin-specific endpoints with hard delete
✅ Default option initialization
✅ Game configuration management
✅ Proper validation and error handling
✅ Soft delete for regular users, hard delete for admins
✅ JSON serialization for combination bets
✅ Order management for display
