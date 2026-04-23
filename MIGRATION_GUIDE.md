# Migration Guide - Phase 1: Storage Module

**Objective:** Integrate extracted StorageModule into psychology-bot-swarm.html  
**Risk Level:** 🟢 LOW (Storage is isolated, self-contained)  
**Rollback:** Simple (revert HTML script imports)  
**Time:** ~15 minutes  

---

## Step 1: Verify Tests Pass

```bash
# Open in browser:
tests/index.html

# Confirm: ✅ 15 tests passing, 0 failures
```

**STOP if any tests fail.** Do not proceed to integration.

---

## Step 2: Add Script Import (No Code Changes Yet)

**File:** `psychology-bot-swarm.html`

**Find line ~1545:** (after external script imports)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

<style>
```

**Add new import:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script src="modules/storage.js"></script>

<style>
```

**Test:** Open psychology-bot-swarm.html in browser
- ✅ No console errors
- ✅ App still works normally
- ✅ Can create personas
- ✅ Can save/retrieve messages

---

## Step 3: Verify Module is Accessible

**In browser console (F12):**
```javascript
// Should work:
psychologyBot.StorageModule.getPersonas()

// Should return existing personas from your app:
// [Array of personas]
```

**If you see `undefined` or error:**
- Check script path
- Verify no localStorage clearing
- Open browser devtools to debug

---

## Step 4: Replace Internal Storage (Gradual)

### Option A: Keep Old Storage (Safest)

**In psychology-bot-swarm.html, around line 1551:**

```javascript
// OLD CODE - KEEP AS-IS FOR NOW
const Storage = {
    getPersonas() {
        return JSON.parse(localStorage.getItem('psychology_personas') || '[]');
    },
    // ... rest of Storage object
};

// ADD NEW REFERENCE (after line 1551, before window.onload)
const StorageModule = psychologyBot.StorageModule;
```

**Then gradually replace references:**
```javascript
// OLD:
const personas = Storage.getPersonas();

// NEW:
const personas = StorageModule.getPersonas();
```

### Option B: Direct Replacement (Faster)

If confident, replace entire Storage object:

**Find:** Line ~1551 `const Storage = {`  
**Find end:** Line ~1606 `}`

**Replace with:**
```javascript
// Use extracted module instead
const Storage = psychologyBot.StorageModule;
```

---

## Step 5: Run Full Tests

**Test the app:**

1. **Open psychology-bot-swarm.html**
2. **Create new persona** (test create)
3. **Save API key** (test encryption)
4. **Create group** (test group storage)
5. **Send message** (test message history)
6. **Export data** (test export utility)
7. **Clear & reload** → Data persists (test localStorage)

**All should work exactly as before ✅**

---

## Step 6: Validate Data Persists

**Test localStorage integration:**

```javascript
// In browser console:
psychologyBot.StorageModule.exportAllData()

// Should show:
{
  version: 1,
  timestamp: "2026-04-22T...",
  data: {
    personas: [...],
    groups: [...],
    traits: [...]
  }
}
```

**Reload page** → All data should be there

---

## Rollback (if needed)

If something breaks:

1. **Comment out the import:**
```html
<!-- <script src="modules/storage.js"></script> -->
```

2. **Keep old Storage object:**
```javascript
const Storage = {
    // ... original implementation
};
```

3. **Reload app** → Back to working state immediately

---

## Validation Checklist

After migration, verify:

- [ ] Page loads without console errors
- [ ] All personas still visible
- [ ] Can create new personas
- [ ] Can create groups
- [ ] Can send messages
- [ ] Can use @mentions
- [ ] Can add traits
- [ ] Can change API key
- [ ] Data persists after reload
- [ ] Export data works
- [ ] Clear data works
- [ ] Mobile UI responsive
- [ ] Pass button works
- [ ] Responder selector works

---

## Monitoring

After migration, watch for:

- ❌ localStorage errors in console
- ❌ JSON parse errors
- ❌ API key not encrypting
- ❌ Data not persisting
- ❌ Message history lost

If any occur, check browser console (F12) for specific errors.

---

## Next: Phase 2 Ready

Once Phase 1 is integrated successfully:

1. **Extract PersonaManager**: `modules/persona-manager.js`
2. **Create tests**: `tests/persona-manager.test.js`
3. **Integrate**: Update HTML imports
4. **Validate**: All tests pass + app works
5. **Repeat** for GroupManager, ChatEngine, etc.

---

## Questions?

**Before proceeding to Phase 2, all of:**
- [ ] Tests pass ✅
- [ ] App works normally ✅
- [ ] Data persists ✅
- [ ] No breaking changes ✅

If any "❌", debug before proceeding.
