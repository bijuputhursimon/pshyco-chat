/**
 * Unit Tests for PersonaManager Module
 */

TestFramework.describe('PersonaManager - Creation', (it) => {
    
    it('should create a persona with minimal data', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a helpful test persona for unit testing purposes.'
        });
        
        TestFramework.assert(persona.id !== undefined, 'Persona should have an ID');
        TestFramework.assert(persona.name === 'Test Persona', 'Name should match');
        TestFramework.assert(persona.avatar === '🤖', 'Avatar should default to robot');
        TestFramework.assert(persona.tags instanceof Array, 'Tags should be an array');
        TestFramework.assert(persona.createdAt !== undefined, 'Should have creation timestamp');
    });
    
    it('should create a persona with custom avatar', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Custom Avatar',
            systemPrompt: 'You are a helpful test persona.',
            avatar: '🎭'
        });
        
        TestFramework.assert(persona.avatar === '🎭', 'Avatar should be custom');
    });
    
    it('should create a persona with tags', () => {
        const tags = ['therapist', 'empathetic'];
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Tagged Persona',
            systemPrompt: 'You are a helpful test persona.',
            tags: tags
        });
        
        TestFramework.assert(persona.tags.length === 2, 'Should have 2 tags');
        TestFramework.assert(persona.tags.includes('therapist'), 'Should include therapist tag');
    });
    
    it('should create a persona with trait values', () => {
        const traitValues = { optimism: 75, empathy: 90 };
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Trait Persona',
            systemPrompt: 'You are a helpful test persona.',
            traitValues: traitValues
        });
        
        TestFramework.assert(persona.traitValues.optimism === 75, 'Optimism should be 75');
        TestFramework.assert(persona.traitValues.empathy === 90, 'Empathy should be 90');
    });
    
    it('should throw error for missing name', () => {
        try {
            psychologyBot.PersonaManager.createPersona({
                systemPrompt: 'You are a helpful test persona.'
            });
            TestFramework.assert(false, 'Should throw error for missing name');
        } catch (e) {
            TestFramework.assert(e.message.includes('name is required'), 'Error should mention name');
        }
    });
    
    it('should throw error for missing system prompt', () => {
        try {
            psychologyBot.PersonaManager.createPersona({
                name: 'Test'
            });
            TestFramework.assert(false, 'Should throw error for missing system prompt');
        } catch (e) {
            TestFramework.assert(e.message.includes('systemPrompt is required'), 'Error should mention systemPrompt');
        }
    });
    
    it('should throw error for name too short', () => {
        try {
            psychologyBot.PersonaManager.createPersona({
                name: 'A',
                systemPrompt: 'You are a helpful test persona.'
            });
            TestFramework.assert(false, 'Should throw error for name too short');
        } catch (e) {
            TestFramework.assert(e.message.includes('at least 2 characters'), 'Error should mention minimum length');
        }
    });
});

TestFramework.describe('PersonaManager - Retrieval', (it) => {
    
    let testPersona = null;
    
    // Setup: Create a test persona
    it('should setup test persona', () => {
        testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Retrieval Test',
            systemPrompt: 'You are a helpful test persona.'
        });
        TestFramework.assert(testPersona !== null, 'Test persona created');
    });
    
    it('should get persona by ID', () => {
        const retrieved = psychologyBot.PersonaManager.getPersonaById(testPersona.id);
        TestFramework.assert(retrieved !== null, 'Persona should be found');
        TestFramework.assert(retrieved.id === testPersona.id, 'ID should match');
    });
    
    it('should return null for non-existent persona', () => {
        const retrieved = psychologyBot.PersonaManager.getPersonaById('non-existent-id');
        TestFramework.assert(retrieved === null, 'Should return null');
    });
    
    it('should get all personas', () => {
        const all = psychologyBot.PersonaManager.getAllPersonas();
        TestFramework.assert(Array.isArray(all), 'Should return array');
        TestFramework.assert(all.length > 0, 'Should have at least one persona');
    });
    
    it('should search personas by name', () => {
        const results = psychologyBot.PersonaManager.searchPersonas('Retrieval');
        TestFramework.assert(results.length >= 1, 'Should find at least one persona');
        TestFramework.assert(results[0].name.includes('Retrieval'), 'Name should match');
    });
    
    it('should search personas by tags', () => {
        // Create a persona with specific tag
        const taggedPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Tag Search Test',
            systemPrompt: 'You are a helpful test persona.',
            tags: ['searchable']
        });
        
        const results = psychologyBot.PersonaManager.searchPersonas('searchable');
        TestFramework.assert(results.length >= 1, 'Should find persona by tag');
    });
});

