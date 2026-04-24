# Test Requirements

**Purpose:** Document all test cases in plain English. Edit this file to request new tests, then reference it when asking for implementation.

**Status Markers:**
- ✅ = Test implemented and passing
- ⏳ = Test pending implementation
- 📋 = Test planned but not started

---

## Phase 1: Storage Module

### Personas Management
- ✅ should save and retrieve personas
- ✅ should return empty array when no personas saved
- ✅ should throw error when saving non-array
- ⏳ should prevent duplicate persona IDs
- ⏳ should validate persona object structure (must have id, name, avatar)

### Groups Management
- ✅ should save and retrieve groups
- ✅ should return empty array when no groups saved
- ⏳ should validate group object structure
- ⏳ should prevent duplicate group IDs

### API Key (Encrypted)
- ✅ should encrypt and decrypt API key
- ✅ should return empty string when no key set
- ✅ should not store key in plaintext
- ⏳ should handle corrupted encrypted data gracefully

### Group Messages
- ✅ should save and retrieve group messages
- ✅ should require groupId
- ⏳ should organize messages by timestamp
- ⏳ should handle large message histories (100+ messages)

### Persona History
- ✅ should save and retrieve persona history
- ✅ should require groupId and personaId
- ⏳ should maintain conversation turn order
- ⏳ should limit history to last 50 exchanges

### Trait Definitions
- ✅ should return default traits when not set
- ✅ should save and retrieve custom traits
- ⏳ should validate trait structure (name, description, min/max values)

### Utility Functions
- ✅ should export all data
- ✅ should import data
- ✅ should clear all data
- ⏳ should validate data before import
- ⏳ should handle corrupted export files

---

## Phase 2: Persona Manager (Planned)

### Create Operations
- 📋 should create a new persona with valid data
- 📋 should assign unique ID automatically
- 📋 should validate required fields (name, systemPrompt, avatar)
- 📋 should initialize empty trait values
- 📋 should persist to storage immediately

### Read Operations
- 📋 should retrieve single persona by ID
- 📋 should retrieve all personas
- 📋 should return null/error for non-existent ID
- 📋 should handle empty persona list

### Update Operations
- 📋 should update persona name
- 📋 should update persona traits
- 📋 should update systemPrompt
- 📋 should validate updates before saving
- 📋 should preserve unmodified fields

### Delete Operations
- 📋 should delete persona by ID
- 📋 should remove from storage
- 📋 should handle deleting non-existent persona
- 📋 should clean up related group associations

### Validation
- 📋 should require name field (non-empty string)
- 📋 should require systemPrompt field (non-empty string)
- 📋 should require avatar field (emoji or URL)
- 📋 should validate trait values are within min/max
- 📋 should reject invalid persona objects

---

## Phase 2: Group Manager (Planned)

### Create Operations
- 📋 should create a new group with valid data
- 📋 should assign unique ID automatically
- 📋 should validate required fields (name, personaIds)
- 📋 should initialize empty message array
- 📋 should persist to storage immediately

### Read Operations
- 📋 should retrieve single group by ID
- 📋 should retrieve all groups
- 📋 should return null/error for non-existent ID
- 📋 should list personas in group

### Update Operations
- 📋 should update group name
- 📋 should add persona to group
- 📋 should remove persona from group
- 📋 should validate personaIds exist before adding
- 📋 should prevent duplicate personas in group

### Delete Operations
- 📋 should delete group by ID
- 📋 should remove from storage
- 📋 should archive message history (optional)
- 📋 should handle deleting non-existent group

### Message Management
- 📋 should add message to group
- 📋 should associate message with persona
- 📋 should timestamp each message
- 📋 should retrieve group conversation history
- 📋 should clear group messages

---

## Phase 3: Chat Engine (Planned)

### Message Processing
- 📋 should accept user message with group context
- 📋 should identify participating personas
- 📋 should generate responses from each persona
- 📋 should maintain conversation context

