/**
 * TraitManager Module Tests
 */

TestFramework.describe('TraitManager - Trait Definitions', (it) => {
    
    it('should get trait definition', () => {
        const trait = psychologyBot.TraitManager.getTraitDefinition('optimism');
        
        TestFramework.assert(
            trait !== null,
            'Should find optimism trait'
        );
        
        TestFramework.assert(
            trait.name === 'Optimism',
            'Should have correct name'
        );
    });
    
    it('should return null for invalid trait', () => {
        const trait = psychologyBot.TraitManager.getTraitDefinition('non-existent');
        
        TestFramework.assert(
            trait === null,
            'Should return null'
        );
    });
    
    it('should validate trait ID', () => {
        TestFramework.assert(
            psychologyBot.TraitManager.isValidTraitId('optimism') === true,
            'Should be valid'
        );
        
        TestFramework.assert(
            psychologyBot.TraitManager.isValidTraitId('invalid') === false,
            'Should be invalid'
        );
    });
});

TestFramework.describe('TraitManager - Value Validation', (it) => {
    
    it('should validate valid value', () => {
        const result = psychologyBot.TraitManager.validateTraitValue(75, 'optimism');
        
        TestFramework.assert(
            result.valid === true,
            'Should be valid'
        );
        
        TestFramework.assert(
            result.errors.length === 0,
            'Should have no errors'
        );
    });
    
    it('should reject value below min', () => {
        const result = psychologyBot.TraitManager.validateTraitValue(-10, 'optimism');
        
        TestFramework.assert(
            result.valid === false,
            'Should be invalid'
        );
        
        TestFramework.assert(
            result.errors.length > 0,
            'Should have errors'
        );
    });
    
    it('should reject value above max', () => {
        const result = psychologyBot.TraitManager.validateTraitValue(150, 'optimism');
        
        TestFramework.assert(
            result.valid === false,
            'Should be invalid'
        );
    });
    
    it('should reject non-numeric value', () => {
        const result = psychologyBot.TraitManager.validateTraitValue('not a number');
        
        TestFramework.assert(
            result.valid === false,
            'Should be invalid'
        );
    });
});

TestFramework.describe('TraitManager - Set and Get Values', (it) => {
    
    it('should set trait value', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a test persona for trait setting'
        });
        
        const updated = psychologyBot.TraitManager.setTraitValue(persona.id, 'optimism', 85);
        
        TestFramework.assert(
            updated.traitValues.optimism === 85,
            'Should set value'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should get trait value', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a test persona for trait getting',
            traitValues: { empathy: 70 }
        });
        
        const value = psychologyBot.TraitManager.getTraitValue(persona.id, 'empathy');
        
        TestFramework.assert(
            value === 70,
            'Should return set value'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should return default value for unset trait', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a test persona for default values'
        });
        
        const value = psychologyBot.TraitManager.getTraitValue(persona.id, 'optimism');
        
        TestFramework.assert(
            value === 50,
            'Should return default value'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should throw error for non-existent persona', () => {
        TestFramework.assertThrows(
            () => psychologyBot.TraitManager.setTraitValue('non-existent', 'optimism', 50),
            'Persona not found'
        );
    });
    
    it('should throw error for invalid trait ID', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a test persona for invalid trait'
        });
        
        TestFramework.assertThrows(
            () => psychologyBot.TraitManager.setTraitValue(persona.id, 'invalid-trait', 50),
            'Invalid trait ID'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should throw error for invalid value', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a test persona for invalid value'
        });
        
        TestFramework.assertThrows(
            () => psychologyBot.TraitManager.setTraitValue(persona.id, 'optimism', 150),
            'Invalid trait value'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
});

TestFramework.describe('TraitManager - Get All Values', (it) => {
    
    it('should get all trait values with defaults', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a test persona for all values',
            traitValues: { optimism: 80 }
        });
        
        const values = psychologyBot.TraitManager.getAllTraitValues(persona.id);
        
        TestFramework.assert(
            values.optimism === 80,
            'Should include set value'
        );
        
        TestFramework.assert(
            values.empathy === 50,
            'Should include default value'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
});

TestFramework.describe('TraitManager - Reset Values', (it) => {
    
    it('should reset single trait value', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a test persona for reset',
            traitValues: { optimism: 90 }
        });
        
        const updated = psychologyBot.TraitManager.resetTraitValue(persona.id, 'optimism');
        
        TestFramework.assert(
            updated.traitValues.optimism === 50,
            'Should reset to default'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should reset all trait values', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a test persona for reset all',
            traitValues: { optimism: 90, empathy: 80 }
        });
        
        const updated = psychologyBot.TraitManager.resetAllTraitValues(persona.id);
        
        TestFramework.assert(
            updated.traitValues.optimism === 50,
            'Should reset optimism'
        );
        
        TestFramework.assert(
            updated.traitValues.empathy === 50,
            'Should reset empathy'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
});

