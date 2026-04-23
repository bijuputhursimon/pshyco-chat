/**
 * Mock Storage Module - For testing other modules without localStorage
 * Usage: Replace window.psychologyBot.StorageModule with MockStorageModule
 */

window.psychologyBot = window.psychologyBot || {};

window.psychologyBot.MockStorageModule = (function() {
    // In-memory storage
    let data = {
        personas: [],
        groups: [],
        apiKey: '',
        traitDefinitions: [
            { id: 'optimism', label: 'Optimism', enabled: true },
            { id: 'directness', label: 'Directness', enabled: true },
            { id: 'empathy', label: 'Empathy', enabled: true }
        ],
        groupMessages: {},
        personaHistory: {}
    };
    
    return {
        // Reset to clean state (useful for tests)
        reset() {
            data = {
                personas: [],
                groups: [],
                apiKey: '',
                traitDefinitions: [
                    { id: 'optimism', label: 'Optimism', enabled: true },
                    { id: 'directness', label: 'Directness', enabled: true },
                    { id: 'empathy', label: 'Empathy', enabled: true }
                ],
                groupMessages: {},
                personaHistory: {}
            };
        },
        
        getPersonas() {
            return data.personas;
        },
        
        savePersonas(personas) {
            if (!Array.isArray(personas)) throw new Error('Personas must be an array');
            data.personas = personas;
            return true;
        },
        
        getGroups() {
            return data.groups;
        },
        
        saveGroups(groups) {
            if (!Array.isArray(groups)) throw new Error('Groups must be an array');
            data.groups = groups;
            return true;
        },
        
        getGroupMessages(groupId) {
            return data.groupMessages[groupId] || [];
        },
        
        saveGroupMessages(groupId, messages) {
            if (!groupId) throw new Error('groupId is required');
            if (!Array.isArray(messages)) throw new Error('Messages must be an array');
            data.groupMessages[groupId] = messages;
            return true;
        },
        
        getApiKey() {
            return data.apiKey;
        },
        
        saveApiKey(key) {
            data.apiKey = key;
            return true;
        },
        
        getPersonaHistory(groupId, personaId) {
            const key = `${groupId}_${personaId}`;
            return data.personaHistory[key] || [];
        },
        
        savePersonaHistory(groupId, personaId, history) {
            const key = `${groupId}_${personaId}`;
            data.personaHistory[key] = history;
            return true;
        },
        
        getTraitDefinitions() {
            return data.traitDefinitions;
        },
        
        saveTraitDefinitions(traits) {
            if (!Array.isArray(traits)) throw new Error('Traits must be an array');
            data.traitDefinitions = traits;
            return true;
        },
        
        clearAllData() {
            this.reset();
            return true;
        },
        
        exportAllData() {
            return {
                version: 1,
                timestamp: new Date().toISOString(),
                data: {
                    personas: data.personas,
                    groups: data.groups,
                    traits: data.traitDefinitions
                }
            };
        },
        
        importData(exportedData) {
            if (!exportedData.data) throw new Error('Invalid export format');
            if (exportedData.data.personas) data.personas = exportedData.data.personas;
            if (exportedData.data.groups) data.groups = exportedData.data.groups;
            if (exportedData.data.traits) data.traitDefinitions = exportedData.data.traits;
            return true;
        }
    };
})();
