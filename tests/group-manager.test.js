/**
 * Unit Tests for GroupManager Module
 */

TestFramework.describe('GroupManager - Creation', (it) => {
    
    // Setup: Create test personas
    let persona1 = null;
    let persona2 = null;
    
    it('should setup test personas', () => {
        persona1 = psychologyBot.PersonaManager.createPersona({
            name: 'Group Test Persona 1',
            systemPrompt: 'You are a helpful test persona.'
        });
        persona2 = psychologyBot.PersonaManager.createPersona({
            name: 'Group Test Persona 2',
            systemPrompt: 'You are a helpful test persona.'
        });
        TestFramework.assert(persona1 !== null && persona2 !== null, 'Test personas created');
    });
    
    it('should create a group with minimal data', () => {
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Test Group',
            personaIds: [persona1.id]
        });
        
        TestFramework.assert(group.id !== undefined, 'Group should have an ID');
        TestFramework.assert(group.name === 'Test Group', 'Name should match');
        TestFramework.assert(group.personaIds.length === 1, 'Should have one persona');
        TestFramework.assert(group.createdAt !== undefined, 'Should have creation timestamp');
        TestFramework.assert(group.lastMessage === null, 'Last message should be null');
    });
    
    it('should create a group with multiple personas', () => {
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Multi Persona Group',
            personaIds: [persona1.id, persona2.id]
        });
        
        TestFramework.assert(group.personaIds.length === 2, 'Should have two personas');
    });
    
    it('should throw error for missing name', () => {
        try {
            psychologyBot.GroupManager.createGroup({
                personaIds: [persona1.id]
            });
            TestFramework.assert(false, 'Should throw error for missing name');
        } catch (e) {
            TestFramework.assert(e.message.includes('name is required'), 'Error should mention name');
        }
    });
    
    it('should throw error for missing personaIds', () => {
        try {
            psychologyBot.GroupManager.createGroup({
                name: 'Test'
            });
            TestFramework.assert(false, 'Should throw error for missing personaIds');
        } catch (e) {
            TestFramework.assert(e.message.includes('personaIds is required'), 'Error should mention personaIds');
        }
    });
    
    it('should throw error for empty personaIds', () => {
        try {
            psychologyBot.GroupManager.createGroup({
                name: 'Test',
                personaIds: []
            });
            TestFramework.assert(false, 'Should throw error for empty personaIds');
        } catch (e) {
            TestFramework.assert(e.message.includes('at least 1 persona'), 'Error should mention minimum');
        }
    });
    
    it('should throw error for invalid persona ID', () => {
        try {
            psychologyBot.GroupManager.createGroup({
                name: 'Test',
                personaIds: ['invalid-id']
            });
            TestFramework.assert(false, 'Should throw error for invalid persona');
        } catch (e) {
            TestFramework.assert(e.message.includes('Invalid persona IDs'), 'Error should mention invalid personas');
        }
    });
});

TestFramework.describe('GroupManager - Retrieval', (it) => {
    
    let testGroup = null;
    let persona1 = null;
    
    // Setup
    it('should setup test data', () => {
        persona1 = psychologyBot.PersonaManager.createPersona({
            name: 'Retrieval Persona',
            systemPrompt: 'You are a helpful test persona.'
        });
        testGroup = psychologyBot.GroupManager.createGroup({
            name: 'Retrieval Test Group',
            personaIds: [persona1.id]
        });
    });
    
    it('should get group by ID', () => {
        const retrieved = psychologyBot.GroupManager.getGroupById(testGroup.id);
        TestFramework.assert(retrieved !== null, 'Group should be found');
        TestFramework.assert(retrieved.id === testGroup.id, 'ID should match');
    });
    
    it('should return null for non-existent group', () => {
        const retrieved = psychologyBot.GroupManager.getGroupById('non-existent-id');
        TestFramework.assert(retrieved === null, 'Should return null');
    });
    
    it('should get all groups', () => {
        const all = psychologyBot.GroupManager.getAllGroups();
        TestFramework.assert(Array.isArray(all), 'Should return array');
        TestFramework.assert(all.length > 0, 'Should have at least one group');
    });
    
    it('should search groups by name', () => {
        const results = psychologyBot.GroupManager.searchGroups('Retrieval');
        TestFramework.assert(results.length >= 1, 'Should find at least one group');
        TestFramework.assert(results[0].name.includes('Retrieval'), 'Name should match');
    });
    
    it('should get personas in group', () => {
        const personas = psychologyBot.GroupManager.getGroupPersonas(testGroup.id);
        TestFramework.assert(Array.isArray(personas), 'Should return array');
        TestFramework.assert(personas.length === 1, 'Should have one persona');
        TestFramework.assert(personas[0].id === persona1.id, 'Persona ID should match');
    });
    
    it('should get groups for persona', () => {
        const groups = psychologyBot.GroupManager.getGroupsForPersona(persona1.id);
        TestFramework.assert(Array.isArray(groups), 'Should return array');
        TestFramework.assert(groups.length >= 1, 'Should have at least one group');
    });
});

