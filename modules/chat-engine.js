/**
 * ChatEngine Module
 * Handles message processing, prompt formatting, and conversation management
 * 
 * Dependencies: StorageModule, PersonaManager, GroupManager
 * Pattern: IIFE with Namespace
 */

window.psychologyBot = window.psychologyBot || {};

window.psychologyBot.ChatEngine = (function() {
    // Private variables
    const MAX_HISTORY_LENGTH = 50;
    const DEFAULT_TIMEOUT = 30000;
    
    /**
     * Format system prompt with persona traits
     * @param {Object} persona - Persona object
     * @returns {string} Formatted system prompt
     */
    function formatSystemPrompt(persona) {
        const traits = persona.traitValues || {};
        const traitText = Object.entries(traits)
            .filter(([_, value]) => value !== undefined && value !== 50)
            .map(([id, value]) => `${id}: ${value}%`)
            .join(', ');
        
        let prompt = persona.systemPrompt;
        
        if (traitText) {
            prompt += `\n\nYour personality traits: ${traitText}`;
        }
        
        return prompt;
    }
    
    /**
     * Format conversation history for context
     * @param {Array} messages - Array of message objects
     * @returns {string} Formatted conversation history
     */
    function formatConversationHistory(messages) {
        if (!messages || messages.length === 0) {
            return '';
        }
        
        // Limit to last MAX_HISTORY_LENGTH messages
        const recentMessages = messages.slice(-MAX_HISTORY_LENGTH);
        
        return recentMessages.map(msg => {
            const role = msg.role === 'user' ? 'User' : msg.personaName;
            return `${role}: ${msg.content}`;
        }).join('\n\n');
    }
    
    /**
     * Format group metadata
     * @param {Object} group - Group object
     * @returns {string} Formatted group metadata
     */
    function formatGroupMetadata(group) {
        if (!group) return '';
        
        const personas = psychologyBot.GroupManager.getGroupPersonas(group.id);
        const personaList = personas.map(p => `${p.avatar} ${p.name}`).join(', ');
        
        return `Group: ${group.name}\nParticipants: ${personaList}`;
    }
    
    /**
     * Build complete prompt for LLM
     * @param {Object} persona - Persona object
     * @param {Object} group - Group object
     * @param {Array} messages - Conversation history
     * @param {string} userMessage - Current user message
     * @returns {Object} Prompt components
     */
    function buildPrompt(persona, group, messages, userMessage) {
        const systemInstruction = formatSystemPrompt(persona);
        const conversationHistory = formatConversationHistory(messages);
        const groupMetadata = formatGroupMetadata(group);
        
        // Build the full context for Gemini (system instruction + history as part of user message)
        let userContext = '';
        
        if (groupMetadata) {
            userContext += `${groupMetadata}\n\n`;
        }
        
        if (conversationHistory) {
            userContext += `Conversation history:\n${conversationHistory}\n\n`;
        }
        
        userContext += `User: ${userMessage}`;
        
        return {
            systemInstruction,
            userMessage: userContext,
            fullPrompt: systemInstruction + '\n\n' + userContext, // For backward compatibility
            conversationHistory,
            groupMetadata
        };
    }
    
    /**
     * Process user message and prepare for LLM
     * @param {string} groupId - Group ID
     * @param {string} message - User message
     * @returns {Object} Processed message data
     */
    function processMessage(groupId, message) {
        const group = psychologyBot.GroupManager.getGroupById(groupId);
        
        if (!group) {
            throw new Error(`Group not found: ${groupId}`);
        }
        
        if (!message || message.trim().length === 0) {
            throw new Error('Message cannot be empty');
        }
        
        const personas = psychologyBot.GroupManager.getGroupPersonas(group.id);
        const messages = psychologyBot.StorageModule.getGroupMessages(groupId);
        
        return {
            group,
            personas,
            messages,
            userMessage: message.trim(),
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Save user message to storage
     * @param {string} groupId - Group ID
     * @param {string} message - User message
     * @returns {Object} Saved message
     */
    function saveUserMessage(groupId, message) {
        const userData = processMessage(groupId, message);
        
        const messageObj = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            groupId,
            role: 'user',
            content: userData.userMessage,
            timestamp: userData.timestamp
        };
        
        const messages = psychologyBot.StorageModule.getGroupMessages(groupId);
        messages.push(messageObj);
        psychologyBot.StorageModule.saveGroupMessages(groupId, messages);
        
        // Update group last message
        psychologyBot.GroupManager.updateGroup(groupId, {
            lastMessage: message,
            lastMessageTime: userData.timestamp
        });
        
        return messageObj;
    }
    
    /**
     * Save AI response to storage
     * @param {string} groupId - Group ID
     * @param {string} personaId - Persona ID
     * @param {string} response - AI response
     * @returns {Object} Saved message
     */
    function saveAiResponse(groupId, personaId, response) {
        const persona = psychologyBot.PersonaManager.getPersonaById(personaId);
        
        if (!persona) {
            throw new Error(`Persona not found: ${personaId}`);
        }
        
        const messageObj = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            groupId,
            role: 'ai',
            personaId,
            personaName: persona.name,
            personaAvatar: persona.avatar,
            content: response,
            timestamp: new Date().toISOString()
        };
        
        const messages = psychologyBot.StorageModule.getGroupMessages(groupId);
        messages.push(messageObj);
        psychologyBot.StorageModule.saveGroupMessages(groupId, messages);
        
        return messageObj;
    }
    
    /**
     * Get conversation history for a group
     * @param {string} groupId - Group ID
     * @param {number} limit - Maximum messages to return
     * @returns {Array} Messages
     */
    function getConversationHistory(groupId, limit = MAX_HISTORY_LENGTH) {
        const messages = psychologyBot.StorageModule.getGroupMessages(groupId);
        return messages.slice(-limit);
    }
    
    /**
     * Clear conversation history for a group
     * @param {string} groupId - Group ID
     * @returns {boolean} Success
     */
    function clearConversationHistory(groupId) {
        return psychologyBot.StorageModule.clearGroupMessages(groupId);
    }
    
    /**
     * Validate message content
     * @param {string} message - Message content
     * @returns {Object} Validation result
     */
    function validateMessage(message) {
        const errors = [];
        
        if (!message || typeof message !== 'string') {
            errors.push('Message must be a non-empty string');
        } else if (message.trim().length === 0) {
            errors.push('Message cannot be empty or whitespace');
        } else if (message.length > 10000) {
            errors.push('Message too long (max 10000 characters)');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
    
    // Public API
    return {
        formatSystemPrompt,
        formatConversationHistory,
        formatGroupMetadata,
        buildPrompt,
        processMessage,
        saveUserMessage,
        saveAiResponse,
        getConversationHistory,
        clearConversationHistory,
        validateMessage,
        MAX_HISTORY_LENGTH,
        DEFAULT_TIMEOUT
    };
})();