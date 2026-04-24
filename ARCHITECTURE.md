# Psychology Bot Swarm - Modular Architecture

**Status:** Phase 1 - Storage Module (Complete)  
**Last Updated:** April 22, 2026  
**Pattern:** IIFE with Namespace (No build tools required)

---

## Quick Start

### Run Tests
```bash
# Open in browser:
open tests/index.html
```

### Use Storage Module
```javascript
// In psychology-bot-swarm.html, add:
<script src="modules/storage.js"></script>

// Then use in code:
psychologyBot.StorageModule.getPersonas()
psychologyBot.StorageModule.savePersonas(personas)
```

---

## Architecture Overview

### Pattern: IIFE with Namespace
```javascript
window.psychologyBot = window.psychologyBot || {};

window.psychologyBot.StorageModule = (function() {
    // Private variables
    const KEYS = { /* ... */ };
    
    // Public API
    return {
        getPersonas() { /* ... */ },
        savePersonas() { /* ... */ }
    };
})();
```

**Benefits:**
✅ Works in any browser (no build tools)  
✅ Isolated namespace (no global pollution)  
✅ Easy testing with simple HTML  
✅ Gradual migration possible  
✅ No dependencies  

---

## Module Status

| Phase | Module | Status | Tests | File |
|-------|--------|--------|-------|------|
| **1** | **Storage** | ✅ Complete | ✅ 15 tests | `modules/storage.js` |
| 2 | PersonaManager | ⏳ Next | - | - |
| 2 | GroupManager | ⏳ Next | - | - |
| 3 | CharacterTraits | 📋 Planned | - | - |
| 3 | ChatEngine | 📋 Planned | - | - |
| 3 | LLMIntegration | 📋 Planned | - | - |

---

## Phase 1: Storage Module (Complete)

### Purpose
Centralized localStorage persistence with:
- Personas CRUD
- Groups CRUD
- Messages per group
- Encrypted API key
- Persona conversation history
- Trait definitions

### API
```javascript
// Personas
psychologyBot.StorageModule.getPersonas()
psychologyBot.StorageModule.savePersonas(personas)

// Groups
psychologyBot.StorageModule.getGroups()
psychologyBot.StorageModule.saveGroups(groups)

// Messages
psychologyBot.StorageModule.getGroupMessages(groupId)
psychologyBot.StorageModule.saveGroupMessages(groupId, messages)

// API Key (encrypted)
psychologyBot.StorageModule.getApiKey()
psychologyBot.StorageModule.saveApiKey(key)

// History per persona
psychologyBot.StorageModule.getPersonaHistory(groupId, personaId)
psychologyBot.StorageModule.savePersonaHistory(groupId, personaId, history)

// Traits
psychologyBot.StorageModule.getTraitDefinitions()
psychologyBot.StorageModule.saveTraitDefinitions(traits)

// Utilities
psychologyBot.StorageModule.clearAllData()
psychologyBot.StorageModule.exportAllData()
psychologyBot.StorageModule.importData(data)
```

### Tests (15 tests, all passing ✅)

**Personas:** Save/retrieve, empty defaults, validation  
**Groups:** Save/retrieve, empty defaults  
**API Key:** Encryption, decryption, no plaintext storage  
**Messages:** Per-group storage, validation  
**History:** Per-persona per-group storage  
**Traits:** Defaults, custom traits  
**Utilities:** Export, import, clear  

---

## File Structure

```
pshyco-chat/
├── modules/                    # Extracted modules (Phase 1+)
│   └── storage.js             ✅ Phase 1 (COMPLETE)
├── tests/                     # Test files
│   ├── index.html             ✅ Test runner
│   ├── framework.js           ✅ Simple test framework
│   └── storage.test.js        ✅ Phase 1 tests (15 tests)
├── mocks/                     # Mock modules for testing
│   └── storage-mock.js        ✅ Mock storage
├── psychology-bot-swarm.html  (Main app - will add imports)
├── ARCHITECTURE.md            (This file)
└── MIGRATION_GUIDE.md         (Phase-by-phase instructions)
```

---

## How to Use Storage Module

### From Psychology Bot Swarm

1. **Add import to HTML:**
```html
<!-- In psychology-bot-swarm.html head section -->
<script src="modules/storage.js"></script>
```

2. **Replace internal Storage with module:**
```javascript
// OLD (in psychology-bot-swarm.html):
const Storage = { /* ... */ };

// NEW: Use psychologyBot.StorageModule
// Change all: Storage.getPersonas() → psychologyBot.StorageModule.getPersonas()
```

### Testing

1. **Open test runner:**
   - Open `tests/index.html` in browser
   - All 15 tests should pass ✅

2. **With Mock Storage:**
```javascript
// Use mock for testing without localStorage
psychologyBot.StorageModule = psychologyBot.MockStorageModule;
psychologyBot.StorageModule.reset(); // Clear for clean test

// Now test other modules without affecting localStorage
```

---