### Prompt Formatting
- 📋 should format system prompt with persona traits
- 📋 should include conversation history in context
- 📋 should include group metadata

### Response Handling
- 📋 should parse API response correctly
- 📋 should handle API errors gracefully
- 📋 should timeout long-running requests
- 📋 should retry failed requests

---

## Phase 3: LLM Integration (Planned)

### API Communication
- 📋 should send request with correct API key
- 📋 should format payload for LLM endpoint
- 📋 should handle successful response
- 📋 should handle rate limiting

### Error Handling
- 📋 should handle authentication errors
- 📋 should handle network timeout
- 📋 should handle malformed response
- 📋 should provide meaningful error messages

---

## Phase 3: Trait Management (Planned)

### Trait Value Operations
- 📋 should set trait value for persona
- 📋 should validate value within min/max range
- 📋 should retrieve current trait value
- 📋 should track trait value history

### Trait Defaults
- 📋 should initialize default trait values
- 📋 should allow custom trait definitions
- 📋 should prevent invalid trait names

---

## Integration Tests (All Phases)

### Cross-Module Integration
- 📋 PersonaManager should persist to Storage
- 📋 GroupManager should persist to Storage
- 📋 ChatEngine should use PersonaManager data
- 📋 LLMIntegration should receive ChatEngine requests

### End-to-End Workflows
- 📋 create persona → save to storage → retrieve in group
- 📋 create group → add personas → send message → save history
- 📋 send group message → generate responses → persist results
- 📋 export all data → clear all → import data → verify identical

---

## How to Request New Tests

**To add tests, edit this file:**

1. Find the module section (e.g., "Storage Module", "PersonaManager")
2. Find the subsection (e.g., "Personas Management")
3. Add new requirement as a bullet point with status:
   - Use `⏳` for new pending tests
   - Use `📋` for planned tests

**Example:**
```markdown
### Personas Management
- ✅ should save and retrieve personas
- ⏳ should prevent duplicate persona IDs    ← NEW
- ⏳ should handle very long persona names   ← NEW
```

4. Then ask: "I added new test requirements in TEST_REQUIREMENTS.md under [Module] - [Section]. Can you implement them?"

**Example request:**
> "I added new test requirements in TEST_REQUIREMENTS.md under StorageModule > Personas Management. Can you implement the pending tests?"

---

## Test Implementation Workflow

1. **Edit this file** - add requirements in English (mark with ⏳)
2. **Request implementation** - reference the section and status marker
3. **Tests implemented** - marked ✅ when done
4. **Verify in browser** - open tests/index.html to see results

---

## Current Test Status Summary

| Module | Section | Total | ✅ Done | ⏳ Pending | 📋 Planned |
|--------|---------|-------|---------|-----------|-----------|
| Storage | Personas | 5 | 3 | 2 | - |
| Storage | Groups | 4 | 2 | 2 | - |
| Storage | API Key | 4 | 3 | 1 | - |
| Storage | Messages | 4 | 2 | 2 | - |
| Storage | History | 4 | 2 | 2 | - |
| Storage | Traits | 3 | 2 | 1 | - |
| Storage | Utilities | 5 | 3 | 2 | - |
| **TOTALS** | | **29** | **17 ✅** | **12 ⏳** | **- 📋** |
| PersonaManager | - | - | - | - | 19 📋 |
| GroupManager | - | - | - | - | 17 📋 |
| ChatEngine | - | - | - | - | 7 📋 |
| LLMIntegration | - | - | - | - | 7 📋 |
| TraitManagement | - | - | - | - | 5 📋 |
| Integration | - | - | - | - | 7 📋 |

---

## Notes

- Tests are implemented in `tests/[module].test.js`
- Each test file imports from `tests/framework.js` (test runner)
- Modules load from `modules/[module].js`
- Mocks available in `mocks/[module]-mock.js`
- All tests run in browser: open `tests/index.html`
