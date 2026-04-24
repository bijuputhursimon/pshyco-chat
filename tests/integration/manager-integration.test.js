/**
 * Integration Tests for PersonaManager and GroupManager in Main App
 * Tests that the modules are correctly integrated with psychology-bot-swarm.html
 */

TestFramework.describe('Integration: PersonaManager in Main App', (it) => {
    
    it('PersonaManager should be accessible', () => {
        TestFramework.assert(
            typeof psychologyBot.PersonaManager !== 'undefined',
            'PersonaManager should be loaded'
        );
    });
    
    it('All PersonaManager methods should exist', () => {
        const methods = [
            'createPersona',
            'updatePersona',
            'deletePersona',
            'getPersonaById',
            'getAllPersonas',
            'searchPersonas',
            'setTraitValue',
            'getTraitValue'
        ];
        
        methods.forEach(method => {
            TestFramework.assert(
                typeof psychologyBot.PersonaManager[method] === 'function',
                `${method} should exist`
            );
        });
    });
    
    it('Should create a persona through the module', () => {
        const testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Integration Test Persona',
            avatar: '🧪',
            systemPrompt: 'You are an integration test persona',
            tags: ['integration', 'test'],
            traitValues: { optimism: 80, empathy: 70 }
        });
        
        TestFramework.assert(
            testPersona.name === 'Integration Test Persona',
            'Persona should be created with correct name'
        );
        
        TestFramework.assert(
            testPersona.avatar === '🧪',
            'Persona should have correct avatar'
        );
        
        TestFramework.assert(
            testPersona.tags.includes('integration'),
            'Persona should have correct tags'
        );
        
        // Cleanup
        psychologyBot.PersonaManager.deletePersona(testPersona.id);
    });
    
    it('Should update a persona through the module', () => {
        // Create test persona
        const testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Update Test',
            systemPrompt: 'Test prompt'
        });
        
        // Update it
        const updated = psychologyBot.PersonaManager.updatePersona(testPersona.id, {
            name: 'Updated Name'
        });
        
        TestFramework.assert(
            updated.name === 'Updated Name',
            'Persona name should be updated'
        );
        
        TestFramework.assert(
            updated.createdAt === testPersona.createdAt,
            'Creation date should be preserved'
        );
        
        // Cleanup
        psychologyBot.PersonaManager.deletePersona(testPersona.id);
    });
    
    it('Should search personas through the module', () => {
        // Create test personas
        const persona1 = psychologyBot.PersonaManager.createPersona({
            name: 'Search Test Alpha',
            systemPrompt: 'You are a test persona for search testing alpha',
            tags: ['alpha', 'search']
        });
        
        const persona2 = psychologyBot.PersonaManager.createPersona({
            name: 'Search Test Beta',
            systemPrompt: 'You are a test persona for search testing beta',
            tags: ['beta', 'search']
        });
        
        // Search by name
        const searchByName = psychologyBot.PersonaManager.searchPersonas('Alpha');
        TestFramework.assert(
            searchByName.length === 1 && searchByName[0].id === persona1.id,
            'Should find persona by name'
        );
        
        // Search by tags
        const searchByTags = psychologyBot.PersonaManager.searchPersonas('beta');
        TestFramework.assert(
            searchByTags.length === 1 && searchByTags[0].id === persona2.id,
            'Should find persona by tags'
        );
        
        // Cleanup
        psychologyBot.PersonaManager.deletePersona(persona1.id);
        psychologyBot.PersonaManager.deletePersona(persona2.id);
    });
    
    it('Should manage trait values through the module', () => {
        const testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Trait Test',
            systemPrompt: 'You are a test persona for trait value testing'
        });
        
        // Set trait value
        psychologyBot.PersonaManager.setTraitValue(testPersona.id, 'optimism', 90);
        
        // Get trait value
        const value = psychologyBot.PersonaManager.getTraitValue(testPersona.id, 'optimism');
        TestFramework.assert(
            value === 90,
            'Trait value should be set correctly'
        );
        
        // Get default value for unset trait
        const defaultValue = psychologyBot.PersonaManager.getTraitValue(testPersona.id, 'empathy');
        TestFramework.assert(
            defaultValue === 50,
            'Should return default value for unset trait'
        );
        
        // Cleanup
        psychologyBot.PersonaManager.deletePersona(testPersona.id);
    });
});