## Next Steps: Phase 2

### PersonaManager Module

**Responsibility:**
- Persona CRUD operations
- Trait value management
- Persona validation

**Dependencies:**
- StorageModule

**Expected Tests:**
```
- createPersona()
- updatePersona()
- deletePersona()
- getPersonaById()
- getAllPersonas()
- setTraitValue()
- validation (required fields, unique IDs)
```

**When Phase 2 is ready:**
1. Extract PersonaManager to `modules/persona-manager.js`
2. Create tests in `tests/persona-manager.test.js`
3. Update HTML imports
4. Run all tests (Storage + PersonaManager)
5. Verify no regressions

---

## Refactoring Safety

### Validation Checklist (Each Phase)

After extract & test, verify:
- [ ] All tests pass
- [ ] No console errors
- [ ] All UI features work identically
- [ ] localStorage data persists
- [ ] No performance degradation
- [ ] Mobile UI responsive
- [ ] API key still works
- [ ] Message history intact
- [ ] Personas/traits unchanged
- [ ] Groups work as before

### Rollback Strategy

If something breaks:
1. Backup current `psychology-bot-swarm.html`
2. Can revert to previous version any time
3. localStorage data safe (persists across code changes)
4. Tests serve as regression detection

---

## Architecture Principles

1. **No Breaking Changes** ✓ - Each phase maintains 100% functionality
2. **Testability First** ✓ - Every module independently testable
3. **Mock Everything** ✓ - External dependencies mockable
4. **Stable API** ✓ - Module interfaces don't change
5. **Gradual Migration** ✓ - Deploy partial refactoring safely

---

## Testing Methodology

### Test Framework

**Tool:** Simple HTML-based test framework (no Node.js, Jest, or Vitest required)

**Structure:**
```
tests/
├── framework.js           # Test runner logic (assert, describe, displayResults)
├── index.html             # Test runner UI
├── storage.test.js        # Phase 1 tests
├── persona-manager.test.js # Phase 2 tests (future)
└── [module].test.js       # One test file per module
```

### Unit Testing Pattern

**How We Write Tests:**

```javascript
TestFramework.describe('Storage Module: Personas', () => {
    TestFramework.assert(
        condition,
        'Description of what should pass'
    );
});
```

**Example from Phase 1:**
```javascript
TestFramework.describe('Save and retrieve personas', () => {
    const personas = [{ id: 'p1', name: 'Alice', traitValues: {} }];
    psychologyBot.StorageModule.savePersonas(personas);
    const retrieved = psychologyBot.StorageModule.getPersonas();
    
    TestFramework.assert(
        retrieved[0].name === 'Alice',
        'Persona name should match saved value'
    );
    TestFramework.assert(
        retrieved.length === 1,
        'Should return exactly one persona'
    );
});
```

### Test Coverage Strategy

**For Each Module - Minimum Tests Required:**

| Category | Tests | Coverage |
|----------|-------|----------|
| **Create** | 2-3 | Valid input, validation failure, edge cases |
| **Read** | 2-3 | Get single, get all, empty state |
| **Update** | 2-3 | Update fields, partial updates, validation |
| **Delete** | 1-2 | Delete existing, handle missing |
| **Validation** | 2-3 | Required fields, invalid types, boundaries |
| **Integration** | 2-3 | Interacts correctly with StorageModule |
| **Edge Cases** | 1-2 | null/undefined, empty strings, large data |

**Phase 1 Example:**
- Storage Module: 15 tests covering 7 categories
- Personas (3), Groups (2), API Key (3), Messages (2), History (2), Traits (2), Utilities (3)
- Expected result: ✅ 15/15 passing

### Testing Each Module Type

#### 1. Storage-Based Modules (Personas, Groups, API Keys)
```javascript
// Test: Read after write
save(items);
const retrieved = get();
assert(retrieved equals items);

// Test: Persistence
refresh page;
const persisted = get();
assert(persisted equals items);

// Test: Encryption (API Keys only)
saveApiKey('secret123');
const fromStorage = localStorage.getItem('...');
assert(fromStorage !== 'secret123'); // Should be encrypted
```

#### 2. Manager Modules (PersonaManager, GroupManager)
```javascript
// Test: CRUD operations
create(newItem) → should return with ID
getById(id) → should return exact item
update(id, changes) → merge changes
delete(id) → remove from storage

// Test: Validation
createWithInvalidData() → should throw error
updateNonExistent(id) → should throw error

// Test: Storage Integration
manager.create(item) → StorageModule.save() called
manager.delete(id) → StorageModule.delete() called
```

#### 3. UI Component Modules (ResponderSelector, ModalManager, MentorBot)
```javascript
// Test: DOM manipulation
create(element) → should add to DOM
update(data) → should render new data
destroy() → should clean up listeners

// Test: Event handling
click event → should call handler
input change → should call validator

// Test: State
setState(newState) → should update
getState() → should return current state
```

