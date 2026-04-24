/**
 * GroupManager Module
 * Handles group CRUD operations and group-persona relationships
 * 
 * Dependencies: StorageModule
 * Pattern: IIFE with Namespace
 */

window.psychologyBot = window.psychologyBot || {};

window.psychologyBot.GroupManager = (function() {
    // Private variables
    const REQUIRED_CREATE_FIELDS = ['name', 'personaIds'];
    const REQUIRED_UPDATE_FIELDS = ['id', 'name', 'personaIds'];
    const MIN_NAME_LENGTH = 2;
    const MAX_NAME_LENGTH = 50;
    const MIN_PERSONAS = 1;
    
    /**
     * Generate unique group ID
     * @returns {string} Unique ID
     */
    function generateId() {
        return 'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Validate group data for creation
     * @param {Object} groupData - Group data without id
     * @returns {Object} Validation result { valid: boolean, errors: string[] }
     */
    function validateGroupCreate(groupData) {
        const errors = [];
        const requiredFields = REQUIRED_CREATE_FIELDS;
        
        // Check required fields
        requiredFields.forEach(field => {
            if (!groupData[field]) {
                errors.push(`${field} is required`);
            }
        });
        
        // Validate name
        if (groupData.name) {
            if (groupData.name.length < MIN_NAME_LENGTH) {
                errors.push(`Name must be at least ${MIN_NAME_LENGTH} characters`);
            }
            if (groupData.name.length > MAX_NAME_LENGTH) {
                errors.push(`Name must be at most ${MAX_NAME_LENGTH} characters`);
            }
        }
        
        // Validate personaIds
        if (groupData.personaIds) {
            if (!Array.isArray(groupData.personaIds)) {
                errors.push('personaIds must be an array');
            } else if (groupData.personaIds.length < MIN_PERSONAS) {
                errors.push(`Group must have at least ${MIN_PERSONAS} persona`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Validate group data for update
     * @param {Object} group - Group object with id
     * @returns {Object} Validation result { valid: boolean, errors: string[] }
     */
    function validateGroupUpdate(group) {
        const errors = [];
        const requiredFields = REQUIRED_UPDATE_FIELDS;
        
        // Check required fields
        requiredFields.forEach(field => {
            if (!group[field]) {
                errors.push(`${field} is required`);
            }
        });
        
        // Validate name
        if (group.name) {
            if (group.name.length < MIN_NAME_LENGTH) {
                errors.push(`Name must be at least ${MIN_NAME_LENGTH} characters`);
            }
            if (group.name.length > MAX_NAME_LENGTH) {
                errors.push(`Name must be at most ${MAX_NAME_LENGTH} characters`);
            }
        }
        
        // Validate personaIds
        if (group.personaIds) {
            if (!Array.isArray(group.personaIds)) {
                errors.push('personaIds must be an array');
            } else if (group.personaIds.length < MIN_PERSONAS) {
                errors.push(`Group must have at least ${MIN_PERSONAS} persona`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    /**
     * Create a new group
     * @param {Object} groupData - Group data without id
     * @returns {Object} Created group with id and timestamp
     */
    function createGroup(groupData) {
        // Validate input data first (before applying defaults)
        const validation = validateGroupCreate(groupData);
        if (!validation.valid) {
            throw new Error('Group validation failed: ' + validation.errors.join(', '));
        }
        
        const group = {
            id: generateId(),
            name: groupData.name,
            personaIds: groupData.personaIds || [],
            createdAt: new Date().toISOString(),
            lastMessage: null,
            lastMessageTime: null
        };
        
        // Verify all personas exist
        const allPersonas = psychologyBot.StorageModule.getPersonas();
        const personaIds = allPersonas.map(p => p.id);
        const invalidPersonas = group.personaIds.filter(pid => !personaIds.includes(pid));
        
        if (invalidPersonas.length > 0) {
            throw new Error('Invalid persona IDs: ' + invalidPersonas.join(', '));
        }
        
        // Save to storage
        const groups = psychologyBot.StorageModule.getGroups();
        groups.push(group);
        psychologyBot.StorageModule.saveGroups(groups);
        
        return group;
    }
    
    /**
     * Update an existing group
     * @param {string} groupId - Group ID
     * @param {Object} updates - Fields to update
     * @returns {Object} Updated group
     */
    function updateGroup(groupId, updates) {
        const groups = psychologyBot.StorageModule.getGroups();
        const index = groups.findIndex(g => g.id === groupId);
        
        if (index === -1) {
            throw new Error(`Group not found: ${groupId}`);
        }
        
        // Create updated group (preserve createdAt)
        const updatedGroup = {
            ...groups[index],
            ...updates,
            createdAt: groups[index].createdAt // Don't overwrite creation date
        };
        
        const validation = validateGroupUpdate(updatedGroup);
        if (!validation.valid) {
            throw new Error('Group validation failed: ' + validation.errors.join(', '));
        }
        
        // Verify all personas exist if personaIds is being updated
        if (updates.personaIds) {
            const allPersonas = psychologyBot.StorageModule.getPersonas();
            const personaIds = allPersonas.map(p => p.id);
            const invalidPersonas = updates.personaIds.filter(pid => !personaIds.includes(pid));
            
            if (invalidPersonas.length > 0) {
                throw new Error('Invalid persona IDs: ' + invalidPersonas.join(', '));
            }
        }
        
        groups[index] = updatedGroup;
        psychologyBot.StorageModule.saveGroups(groups);
        
        return updatedGroup;
    }
    
    /**
     * Delete a group
     * @param {string} groupId - Group ID
     * @returns {boolean} True if deleted
     */
    function deleteGroup(groupId) {
        let groups = psychologyBot.StorageModule.getGroups();
        const index = groups.findIndex(g => g.id === groupId);
        
        if (index === -1) {
            return false;
        }
        
        groups = groups.filter(g => g.id !== groupId);
        psychologyBot.StorageModule.saveGroups(groups);
        
        // Also remove group messages
        localStorage.removeItem(`psychology_group_${groupId}`);
        
        // Remove persona history for this group
        const groupPersonas = groups[index]?.personaIds || [];
        groupPersonas.forEach(personaId => {
            localStorage.removeItem(`psychology_history_${groupId}_${personaId}`);
        });
        
        return true;
    }
    
    /**
     * Get group by ID
     * @param {string} groupId - Group ID
     * @returns {Object|null} Group or null
     */
    function getGroupById(groupId) {
        const groups = psychologyBot.StorageModule.getGroups();
        return groups.find(g => g.id === groupId) || null;
    }
    
    /**
     * Get all groups
     * @returns {Array} Array of groups
     */
    function getAllGroups() {
        return psychologyBot.StorageModule.getGroups();
    }
    
    /**
     * Add persona to group
     * @param {string} groupId - Group ID
     * @param {string} personaId - Persona ID
     * @returns {Object} Updated group
     */
    function addPersonaToGroup(groupId, personaId) {
        const group = getGroupById(groupId);
        if (!group) {
            throw new Error(`Group not found: ${groupId}`);
        }
        
        // Verify persona exists
        const persona = psychologyBot.PersonaManager.getPersonaById(personaId);
        if (!persona) {
            throw new Error(`Persona not found: ${personaId}`);
        }
        
        // Check if already in group
        if (group.personaIds.includes(personaId)) {
            return group; // Already added
        }
        
        const updatedPersonaIds = [...group.personaIds, personaId];
        return updateGroup(groupId, { personaIds: updatedPersonaIds });
    }
    
    /**
     * Remove persona from group
     * @param {string} groupId - Group ID
     * @param {string} personaId - Persona ID
     * @returns {Object} Updated group
     */
    function removePersonaFromGroup(groupId, personaId) {
        const group = getGroupById(groupId);
        if (!group) {
            throw new Error(`Group not found: ${groupId}`);
        }
        
        const updatedPersonaIds = group.personaIds.filter(pid => pid !== personaId);
        
        if (updatedPersonaIds.length === group.personaIds.length) {
            return group; // Not in group
        }
        
        return updateGroup(groupId, { personaIds: updatedPersonaIds });
    }
    
    /**
     * Get personas in a group
     * @param {string} groupId - Group ID
     * @returns {Array} Array of persona objects
     */
    function getGroupPersonas(groupId) {
        const group = getGroupById(groupId);
        if (!group) {
            return [];
        }
        
        const allPersonas = psychologyBot.StorageModule.getPersonas();
        return allPersonas.filter(p => group.personaIds.includes(p.id));
    }
    
    /**
     * Search groups by name
     * @param {string} query - Search query
     * @returns {Array} Matching groups
     */
    function searchGroups(query) {
        const groups = getAllGroups();
        const lowerQuery = query.toLowerCase();
        
        return groups.filter(g => 
            g.name.toLowerCase().includes(lowerQuery)
        );
    }
    
    /**
     * Get groups containing a specific persona
     * @param {string} personaId - Persona ID
     * @returns {Array} Array of groups
     */
    function getGroupsForPersona(personaId) {
        const groups = getAllGroups();
        return groups.filter(g => g.personaIds.includes(personaId));
    }
    
    // Public API
    return {
        createGroup,
        updateGroup,
        deleteGroup,
        getGroupById,
        getAllGroups,
        addPersonaToGroup,
        removePersonaFromGroup,
        getGroupPersonas,
        searchGroups,
        getGroupsForPersona
    };
})();
