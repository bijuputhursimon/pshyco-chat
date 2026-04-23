/**
 * Storage Module Tests
 * Tests: modules/storage.js
 */

const { describe, assert } = window.TestFramework;

// Clear localStorage before tests
localStorage.clear();

describe('StorageModule - Personas', (it) => {
    it('should save and retrieve personas', () => {
        const personas = [
            { id: '1', name: 'Alice', avatar: '😊' },
            { id: '2', name: 'Bob', avatar: '🤖' }
        ];
        
        psychologyBot.StorageModule.savePersonas(personas);
        const retrieved = psychologyBot.StorageModule.getPersonas();
        
        assert(Array.isArray(retrieved), 'Retrieved should be array');
        assert(retrieved.length === 2, 'Should have 2 personas');
        assert(retrieved[0].name === 'Alice', 'First persona should be Alice');
    });
    
    it('should return empty array when no personas saved', () => {
        localStorage.clear();
        const personas = psychologyBot.StorageModule.getPersonas();
        assert(Array.isArray(personas), 'Should return array');
        assert(personas.length === 0, 'Should be empty');
    });
    
    it('should throw error when saving non-array', () => {
        try {
            psychologyBot.StorageModule.savePersonas({ name: 'Invalid' });
            assert(false, 'Should have thrown error');
        } catch (e) {
            assert(true, 'Correctly threw error');
        }
    });
});

describe('StorageModule - Groups', (it) => {
    it('should save and retrieve groups', () => {
        localStorage.clear();
        const groups = [
            { id: 'g1', name: 'Sales Team', personaIds: ['1', '2'] }
        ];
        
        psychologyBot.StorageModule.saveGroups(groups);
        const retrieved = psychologyBot.StorageModule.getGroups();
        
        assert(retrieved.length === 1, 'Should have 1 group');
        assert(retrieved[0].name === 'Sales Team', 'Group name matches');
    });
    
    it('should return empty array when no groups', () => {
        localStorage.clear();
        const groups = psychologyBot.StorageModule.getGroups();
        assert(groups.length === 0, 'Should be empty');
    });
});

describe('StorageModule - API Key (Encrypted)', (it) => {
    it('should encrypt and decrypt API key', () => {
        localStorage.clear();
        const apiKey = 'sk-abc123xyz789';
        
        psychologyBot.StorageModule.saveApiKey(apiKey);
        const retrieved = psychologyBot.StorageModule.getApiKey();
        
        assert(retrieved === apiKey, 'Retrieved key should match original');
    });
    
    it('should return empty string when no key set', () => {
        localStorage.clear();
        const key = psychologyBot.StorageModule.getApiKey();
        assert(key === '', 'Should be empty string');
    });
    
    it('should not store key in plaintext', () => {
        localStorage.clear();
        const apiKey = 'sk-secret123';
        psychologyBot.StorageModule.saveApiKey(apiKey);
        
        const stored = localStorage.getItem('psychology_api_key');
        assert(stored !== apiKey, 'Stored value should be encrypted');
        assert(stored.length > 0, 'Stored value should exist');
    });
});

describe('StorageModule - Group Messages', (it) => {
    it('should save and retrieve group messages', () => {
        localStorage.clear();
        const messages = [
            { role: 'user', text: 'Hello', timestamp: '2026-04-22T10:00:00Z' },
            { role: 'model', text: 'Hi there!', timestamp: '2026-04-22T10:00:05Z' }
        ];
        
        psychologyBot.StorageModule.saveGroupMessages('group1', messages);
        const retrieved = psychologyBot.StorageModule.getGroupMessages('group1');
        
        assert(retrieved.length === 2, 'Should have 2 messages');
        assert(retrieved[0].role === 'user', 'First message is from user');
    });
    
    it('should require groupId', () => {
        try {
            psychologyBot.StorageModule.saveGroupMessages(null, []);
            assert(false, 'Should throw error');
        } catch (e) {
            assert(true, 'Correctly requires groupId');
        }
    });
});

describe('StorageModule - Persona History', (it) => {
    it('should save and retrieve persona history', () => {
        localStorage.clear();
        const history = [
            { role: 'user', parts: [{ text: 'Hi Alice' }] },
            { role: 'model', parts: [{ text: 'Hello!' }] }
        ];
        
        psychologyBot.StorageModule.savePersonaHistory('group1', 'persona1', history);
        const retrieved = psychologyBot.StorageModule.getPersonaHistory('group1', 'persona1');
        
        assert(retrieved.length === 2, 'Should have 2 history items');
    });
    
    it('should require groupId and personaId', () => {
        try {
            psychologyBot.StorageModule.savePersonaHistory(null, 'p1', []);
            assert(false, 'Should throw error');
        } catch (e) {
            assert(true, 'Correctly validates parameters');
        }
    });
});

describe('StorageModule - Trait Definitions', (it) => {
    it('should return default traits when not set', () => {
        localStorage.clear();
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        
        assert(Array.isArray(traits), 'Should return array');
        assert(traits.length > 0, 'Should have defaults');
        assert(traits.some(t => t.id === 'optimism'), 'Should have optimism trait');
    });
    
    it('should save and retrieve custom traits', () => {
        localStorage.clear();
        const customTraits = [
            { id: 'custom1', label: 'My Custom Trait', enabled: true }
        ];
        
        psychologyBot.StorageModule.saveTraitDefinitions(customTraits);
        const retrieved = psychologyBot.StorageModule.getTraitDefinitions();
        
        assert(retrieved.length === 1, 'Should have 1 custom trait');
        assert(retrieved[0].id === 'custom1', 'Should match custom trait id');
    });
});

describe('StorageModule - Utility Functions', (it) => {
    it('should export all data', () => {
        localStorage.clear();
        psychologyBot.StorageModule.savePersonas([{ id: '1', name: 'Alice' }]);
        psychologyBot.StorageModule.saveGroups([{ id: 'g1', name: 'Team' }]);
        
        const exported = psychologyBot.StorageModule.exportAllData();
        
        assert(exported.version !== undefined, 'Should have version');
        assert(exported.timestamp !== undefined, 'Should have timestamp');
        assert(exported.data.personas.length > 0, 'Should have personas');
        assert(exported.data.groups.length > 0, 'Should have groups');
    });
    
    it('should import data', () => {
        localStorage.clear();
        const exported = {
            version: 1,
            timestamp: new Date().toISOString(),
            data: {
                personas: [{ id: '1', name: 'Imported' }],
                groups: [],
                traits: []
            }
        };
        
        psychologyBot.StorageModule.importData(exported);
        const personas = psychologyBot.StorageModule.getPersonas();
        
        assert(personas.length > 0, 'Should have imported persona');
    });
    
    it('should clear all data', () => {
        localStorage.clear();
        psychologyBot.StorageModule.savePersonas([{ id: '1', name: 'Test' }]);
        psychologyBot.StorageModule.clearAllData();
        
        const personas = psychologyBot.StorageModule.getPersonas();
        const apiKey = psychologyBot.StorageModule.getApiKey();
        
        assert(personas.length === 0, 'Personas should be cleared');
        assert(apiKey === '', 'API key should be cleared');
    });
});