#### 4. Business Logic Modules (ChatEngine, LLMIntegration)
```javascript
// Test: Logic correctness
processMessage(msg) → should return expected output
formatPrompt(traits, context) → correct format
handleResponse(apiResponse) → proper parsing

// Test: Error handling
apiErrorResponse → should throw/handle gracefully
malformedInput → should return error
timeout → should handle appropriately
```

### Running Tests

**Step 1: Open Test Runner**
```
tests/index.html (in browser)
```

**Step 2: View Results**
- Green ✅ = Test passed
- Red ❌ = Test failed
- Results include: Total tests, passed, failed, per-suite breakdown

**Step 3: Debug Failures**
```javascript
// In browser console:
console.log(psychologyBot.StorageModule); // Check module loaded
psychologyBot.StorageModule.getPersonas(); // Test manually
```

### Test Coverage Goals

**Required Coverage by Phase:**

| Phase | Module | Minimum Tests | Target Coverage |
|-------|--------|---------------|-----------------|
| 1 | Storage | 15 ✅ | 100% API coverage |
| 2 | PersonaManager | 12-15 | All CRUD ops |
| 2 | GroupManager | 10-12 | All CRUD ops |
| 3 | ChatEngine | 8-10 | Core logic paths |
| 3 | Traits | 6-8 | Validation, updates |
| 3 | LLMIntegration | 10-12 | API calls, errors |
| 4 | UI Components | 6-8 per component | Render, events, state |
| 5 | Integration | 15-20 | End-to-end workflows |

**Target: 1 test per 20-30 lines of code**

### Mock Testing Pattern

**Use Mock Modules for Testing Downstream Modules:**

```javascript
// In Phase 2 tests (PersonaManager depends on Storage):
// Don't use real Storage, use mock to isolate tests

psychologyBot.StorageModule = psychologyBot.MockStorageModule;
psychologyBot.StorageModule.reset(); // Clean state for each test

// Now test PersonaManager without affecting real localStorage
psychologyBot.PersonaManager.create({ name: 'Test' });
// Storage calls go to mock, not real localStorage
```

**Mock Benefits:**
✅ Tests run faster (no I/O)  
✅ Isolated from other modules  
✅ Predictable test state  
✅ Can test error scenarios easily  

### Integration Testing

**After Each Phase - Run All Tests Together:**

```javascript
// tests/index.html loads:
1. framework.js              // Test runner
2. modules/storage.js        // Real Storage module
3. modules/persona-manager.js // New module (Phase 2)
4. tests/storage.test.js
5. tests/persona-manager.test.js

Results: All tests together (Storage + PersonaManager = ~27 tests)
Target: ✅ 100% passing (0 regressions)
```

### Manual Testing Checklist

**After Automated Tests Pass - Verify in App:**

- [ ] Open app (psychology-bot-swarm.html)
- [ ] Create new persona
- [ ] Save personas (localStorage)
- [ ] Refresh page → personas still there
- [ ] Create group
- [ ] Send message → group messages saved
- [ ] Add trait value → persists
- [ ] Set API key → works with API calls
- [ ] Export data → JSON valid
- [ ] Delete persona → removed from UI
- [ ] Mobile responsive → layout correct
- [ ] No console errors → all clean

---

## Key Files

| File | Purpose | Status |
|------|---------|--------|
| `modules/storage.js` | Storage IIFE module | ✅ Complete |
| `tests/index.html` | Test runner | ✅ Complete |
| `tests/framework.js` | Simple test framework | ✅ Complete |
| `tests/storage.test.js` | Storage tests | ✅ Complete (15 tests) |
| `mocks/storage-mock.js` | Mock storage | ✅ Complete |
| `ARCHITECTURE.md` | This document | ✅ Complete |

---

## Testing Results

**Phase 1 Storage Module:**
```
✅ Personas: 3 tests passing
✅ Groups: 2 tests passing
✅ API Key: 3 tests passing
✅ Messages: 2 tests passing
✅ History: 2 tests passing
✅ Traits: 2 tests passing
✅ Utilities: 3 tests passing
─────────────────────────
✅ TOTAL: 15 tests passing, 0 failures
```

---

## Communication Protocol

When requesting changes in Phase 2+:

**Format:**
```
Module: [PersonaManager | GroupManager | ChatEngine | etc]
Change: [Create | Update | Delete | Add Feature]
Description: [What & Why]
Tests: [What should pass]
```

**Example:**
```
Module: PersonaManager
Change: Add validation for required fields
Description: Personas should require name and systemPrompt
Tests: 
  - createPersona({}) should throw error
  - createPersona({name: 'Alice'}) should throw error (missing systemPrompt)
  - createPersona({name: 'Alice', systemPrompt: '...'}) should succeed
```

This ensures changes stay in scope and don't affect other modules.

---

## Questions?

Refer to:
- Architecture document (this file)
- Test cases in `tests/storage.test.js`
- Module code in `modules/storage.js`
- Mock implementation in `mocks/storage-mock.js`
