/**
 * Storage Module - IIFE Pattern
 * Handles all localStorage persistence with encryption for sensitive data
 * 
 * Usage:
 *   psychologyBot.StorageModule.getPersonas()
 *   psychologyBot.StorageModule.savePersonas(personas)
 * 
 * Tests: tests/storage.test.html
 * Mocks: mocks/storage-mock.js
 */

window.psychologyBot = window.psychologyBot || {};

window.psychologyBot.StorageModule = (function() {
    'use strict';
    
    // ===== CONSTANTS =====
    const STORAGE_VERSION = 1;
    const PREFIX = 'psychology_';
    const KEYS = {
        PERSONAS: `${PREFIX}personas`,
        GROUPS: `${PREFIX}groups`,
        API_KEY: `${PREFIX}api_key`,
        TRAIT_DEFINITIONS: `${PREFIX}trait_definitions`,
        GROUP_MSG_PREFIX: `${PREFIX}group_`,
        HISTORY_PREFIX: `${PREFIX}history_`
    };
    
    const DEFAULT_TRAITS = [
        { id: 'optimism', label: 'Optimism', enabled: true },
        { id: 'directness', label: 'Directness', enabled: true },
        { id: 'empathy', label: 'Empathy', enabled: true },
        { id: 'skepticism', label: 'Skepticism', enabled: true },
        { id: 'assertiveness', label: 'Assertiveness', enabled: true },
        { id: 'creativity', label: 'Creativity', enabled: false },
        { id: 'patience', label: 'Patience', enabled: false },
        { id: 'humor', label: 'Humor', enabled: false },
        { id: 'formality', label: 'Formality', enabled: false },
        { id: 'confidence', label: 'Confidence', enabled: false }
    ];
    
    // ===== PRIVATE HELPERS =====
    
    /**
     * Safely parse JSON, return default if invalid
     */
    function safeParse(json, defaultValue = null) {
        try {
            return JSON.parse(json);
        } catch (e) {
            console.warn('JSON parse error:', e);
            return defaultValue;
        }
    }
    
    /**
     * Simple Base64 encryption (NOT cryptographically secure - for obfuscation only)
     * Real app should use proper encryption library
     */
    function encryptData(data) {
        try {
            return btoa(data);
        } catch (e) {
            console.error('Encryption error:', e);
            return data;
        }
    }
    
    /**
     * Simple Base64 decryption
     */
    function decryptData(encrypted) {
        try {
            return atob(encrypted);
        } catch (e) {
            console.warn('Decryption error:', e);
            return '';
        }
    }
    
    /**
     * Get item from localStorage with prefix
     */
    function getItem(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value !== null ? value : defaultValue;
        } catch (e) {
            console.error('localStorage read error:', e);
            return defaultValue;
        }
    }
    
    /**
     * Set item to localStorage with prefix
     */
    function setItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error('localStorage write error:', e);
            return false;
        }
    }
    
    // ===== PUBLIC API =====
    
    return {
        /**
         * Personas: CRUD operations
         */
        getPersonas() {
            const data = getItem(KEYS.PERSONAS, '[]');
            return safeParse(data, []);
        },
        
        savePersonas(personas) {
            if (!Array.isArray(personas)) {
                throw new Error('Personas must be an array');
            }
            const json = JSON.stringify(personas);
            return setItem(KEYS.PERSONAS, json);
        },
        
        /**
         * Groups: CRUD operations
         */
        getGroups() {
            const data = getItem(KEYS.GROUPS, '[]');
            return safeParse(data, []);
        },
        
        saveGroups(groups) {
            if (!Array.isArray(groups)) {
                throw new Error('Groups must be an array');
            }
            const json = JSON.stringify(groups);
            return setItem(KEYS.GROUPS, json);
        },
        
        /**
         * Group Messages: Stored per group
         */
        getGroupMessages(groupId) {
            if (!groupId) throw new Error('groupId is required');
            const key = `${KEYS.GROUP_MSG_PREFIX}${groupId}`;
            const data = getItem(key, '[]');
            return safeParse(data, []);
        },
        
        saveGroupMessages(groupId, messages) {
            if (!groupId) throw new Error('groupId is required');
            if (!Array.isArray(messages)) {
                throw new Error('Messages must be an array');
            }
            const key = `${KEYS.GROUP_MSG_PREFIX}${groupId}`;
            const json = JSON.stringify(messages);
            return setItem(key, json);
        },
        
        /**
         * API Key: Encrypted storage
         */
        getApiKey() {
            const encrypted = getItem(KEYS.API_KEY, '');
            if (!encrypted) return '';
            return decryptData(encrypted);
        },
        
        saveApiKey(key) {
            if (typeof key !== 'string') {
                throw new Error('API key must be a string');
            }
            const encrypted = encryptData(key);
            return setItem(KEYS.API_KEY, encrypted);
        },
        
        /**
         * Persona History: Per-group per-persona conversation history
         */
        getPersonaHistory(groupId, personaId) {
            if (!groupId || !personaId) {
                throw new Error('groupId and personaId are required');
            }
            const key = `${KEYS.HISTORY_PREFIX}${groupId}_${personaId}`;
            const data = getItem(key, '[]');
            return safeParse(data, []);
        },
        
        savePersonaHistory(groupId, personaId, history) {
            if (!groupId || !personaId) {
                throw new Error('groupId and personaId are required');
            }
            if (!Array.isArray(history)) {
                throw new Error('History must be an array');
            }
            const key = `${KEYS.HISTORY_PREFIX}${groupId}_${personaId}`;
            const json = JSON.stringify(history);
            return setItem(key, json);
        },
        
        /**
         * Trait Definitions: Character trait system
         */
        getTraitDefinitions() {
            const data = getItem(KEYS.TRAIT_DEFINITIONS, null);
            if (!data) {
                // Return defaults if not set
                return DEFAULT_TRAITS;
            }
            return safeParse(data, DEFAULT_TRAITS);
        },
        
        saveTraitDefinitions(traits) {
            if (!Array.isArray(traits)) {
                throw new Error('Traits must be an array');
            }
            const json = JSON.stringify(traits);
            return setItem(KEYS.TRAIT_DEFINITIONS, json);
        },
        
        /**
         * Utility: Clear all psychology bot data
         */
        clearAllData() {
            try {
                Object.values(KEYS).forEach(key => {
                    localStorage.removeItem(key);
                });
                // Also clear group message keys
                for (let key in localStorage) {
                    if (key.startsWith(PREFIX)) {
                        localStorage.removeItem(key);
                    }
                }
                return true;
            } catch (e) {
                console.error('Clear data error:', e);
                return false;
            }
        },
        
        /**
         * Utility: Export all data as JSON
         */
        exportAllData() {
            return {
                version: STORAGE_VERSION,
                timestamp: new Date().toISOString(),
                data: {
                    personas: this.getPersonas(),
                    groups: this.getGroups(),
                    traits: this.getTraitDefinitions(),
                    // Note: NOT including API key in export for security
                }
            };
        },
        
        /**
         * Utility: Import data from exported JSON
         */
        importData(exportedData) {
            if (!exportedData.data) {
                throw new Error('Invalid export format');
            }
            if (exportedData.data.personas) {
                this.savePersonas(exportedData.data.personas);
            }
            if (exportedData.data.groups) {
                this.saveGroups(exportedData.data.groups);
            }
            if (exportedData.data.traits) {
                this.saveTraitDefinitions(exportedData.data.traits);
            }
            return true;
        }
    };
})();
