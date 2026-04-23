# Developer Quick Reference

**Quick start for working with modular architecture**

---

## Running Tests

```bash
# Open test runner in browser
open tests/index.html

# View results - should see:
✅ StorageModule - Personas: 3 passing
✅ StorageModule - Groups: 2 passing
✅ StorageModule - API Key: 3 passing
✅ StorageModule - Messages: 2 passing
✅ StorageModule - History: 2 passing
✅ StorageModule - Traits: 2 passing
✅ StorageModule - Utilities: 3 passing
✅ TOTAL: 15 tests passing, 0 failures
```

---

## Module Structure

### Adding a New Test

```javascript
// In tests/storage.test.js (or new test file)

describe('ModuleName - Feature', (it) => {
    it('should do something', () => {
        // Arrange
        const input = 'value';
        
        // Act
        const result = psychologyBot.ModuleModule.method(input);
        
        // Assert
        assert(result === expected, 'Description of failure');
    });
});
```

### Using a Module

```javascript
// Enable module in HTML
<script src="modules/storage.js"></script>

// Use in code
const personas = psychologyBot.StorageModule.getPersonas();
psychologyBot.StorageModule.savePersonas(updatedPersonas);
```

### Creating a Mock

```javascript
// In mocks/new-mock.js
window.psychologyBot.MockNewModule = (function() {
    let data = {};
    
    return {
        reset() { data = {}; },
        method() { /* ... */ },
        anotherMethod() { /* ... */ }
    };
})();
```

---

## Common Tasks

### Debug Storage
```javascript
// In browser console
psychologyBot.StorageModule.exportAllData()
```

### Clear All Data
```javascript
psychologyBot.StorageModule.clearAllData()
```

### Check API Key
```javascript
console.log(psychologyBot.StorageModule.getApiKey())
```

### Run Specific Test
```javascript
// Edit tests/storage.test.js
// Comment out other describe() blocks
// Leave only the one you want to test
```

---

## File Locations

| Purpose | Location |
|---------|----------|
| Main app | `psychology-bot-swarm.html` |
| Modules | `modules/*.js` |
| Tests | `tests/*.test.js` |
| Test runner | `tests/index.html` |
| Test framework | `tests/framework.js` |
| Mocks | `mocks/*-mock.js` |
| Docs | `ARCHITECTURE.md`, `MIGRATION_GUIDE.md` |

---

## Making Changes

### Policy: One Module at a Time

1. **Identify the module** (Storage, PersonaManager, etc.)
2. **Make changes to that module only**
3. **Update matching tests**
4. **Run tests** - all should pass
5. **Verify no other modules affected**
6. **Commit changes**

### Example: Adding Storage Feature

```javascript
// 1. Add method to modules/storage.js
window.psychologyBot.StorageModule = (function() {
    return {
        // ... existing methods
        newMethod() { /* ... */ }  // NEW
    };
})();

// 2. Test it in tests/storage.test.js
describe('StorageModule - NewFeature', (it) => {
    it('should work', () => {
        psychologyBot.StorageModule.newMethod()
        assert(true);
    });
});

// 3. Run tests
// tests/index.html - should pass

// 4. Use in psychology-bot-swarm.html
psychologyBot.StorageModule.newMethod()
```

---

## Communication Format

When asking for changes:

```
Module: [Which module]
Change: [CRUD operation or feature name]
Requirement: [What should it do]
Tests: [How to verify]

Example:
Module: StorageModule
Change: ADD deletePersona method
Requirement: Delete persona by ID, remove from all groups
Tests: 
  - deletePersona('id1') removes from storage
  - Groups referencing it don't crash
```

---

## Test Debugging

### Test Fails?

1. **Check error message:**
```
✗ should xyz
  Error: assertion failed: xyz is wrong
```

2. **Check the test:**
```javascript
it('should xyz', () => {
    const result = psychologyBot.Module.method();
    assert(result === expected, 'xyz is wrong');  // Line with error
});
```

3. **Debug in console:**
```javascript
psychologyBot.Module.method()  // What does it return?
```

4. **Fix module or test:**
- If module is wrong: fix `modules/*.js`
- If test is wrong: fix `tests/*.test.js`

5. **Re-run tests:** `tests/index.html`

---

## Browser Console Tips

```javascript
// Check if module loaded
window.psychologyBot.StorageModule

// See all data
psychologyBot.StorageModule.exportAllData()

// Clear everything
psychologyBot.StorageModule.clearAllData()

// Test a method
psychologyBot.StorageModule.getPersonas()

// Look for errors
// F12 → Console tab → watch for red errors
```

---

## Checklist Before Committing

- [ ] All tests pass (`tests/index.html`)
- [ ] No console errors (F12)
- [ ] App still works normally
- [ ] Data persists (reload page)
- [ ] Only one module changed
- [ ] Comments added to complex code
- [ ] Tests cover new functionality

---

## When Something Breaks

1. **Check console** (F12 → Console)
2. **Check tests** (run tests/index.html)
3. **Check localStorage** (console: `psychologyBot.StorageModule.exportAllData()`)
4. **Check git diff** (what changed?)
5. **Revert last change** (undo or git revert)
6. **Try again** (more carefully)

---

## Need Help?

- **Understanding architecture?** → Read `ARCHITECTURE.md`
- **Want to add a feature?** → Read `MIGRATION_GUIDE.md`
- **Tests failing?** → Check `tests/storage.test.js` examples
- **Using modules?** → Check usage in `psychology-bot-swarm.html`
- **Testing?** → Check test framework in `tests/framework.js`

---

**Remember:** One module at a time, always test, clear communication!
