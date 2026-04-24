/**
 * PersonaManager Module
 * Handles persona CRUD operations, trait management, and validation
 * 
 * Dependencies: StorageModule
 * Pattern: IIFE with Namespace
 */

window.psychologyBot = window.psychologyBot || {};

window.psychologyBot.PersonaManager = (function() {
    // Private variables
    const REQUIRED_FIELDS = ['id', 'name', 'systemPrompt'];
    const MIN_NAME_LENGTH = 2;
    const MAX_NAME_LENGTH = 50;
    const MIN_PROMPT_LENGTH = 10;
    
    /**
     * Generate unique persona ID
     * @returns {string} Unique ID
     */
    function generateId() {
        return 'persona_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Validate persona data
     * @param {Object} persona - Persona object
     * @returns {Object} Validation result { valid: boolean, errors: string[] }
     */
    function validatePersona(persona) {
        const errors = [];
        
        // Check required fields
        REQUIRED_FIELDS.forEach(field => {
            if (!persona[field]) {
                errors.push(`${field} is required`);
            }
        });
        
        // Validate name
        if (persona.name) {
            if (persona.name.length < MIN_NAME_LENGTH) {
                errors.push(`Name must be at least ${MIN_NAME_LENGTH} characters`);
            }
            if (persona.name.length > MAX_NAME_LENGTH) {
                errors.push(`Name must be at most ${MAX_NAME_LENGTH} characters`);
            }
        }
        
        // Validate system prompt
        if (persona.systemPrompt) {
            if (persona.systemPrompt.length < MIN_PROMPT_LENGTH) {
                errors.push(`System prompt must be at least ${MIN_PROMPT_LENGTH} characters`);
            }
        }
        
        // Validate trait values (if present)
        if (persona.traitValues && typeof persona.traitValues !== 'object') {
            errors.push('traitValues must be an object');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Create a new persona
     * @param {Object} personaData - Persona data without id
     * @returns {Object} Created persona with id and timestamp
     */
    function createPersona(personaData) {
        const persona = {
            id: generateId(),
            name: personaData.name,
            avatar: personaData.avatar || '🤖',
            systemPrompt: personaData.systemPrompt,
            tags: personaData.tags || [],
            traitValues: personaData.traitValues || {},
            createdAt: new Date().toISOString()
        };
        
        const validation = validatePersona(persona);
        if (!validation.valid) {
            throw new Error('Persona validation failed: ' + validation.errors.join(', '));
        }
        
        // Save to storage
        const personas = psychologyBot.StorageModule.getPersonas();
        personas.push(persona);
        psychologyBot.StorageModule.savePersonas(personas);
        
        return persona;
    }
    
    /**
     * Update an existing persona
     * @param {string} personaId - Persona ID
     * @param {Object} updates - Fields to update
     * @returns {Object} Updated persona
     */
    function updatePersona(personaId, updates) {
        const personas = psychologyBot.StorageModule.getPersonas();
        const index = personas.findIndex(p => p.id === personaId);
        
        if (index === -1) {
            throw new Error(`Persona not found: ${personaId}`);
        }
        
        // Create updated persona (preserve createdAt)
        const updatedPersona = {
            ...personas[index],
            ...updates,
            createdAt: personas[index].createdAt // Don't overwrite creation date
        };
        
        const validation = validatePersona(updatedPersona);
        if (!validation.valid) {
            throw new Error('Persona validation failed: ' + validation.errors.join(', '));
        }
        
        personas[index] = updatedPersona;
        psychologyBot.StorageModule.savePersonas(personas);
        
        return updatedPersona;
    }
    
    /**
     * Delete a persona
     * @param {string} personaId - Persona ID
     * @returns {boolean} True if deleted
     */
    function deletePersona(personaId) {
        let personas = psychologyBot.StorageModule.getPersonas();
        const index = personas.findIndex(p => p.id === personaId);
        
        if (index === -1) {
            return false;
        }
        
        personas = personas.filter(p => p.id !== personaId);
        psychologyBot.StorageModule.savePersonas(personas);
        
        // Also remove from all groups
        let groups = psychologyBot.StorageModule.getGroups();
        groups = groups.map(g => ({
            ...g,
            personaIds: g.personaIds.filter(pid => pid !== personaId)
        }));
        psychologyBot.StorageModule.saveGroups(groups);
        
        return true;
    }
    
    /**
     * Get persona by ID
     * @param {string} personaId - Persona ID
     * @returns {Object|null} Persona or null
     */
    function getPersonaById(personaId) {
        const personas = psychologyBot.StorageModule.getPersonas();
        return personas.find(p => p.id === personaId) || null;
    }
    
    /**
     * Get all personas
     * @returns {Array} Array of personas
     */
    function getAllPersonas() {
        return psychologyBot.StorageModule.getPersonas();
    }
    
    /**
     * Set trait value for a persona
     * @param {string} personaId - Persona ID
     * @param {string} traitId - Trait ID
     * @param {number} value - Trait value (0-100)
     * @returns {Object} Updated persona
     */
    function setTraitValue(personaId, traitId, value) {
        // Validate value
        if (typeof value !== 'number' || value < 0 || value > 100) {
            throw new Error('Trait value must be a number between 0 and 100');
        }
        
        const personas = psychologyBot.StorageModule.getPersonas();
        const index = personas.findIndex(p => p.id === personaId);
        
        if (index === -1) {
            throw new Error(`Persona not found: ${personaId}`);
        }
        
        // Initialize traitValues if not exists
        if (!personas[index].traitValues) {
            personas[index].traitValues = {};
        }
        
        // Update trait value
        personas[index].traitValues[traitId] = value;
        psychologyBot.StorageModule.savePersonas(personas);
        
        return personas[index];
    }
    
    /**
     * Get trait value for a persona
     * @param {string} personaId - Persona ID
     * @param {string} traitId - Trait ID
     * @returns {number} Trait value (default: 50)
     */
    function getTraitValue(personaId, traitId) {
        const persona = getPersonaById(personaId);
        if (!persona || !persona.traitValues) {
            return 50; // Default value
        }
        return persona.traitValues[traitId] !== undefined ? persona.traitValues[traitId] : 50;
    }
    
    /**
     * Search personas by name or tags
     * @param {string} query - Search query
     * @returns {Array} Matching personas
     */
    function searchPersonas(query) {
        const personas = getAllPersonas();
        const lowerQuery = query.toLowerCase();
        
        return personas.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
    }
    
    // Public API
    return {
        createPersona,
        updatePersona,
        deletePersona,
        getPersonaById,
        getAllPersonas,
        setTraitValue,
        getTraitValue,
        searchPersonas,
        validatePersona
    };
})();