TestFramework.describe('GroupManager - Updates', (it) => {
    
    let testGroup = null;
    let persona1 = null;
    let persona2 = null;
    
    // Setup
    it('should setup test data', () => {
        persona1 = psychologyBot.PersonaManager.createPersona({
            name: 'Update Persona 1',
            systemPrompt: 'You are a helpful test persona.'
        });
        persona2 = psychologyBot.PersonaManager.createPersona({
            name: 'Update Persona 2',
            systemPrompt: 'You are a helpful test persona.'
        });
        testGroup = psychologyBot.GroupManager.createGroup({
            name: 'Update Test Group',
            personaIds: [persona1.id]
        });
    });
    
    it('should update group name', () => {
        const updated = psychologyBot.GroupManager.updateGroup(testGroup.id, {
            name: 'Updated Group Name'
        });
        
        TestFramework.assert(updated.name === 'Updated Group Name', 'Name should be updated');
        TestFramework.assert(updated.id === testGroup.id, 'ID should remain same');
    });
    
    it('should preserve creation date on update', () => {
        const updated = psychologyBot.GroupManager.updateGroup(testGroup.id, {
            name: 'Another Update'
        });
        
        TestFramework.assert(updated.createdAt === testGroup.createdAt, 'Creation date should be preserved');
    });
    
    it('should add persona to group', () => {
        const updated = psychologyBot.GroupManager.addPersonaToGroup(testGroup.id, persona2.id);
        TestFramework.assert(updated.personaIds.length === 2, 'Should have two personas');
        TestFramework.assert(updated.personaIds.includes(persona2.id), 'Should include new persona');
    });
    
    it('should remove persona from group', () => {
        const updated = psychologyBot.GroupManager.removePersonaFromGroup(testGroup.id, persona2.id);
        TestFramework.assert(updated.personaIds.length === 1, 'Should have one persona');
        TestFramework.assert(!updated.personaIds.includes(persona2.id), 'Should not include removed persona');
    });
    
    it('should throw error for updating non-existent group', () => {
        try {
            psychologyBot.GroupManager.updateGroup('non-existent', { name: 'Test' });
            TestFramework.assert(false, 'Should throw error');
        } catch (e) {
            TestFramework.assert(e.message.includes('not found'), 'Error should mention not found');
        }
    });
});

TestFramework.describe('GroupManager - Deletion', (it) => {
    
    let testGroup = null;
    let testPersona = null;
    
    // Setup
    it('should setup test data', () => {
        testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Delete Test Persona',
            systemPrompt: 'You are a helpful test persona.'
        });
        testGroup = psychologyBot.GroupManager.createGroup({
            name: 'Delete Test Group',
            personaIds: [testPersona.id]
        });
    });
    
    it('should delete group', () => {
        const result = psychologyBot.GroupManager.deleteGroup(testGroup.id);
        TestFramework.assert(result === true, 'Should return true');
    });
    
    it('should not find deleted group', () => {
        const retrieved = psychologyBot.GroupManager.getGroupById(testGroup.id);
        TestFramework.assert(retrieved === null, 'Deleted group should not be found');
    });
    
    it('should return false for deleting non-existent group', () => {
        const result = psychologyBot.GroupManager.deleteGroup('non-existent');
        TestFramework.assert(result === false, 'Should return false');
    });
    
    it('should cleanup group messages on deletion', () => {
        // Create and delete a group
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Cleanup Test',
            systemPrompt: 'You are a helpful test persona.'
        });
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Cleanup Group',
            personaIds: [persona.id]
        });
        
        // Add a message
        psychologyBot.StorageModule.saveGroupMessages(group.id, [{ role: 'user', text: 'Test' }]);
        
        // Delete group
        psychologyBot.GroupManager.deleteGroup(group.id);
        
        // Check if message storage was removed
        const messages = psychologyBot.StorageModule.getGroupMessages(group.id);
        TestFramework.assert(messages.length === 0, 'Group messages should be cleared');
    });
});
