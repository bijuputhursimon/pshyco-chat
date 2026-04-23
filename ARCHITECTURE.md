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