TestFramework.describe('TraitManager - Custom Traits', (it) => {
    
    it('should add custom trait definition', () => {
        const newTrait = psychologyBot.TraitManager.addTraitDefinition({
            id: 'custom_trait',
            name: 'Custom Trait',
            description: 'A custom trait for testing',
            min: 0,
            max: 100,
            default: 50
        });
        
        TestFramework.assert(
            newTrait.id === 'custom_trait',
            'Should have correct ID'
        );
        
        TestFramework.assert(
            newTrait.name === 'Custom Trait',
            'Should have correct name'
        );
        
        // Cleanup
        psychologyBot.TraitManager.deleteTraitDefinition('custom_trait');
    });
    
    it('should validate required fields', () => {
        TestFramework.assertThrows(
            () => psychologyBot.TraitManager.addTraitDefinition({
                id: 'incomplete'
            }),
            'Missing required field'
        );
    });
    
    it('should validate min/max', () => {
        TestFramework.assertThrows(
            () => psychologyBot.TraitManager.addTraitDefinition({
                id: 'invalid_range',
                name: 'Invalid',
                description: 'Test',
                min: 100,
                max: 0,
                default: 50
            }),
            'min must be less than max'
        );
    });
    
    it('should update trait definition', () => {
        // Add trait first
        psychologyBot.TraitManager.addTraitDefinition({
            id: 'updatable_trait',
            name: 'Original Name',
            description: 'Original description',
            min: 0,
            max: 100,
            default: 50
        });
        
        // Update it
        const updated = psychologyBot.TraitManager.updateTraitDefinition('updatable_trait', {
            name: 'Updated Name'
        });
        
        TestFramework.assert(
            updated.name === 'Updated Name',
            'Should update name'
        );
        
        TestFramework.assert(
            updated.id === 'updatable_trait',
            'Should preserve ID'
        );
        
        // Cleanup
        psychologyBot.TraitManager.deleteTraitDefinition('updatable_trait');
    });
    
    it('should delete trait definition', () => {
        // Add trait first
        psychologyBot.TraitManager.addTraitDefinition({
            id: 'deletable_trait',
            name: 'Deletable',
            description: 'Will be deleted',
            min: 0,
            max: 100,
            default: 50
        });
        
        // Delete it
        const deleted = psychologyBot.TraitManager.deleteTraitDefinition('deletable_trait');
        
        TestFramework.assert(
            deleted === true,
            'Should return true'
        );
        
        // Verify it's gone
        const trait = psychologyBot.TraitManager.getTraitDefinition('deletable_trait');
        TestFramework.assert(
            trait === null,
            'Should be deleted'
        );
    });
});

TestFramework.describe('TraitManager - Distribution', (it) => {
    
    it('should get trait distribution', () => {
        // Clear existing personas for clean test
        localStorage.clear();
        
        // Create test personas
        const persona1 = psychologyBot.PersonaManager.createPersona({
            name: 'Test 1',
            systemPrompt: 'You are test persona 1 for distribution',
            traitValues: { optimism: 30 }
        });
        
        const persona2 = psychologyBot.PersonaManager.createPersona({
            name: 'Test 2',
            systemPrompt: 'You are test persona 2 for distribution',
            traitValues: { optimism: 70 }
        });
        
        const persona3 = psychologyBot.PersonaManager.createPersona({
            name: 'Test 3',
            systemPrompt: 'You are test persona 3 for distribution'
        });
        
        const distribution = psychologyBot.TraitManager.getTraitDistribution('optimism');
        
        TestFramework.assert(
            distribution.count === 3,
            'Should count all personas'
        );
        
        TestFramework.assert(
            distribution.min === 30,
            'Should find min'
        );
        
        TestFramework.assert(
            distribution.max === 70,
            'Should find max'
        );
        
        TestFramework.assert(
            distribution.avg === 50,
            'Should calculate average'
        );
        
        // Cleanup
        psychologyBot.PersonaManager.deletePersona(persona1.id);
        psychologyBot.PersonaManager.deletePersona(persona2.id);
        psychologyBot.PersonaManager.deletePersona(persona3.id);
    });
});

TestFramework.describe('TraitManager - Constants', (it) => {
    
    it('should have default constants', () => {
        TestFramework.assert(
            psychologyBot.TraitManager.DEFAULT_VALUE === 50,
            'Should have default value'
        );
        
        TestFramework.assert(
            psychologyBot.TraitManager.MIN_VALUE === 0,
            'Should have min value'
        );
        
        TestFramework.assert(
            psychologyBot.TraitManager.MAX_VALUE === 100,
            'Should have max value'
        );
    });
});