TestFramework.describe('PersonaManager - Updates', (it) => {
    
    let testPersona = null;
    
    // Setup
    it('should setup test persona', () => {
        testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Update Test',
            systemPrompt: 'You are a helpful test persona.'
        });
    });
    
    it('should update persona name', () => {
        const updated = psychologyBot.PersonaManager.updatePersona(testPersona.id, {
            name: 'Updated Name'
        });
        
        TestFramework.assert(updated.name === 'Updated Name', 'Name should be updated');
        TestFramework.assert(updated.id === testPersona.id, 'ID should remain same');
    });
    
    it('should preserve creation date on update', () => {
        const updated = psychologyBot.PersonaManager.updatePersona(testPersona.id, {
            name: 'Another Update'
        });
        
        TestFramework.assert(updated.createdAt === testPersona.createdAt, 'Creation date should be preserved');
    });
    
    it('should throw error for updating non-existent persona', () => {
        try {
            psychologyBot.PersonaManager.updatePersona('non-existent', { name: 'Test' });
            TestFramework.assert(false, 'Should throw error');
        } catch (e) {
            TestFramework.assert(e.message.includes('not found'), 'Error should mention not found');
        }
    });
});

TestFramework.describe('PersonaManager - Trait Management', (it) => {
    
    let testPersona = null;
    
    // Setup
    it('should setup test persona', () => {
        testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Trait Test',
            systemPrompt: 'You are a helpful test persona.'
        });
    });
    
    it('should set trait value', () => {
        const updated = psychologyBot.PersonaManager.setTraitValue(testPersona.id, 'optimism', 85);
        TestFramework.assert(updated.traitValues.optimism === 85, 'Trait value should be set');
    });
    
    it('should get trait value', () => {
        const value = psychologyBot.PersonaManager.getTraitValue(testPersona.id, 'optimism');
        TestFramework.assert(value === 85, 'Trait value should be 85');
    });
    
    it('should return default value for unset trait', () => {
        const value = psychologyBot.PersonaManager.getTraitValue(testPersona.id, 'nonexistent');
        TestFramework.assert(value === 50, 'Default trait value should be 50');
    });
    
    it('should throw error for invalid trait value', () => {
        try {
            psychologyBot.PersonaManager.setTraitValue(testPersona.id, 'test', 150);
            TestFramework.assert(false, 'Should throw error for value > 100');
        } catch (e) {
            TestFramework.assert(e.message.includes('0 and 100'), 'Error should mention range');
        }
    });
});

TestFramework.describe('PersonaManager - Deletion', (it) => {
    
    let testPersona = null;
    
    // Setup
    it('should setup test persona', () => {
        testPersona = psychologyBot.PersonaManager.createPersona({
            name: 'Delete Test',
            systemPrompt: 'You are a helpful test persona.'
        });
    });
    
    it('should delete persona', () => {
        const result = psychologyBot.PersonaManager.deletePersona(testPersona.id);
        TestFramework.assert(result === true, 'Should return true');
    });
    
    it('should not find deleted persona', () => {
        const retrieved = psychologyBot.PersonaManager.getPersonaById(testPersona.id);
        TestFramework.assert(retrieved === null, 'Deleted persona should not be found');
    });
    
    it('should return false for deleting non-existent persona', () => {
        const result = psychologyBot.PersonaManager.deletePersona('non-existent');
        TestFramework.assert(result === false, 'Should return false');
    });
});