TestFramework.describe('Integration: GroupManager in Main App', (it) => {
    
    it('GroupManager should be accessible', () => {
        TestFramework.assert(
            typeof psychologyBot.GroupManager !== 'undefined',
            'GroupManager should be loaded'
        );
    });
    
    it('All GroupManager methods should exist', () => {
        const methods = [
            'createGroup',
            'updateGroup',
            'deleteGroup',
            'getGroupById',
            'getAllGroups',
            'addPersonaToGroup',
            'removePersonaFromGroup',
            'getGroupPersonas',
            'searchGroups',
            'getGroupsForPersona'
        ];
        
        methods.forEach(method => {
            TestFramework.assert(
                typeof psychologyBot.GroupManager[method] === 'function',
                `${method} should exist`
            );
        });
    });
    
    it('Should create a group through the module', () => {
        // Create test persona first
        const testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Group Test Persona',
            systemPrompt: 'You are a test persona for group integration testing purposes'
        });
        
        // Create group
        const testGroup = psychologyBot.GroupManager.createGroup({
            name: 'Integration Test Group',
            personaIds: [testPersona.id]
        });
        
        TestFramework.assert(
            testGroup.name === 'Integration Test Group',
            'Group should be created with correct name'
        );
        
        TestFramework.assert(
            testGroup.personaIds.includes(testPersona.id),
            'Group should include the persona'
        );
        
        // Cleanup
        psychologyBot.GroupManager.deleteGroup(testGroup.id);
        psychologyBot.PersonaManager.deletePersona(testPersona.id);
    });
    
    it('Should add and remove personas from group', () => {
        // Create test personas
        const persona1 = psychologyBot.PersonaManager.createPersona({
            name: 'Add Remove Test 1',
            systemPrompt: 'You are a test persona for add remove testing'
        });
        
        const persona2 = psychologyBot.PersonaManager.createPersona({
            name: 'Add Remove Test 2',
            systemPrompt: 'You are a test persona for add remove testing'
        });
        
        // Create group with first persona
        const testGroup = psychologyBot.GroupManager.createGroup({
            name: 'Add Remove Test',
            personaIds: [persona1.id]
        });
        
        // Add second persona
        const updatedGroup = psychologyBot.GroupManager.addPersonaToGroup(testGroup.id, persona2.id);
        TestFramework.assert(
            updatedGroup.personaIds.length === 2,
            'Group should have 2 personas after add'
        );
        
        // Remove first persona
        const removedGroup = psychologyBot.GroupManager.removePersonaFromGroup(testGroup.id, persona1.id);
        TestFramework.assert(
            removedGroup.personaIds.length === 1 && removedGroup.personaIds[0] === persona2.id,
            'Group should have 1 persona after remove'
        );
        
        // Cleanup
        psychologyBot.GroupManager.deleteGroup(testGroup.id);
        psychologyBot.PersonaManager.deletePersona(persona1.id);
        psychologyBot.PersonaManager.deletePersona(persona2.id);
    });
    
    it('Should get group personas', () => {
        const persona1 = psychologyBot.PersonaManager.createPersona({
            name: 'Get Personas Test 1',
            systemPrompt: 'You are a test persona for getting personas'
        });
        
        const persona2 = psychologyBot.PersonaManager.createPersona({
            name: 'Get Personas Test 2',
            systemPrompt: 'You are a test persona for getting personas'
        });
        
        const testGroup = psychologyBot.GroupManager.createGroup({
            name: 'Get Personas Test',
            personaIds: [persona1.id, persona2.id]
        });
        
        const groupPersonas = psychologyBot.GroupManager.getGroupPersonas(testGroup.id);
        TestFramework.assert(
            groupPersonas.length === 2,
            'Should return 2 personas'
        );
        
        TestFramework.assert(
            groupPersonas.some(p => p.id === persona1.id) && 
            groupPersonas.some(p => p.id === persona2.id),
            'Should return correct personas'
        );
        
        // Cleanup
        psychologyBot.GroupManager.deleteGroup(testGroup.id);
        psychologyBot.PersonaManager.deletePersona(persona1.id);
        psychologyBot.PersonaManager.deletePersona(persona2.id);
    });
    
    it('Should get groups for persona', () => {
        const testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Groups For Persona Test',
            systemPrompt: 'You are a test persona for groups testing'
        });
        
        const group1 = psychologyBot.GroupManager.createGroup({
            name: 'Group 1',
            personaIds: [testPersona.id]
        });
        
        const group2 = psychologyBot.GroupManager.createGroup({
            name: 'Group 2',
            personaIds: [testPersona.id]
        });
        
        const groups = psychologyBot.GroupManager.getGroupsForPersona(testPersona.id);
        TestFramework.assert(
            groups.length === 2,
            'Should return 2 groups'
        );
        
        // Cleanup
        psychologyBot.GroupManager.deleteGroup(group1.id);
        psychologyBot.GroupManager.deleteGroup(group2.id);
        psychologyBot.PersonaManager.deletePersona(testPersona.id);
    });
    
    it('Should search groups by name', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Search Group Test',
            systemPrompt: 'You are a test persona for search testing'
        });
        
        const group1 = psychologyBot.GroupManager.createGroup({
            name: 'Alpha Group',
            personaIds: [persona.id]
        });
        
        const group2 = psychologyBot.GroupManager.createGroup({
            name: 'Beta Group',
            personaIds: [persona.id]
        });
        
        const searchResults = psychologyBot.GroupManager.searchGroups('Alpha');
        TestFramework.assert(
            searchResults.length === 1 && searchResults[0].id === group1.id,
            'Should find group by name'
        );
        
        // Cleanup
        psychologyBot.GroupManager.deleteGroup(group1.id);
        psychologyBot.GroupManager.deleteGroup(group2.id);
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
});