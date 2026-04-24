/**
 * TraitManager Module
 * Handles trait value management and validation
 * 
 * Dependencies: StorageModule, PersonaManager
 * Pattern: IIFE with Namespace
 */

window.psychologyBot = window.psychologyBot || {};

window.psychologyBot.TraitManager = (function() {
    // Private variables
    const DEFAULT_VALUE = 50;
    const MIN_VALUE = 0;
    const MAX_VALUE = 100;
    
    /**
     * Get trait definition by ID
     * @param {string} traitId - Trait ID
     * @returns {Object|null} Trait definition
     */
    function getTraitDefinition(traitId) {
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        const trait = traits.find(t => t.id === traitId) || null;
        
        // Normalize trait object to include name field
        if (trait) {
            return {
                id: trait.id,
                name: trait.label || trait.name || trait.id,
                description: trait.description || '',
                min: trait.min !== undefined ? trait.min : MIN_VALUE,
                max: trait.max !== undefined ? trait.max : MAX_VALUE,
                default: trait.default !== undefined ? trait.default : DEFAULT_VALUE,
                enabled: trait.enabled !== undefined ? trait.enabled : true
            };
        }
        
        return null;
    }
    
    /**
     * Validate trait ID
     * @param {string} traitId - Trait ID
     * @returns {boolean} Is valid
     */
    function isValidTraitId(traitId) {
        return getTraitDefinition(traitId) !== null;
    }
    
    /**
     * Validate trait value
     * @param {number} value - Trait value
     * @param {string} traitId - Trait ID (optional, for specific validation)
     * @returns {Object} Validation result
     */
    function validateTraitValue(value, traitId = null) {
        const errors = [];
        
        if (typeof value !== 'number' || isNaN(value)) {
            errors.push('Value must be a number');
            return { valid: false, errors };
        }
        
        const traitDef = traitId ? getTraitDefinition(traitId) : null;
        const min = traitDef ? traitDef.min : MIN_VALUE;
        const max = traitDef ? traitDef.max : MAX_VALUE;
        
        if (value < min) {
            errors.push(`Value must be at least ${min}`);
        }
        
        if (value > max) {
            errors.push(`Value must be at most ${max}`);
        }
        
        return {
            valid: errors.length === 0,
            errors,
            min,
            max
        };
    }
    
    /**
     * Set trait value for a persona
     * @param {string} personaId - Persona ID
     * @param {string} traitId - Trait ID
     * @param {number} value - Trait value
     * @returns {Object} Updated persona
     */
    function setTraitValue(personaId, traitId, value) {
        // Validate persona
        const persona = psychologyBot.PersonaManager.getPersonaById(personaId);
        if (!persona) {
            throw new Error(`Persona not found: ${personaId}`);
        }
        
        // Validate trait ID
        if (!isValidTraitId(traitId)) {
            throw new Error(`Invalid trait ID: ${traitId}`);
        }
        
        // Validate value
        const validation = validateTraitValue(value, traitId);
        if (!validation.valid) {
            throw new Error(`Invalid trait value: ${validation.errors.join(', ')}`);
        }
        
        // Update persona
        return psychologyBot.PersonaManager.updatePersona(personaId, {
            traitValues: {
                ...persona.traitValues,
                [traitId]: value
            }
        });
    }
    
    /**
     * Get trait value for a persona
     * @param {string} personaId - Persona ID
     * @param {string} traitId - Trait ID
     * @returns {number} Trait value (or default)
     */
    function getTraitValue(personaId, traitId) {
        const persona = psychologyBot.PersonaManager.getPersonaById(personaId);
        
        if (!persona) {
            throw new Error(`Persona not found: ${personaId}`);
        }
        
        if (!isValidTraitId(traitId)) {
            throw new Error(`Invalid trait ID: ${traitId}`);
        }
        
        const traitDef = getTraitDefinition(traitId);
        const defaultValue = traitDef ? traitDef.default : DEFAULT_VALUE;
        
        return persona.traitValues?.[traitId] !== undefined 
            ? persona.traitValues[traitId] 
            : defaultValue;
    }
    
    /**
     * Get all trait values for a persona
     * @param {string} personaId - Persona ID
     * @returns {Object} Trait values object
     */
    function getAllTraitValues(personaId) {
        const persona = psychologyBot.PersonaManager.getPersonaById(personaId);
        
        if (!persona) {
            throw new Error(`Persona not found: ${personaId}`);
        }
        
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        const values = {};
        
        traits.forEach(trait => {
            values[trait.id] = persona.traitValues?.[trait.id] !== undefined
                ? persona.traitValues[trait.id]
                : trait.default;
        });
        
        return values;
    }
    
    /**
     * Reset trait value to default
     * @param {string} personaId - Persona ID
     * @param {string} traitId - Trait ID
     * @returns {Object} Updated persona
     */
    function resetTraitValue(personaId, traitId) {
        const traitDef = getTraitDefinition(traitId);
        
        if (!traitDef) {
            throw new Error(`Invalid trait ID: ${traitId}`);
        }
        
        return setTraitValue(personaId, traitId, traitDef.default);
    }
    
    /**
     * Reset all trait values to defaults
     * @param {string} personaId - Persona ID
     * @returns {Object} Updated persona
     */
    function resetAllTraitValues(personaId) {
        const persona = psychologyBot.PersonaManager.getPersonaById(personaId);
        
        if (!persona) {
            throw new Error(`Persona not found: ${personaId}`);
        }
        
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        const defaultValues = {};
        
        traits.forEach(trait => {
            defaultValues[trait.id] = trait.default;
        });
        
        return psychologyBot.PersonaManager.updatePersona(personaId, {
            traitValues: defaultValues
        });
    }
    
    /**
     * Add custom trait definition
     * @param {Object} trait - Trait definition
     * @returns {Object} Added trait
     */
    function addTraitDefinition(trait) {
        const requiredFields = ['id', 'name', 'description'];
        const errors = [];
        
        requiredFields.forEach(field => {
            if (!trait[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        });
        
        if (errors.length > 0) {
            throw new Error(`Invalid trait definition: ${errors.join(', ')}`);
        }
        
        // Validate numeric fields
        if (typeof trait.min !== 'number' || typeof trait.max !== 'number') {
            throw new Error('Trait must have numeric min and max values');
        }
        
        if (trait.min >= trait.max) {
            throw new Error('Trait min must be less than max');
        }
        
        if (trait.default < trait.min || trait.default > trait.max) {
            throw new Error('Trait default must be within min/max range');
        }
        
        // Add default values if not provided
        const newTrait = {
            id: trait.id,
            name: trait.name,
            description: trait.description,
            min: trait.min,
            max: trait.max,
            default: trait.default !== undefined ? trait.default : Math.floor((trait.min + trait.max) / 2),
            createdAt: new Date().toISOString()
        };
        
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        traits.push(newTrait);
        psychologyBot.StorageModule.saveTraitDefinitions(traits);
        
        return newTrait;
    }
    
    /**
     * Update trait definition
     * @param {string} traitId - Trait ID
     * @param {Object} updates - Updates to apply
     * @returns {Object} Updated trait
     */
    function updateTraitDefinition(traitId, updates) {
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        const index = traits.findIndex(t => t.id === traitId);
        
        if (index === -1) {
            throw new Error(`Trait not found: ${traitId}`);
        }
        
        // Don't allow changing ID
        if (updates.id && updates.id !== traitId) {
            throw new Error('Cannot change trait ID');
        }
        
        const updatedTrait = {
            ...traits[index],
            ...updates,
            id: traitId // Ensure ID stays the same
        };
        
        // Validate if min/max/default changed
        if (updates.min !== undefined || updates.max !== undefined || updates.default !== undefined) {
            if (updatedTrait.default < updatedTrait.min || updatedTrait.default > updatedTrait.max) {
                throw new Error('Trait default must be within min/max range');
            }
        }
        
        traits[index] = updatedTrait;
        psychologyBot.StorageModule.saveTraitDefinitions(traits);
        
        return updatedTrait;
    }
    
    /**
     * Delete trait definition
     * @param {string} traitId - Trait ID
     * @returns {boolean} Success
     */
    function deleteTraitDefinition(traitId) {
        const traits = psychologyBot.StorageModule.getTraitDefinitions();
        const index = traits.findIndex(t => t.id === traitId);
        
        if (index === -1) {
            return false;
        }
        
        traits.splice(index, 1);
        psychologyBot.StorageModule.saveTraitDefinitions(traits);
        
        return true;
    }
    
    /**
     * Get trait value distribution across all personas
     * @param {string} traitId - Trait ID
     * @returns {Object} Distribution statistics
     */
    function getTraitDistribution(traitId) {
        if (!isValidTraitId(traitId)) {
            throw new Error(`Invalid trait ID: ${traitId}`);
        }
        
        const personas = psychologyBot.PersonaManager.getAllPersonas();
        const values = personas.map(p => getTraitValue(p.id, traitId));
        
        if (values.length === 0) {
            return {
                count: 0,
                min: null,
                max: null,
                avg: null,
                values: []
            };
        }
        
        return {
            count: values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
            values
        };
    }
    
    // Public API
    return {
        getTraitDefinition,
        isValidTraitId,
        validateTraitValue,
        setTraitValue,
        getTraitValue,
        getAllTraitValues,
        resetTraitValue,
        resetAllTraitValues,
        addTraitDefinition,
        updateTraitDefinition,
        deleteTraitDefinition,
        getTraitDistribution,
        DEFAULT_VALUE,
        MIN_VALUE,
        MAX_VALUE
    };
})();