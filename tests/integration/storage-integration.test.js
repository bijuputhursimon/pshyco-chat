/**
 * Integration Tests for Storage Module
 * Tests that psychology-bot-swarm.html correctly uses the StorageModule
 */

TestFramework.describe('Integration: Storage Module in Main App', (it) => {
    
    // Test 1: Module is loaded
    it('psychologyBot namespace should be defined', () => {
        TestFramework.assert(
            typeof psychologyBot !== 'undefined',
            'psychologyBot namespace should be defined'
        );
    });
    
    it('StorageModule should be loaded', () => {
        TestFramework.assert(
            typeof psychologyBot.StorageModule !== 'undefined',
            'StorageModule should be loaded'
        );
    });
    
    // Test 2: All public methods exist
    it('getPersonas() method should exist', () => {
        TestFramework.assert(
            typeof psychologyBot.StorageModule.getPersonas === 'function',
            'getPersonas() method should exist'
        );
    });
    
    it('savePersonas() method should exist', () => {
        TestFramework.assert(
            typeof psychologyBot.StorageModule.savePersonas === 'function',
            'savePersonas() method should exist'
        );
    });
    
    it('getGroups() method should exist', () => {
        TestFramework.assert(
            typeof psychologyBot.StorageModule.getGroups === 'function',
            'getGroups() method should exist'
        );
    });
    
    it('saveGroups() method should exist', () => {
        TestFramework.assert(
            typeof psychologyBot.StorageModule.saveGroups === 'function',
            'saveGroups() method should exist'
        );
    });
    
    it('getApiKey() method should exist', () => {
        TestFramework.assert(
            typeof psychologyBot.StorageModule.getApiKey === 'function',
            'getApiKey() method should exist'
        );
    });
    
    it('saveApiKey() method should exist', () => {
        TestFramework.assert(
            typeof psychologyBot.StorageModule.saveApiKey === 'function',
            'saveApiKey() method should exist'
        );
    });
    
    it('getTraitDefinitions() method should exist', () => {
        TestFramework.assert(
            typeof psychologyBot.StorageModule.getTraitDefinitions === 'function',
            'getTraitDefinitions() method should exist'
        );
    });
    
    it('saveTraitDefinitions() method should exist', () => {
        TestFramework.assert(
            typeof psychologyBot.StorageModule.saveTraitDefinitions === 'function',
            'saveTraitDefinitions() method should exist'
        );
    });
    
    // Test 3: Methods return expected types
    it('getPersonas() should return an array', () => {
        const personas = psychologyBot.StorageModule.getPersonas();
        TestFramework.assert(
            Array.isArray(personas),
            'getPersonas() should return an array'
        );
    });
    
    it('getGroups() should return an array', () => {
        const groups = psychologyBot.StorageModule.getGroups();
        TestFramework.assert(
            Array.isArray(groups),
            'getGroups() should return an array'
        );
    });
    
    it('getApiKey() should return a string', () => {
        const apiKey = psychologyBot.StorageModule.getApiKey();
        TestFramework.assert(
            typeof apiKey === 'string',
            'getApiKey() should return a string'
        );
    });
    
    it('getTraitDefinitions() should return an array', () => {
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        TestFramework.assert(
            Array.isArray(traits),
            'getTraitDefinitions() should return an array'
        );
    });
    
    // Test 4: Default trait definitions exist
    it('Default trait definitions should exist', () => {
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        TestFramework.assert(
            traits.length > 0,
            'Default trait definitions should exist'
        );
    });
    
    it('Default traits should include optimism', () => {
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        TestFramework.assert(
            traits.some(t => t.id === 'optimism'),
            'Default traits should include optimism'
        );
    });
    
    it('Default traits should include empathy', () => {
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        TestFramework.assert(
            traits.some(t => t.id === 'empathy'),
            'Default traits should include empathy'
        );
    });
    
    // Test 5: API key encryption/decryption works
    it('API key should be correctly encrypted and decrypted', () => {
        const testApiKey = 'test-api-key-12345';
        psychologyBot.StorageModule.saveApiKey(testApiKey);
        const retrievedKey = psychologyBot.StorageModule.getApiKey();
        TestFramework.assert(
            retrievedKey === testApiKey,
            'API key should be correctly encrypted and decrypted'
        );
    });
    
    // Test 6: Persona CRUD operations work
    it('Persona should be saved and retrieved', () => {
        const testPersona = {
            id: 'test_persona_' + Date.now(),
            name: 'Test Persona',
            avatar: '🤖',
            systemPrompt: 'You are a test persona',
            tags: ['test'],
            traitValues: { optimism: 75 },
            createdAt: new Date().toISOString()
        };
        
        let personasList = psychologyBot.StorageModule.getPersonas();
        personasList.push(testPersona);
        psychologyBot.StorageModule.savePersonas(personasList);
        
        const retrievedPersonas = psychologyBot.StorageModule.getPersonas();
        TestFramework.assert(
            retrievedPersonas.some(p => p.id === testPersona.id),
            'Persona should be saved and retrieved'
        );
        
        // Cleanup
        personasList = retrievedPersonas.filter(p => p.id !== testPersona.id);
        psychologyBot.StorageModule.savePersonas(personasList);
    });
    
    // Test 7: Group CRUD operations work
    it('Group should be saved and retrieved', () => {
        const testGroup = {
            id: 'test_group_' + Date.now(),
            name: 'Test Group',
            personaIds: [],
            createdAt: new Date().toISOString(),
            lastMessage: null,
            lastMessageTime: null
        };
        
        let groupsList = psychologyBot.StorageModule.getGroups();
        groupsList.push(testGroup);
        psychologyBot.StorageModule.saveGroups(groupsList);
        
        const retrievedGroups = psychologyBot.StorageModule.getGroups();
        TestFramework.assert(
            retrievedGroups.some(g => g.id === testGroup.id),
            'Group should be saved and retrieved'
        );
        
        // Cleanup
        groupsList = retrievedGroups.filter(g => g.id !== testGroup.id);
        psychologyBot.StorageModule.saveGroups(groupsList);
    });
    
    // Test 8: Trait definitions can be modified
    it('New trait should be saved and retrieved', () => {
        const newTrait = {
            id: 'test_trait_' + Date.now(),
            label: 'Test Trait',
            enabled: true
        };
        
        let traitsList = psychologyBot.StorageModule.getTraitDefinitions();
        traitsList.push(newTrait);
        psychologyBot.StorageModule.saveTraitDefinitions(traitsList);
        
        const retrievedTraits = psychologyBot.StorageModule.getTraitDefinitions();
        TestFramework.assert(
            retrievedTraits.some(t => t.id === newTrait.id),
            'New trait should be saved and retrieved'
        );
        
        // Cleanup
        traitsList = retrievedTraits.filter(t => t.id !== newTrait.id);
        psychologyBot.StorageModule.saveTraitDefinitions(traitsList);
    });
    
    // Test 9: Group messages storage works
    it('Group messages should be saved and retrieved', () => {
        const testMessages = [
            { role: 'user', text: 'Hello', timestamp: new Date().toISOString() },
            { role: 'model', text: 'Hi there!', senderPersonaId: 'persona_1', timestamp: new Date().toISOString() }
        ];
        
        const testGroupId = 'test_group_messages_' + Date.now();
        psychologyBot.StorageModule.saveGroupMessages(testGroupId, testMessages);
        
        const retrievedMessages = psychologyBot.StorageModule.getGroupMessages(testGroupId);
        TestFramework.assert(
            retrievedMessages.length === 2,
            'Group messages should be saved and retrieved'
        );
        
        // Cleanup
        localStorage.removeItem(`psychology_group_${testGroupId}`);
    });
    
    // Test 10: Persona history storage works
    it('Persona history should be saved and retrieved', () => {
        const testHistory = [
            { role: 'user', parts: [{ text: 'Hello' }] },
            { role: 'model', parts: [{ text: 'Hi!' }] }
        ];
        
        const testPersonaId = 'test_persona_history_' + Date.now();
        const testGroupId2 = 'test_group_history_' + Date.now();
        psychologyBot.StorageModule.savePersonaHistory(testGroupId2, testPersonaId, testHistory);
        
        const retrievedHistory = psychologyBot.StorageModule.getPersonaHistory(testGroupId2, testPersonaId);
        TestFramework.assert(
            retrievedHistory.length === 2,
            'Persona history should be saved and retrieved'
        );
        
        // Cleanup
        localStorage.removeItem(`psychology_history_${testGroupId2}_${testPersonaId}`);
    });
});
