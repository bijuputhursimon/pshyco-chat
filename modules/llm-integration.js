/**
 * LLM Integration Module
 * Handles communication with LLM API endpoints
 * 
 * Dependencies: StorageModule, ChatEngine
 * Pattern: IIFE with Namespace
 */

window.psychologyBot = window.psychologyBot || {};

window.psychologyBot.LLMIntegration = (function() {
    // Private variables
    const DEFAULT_MODEL = 'gemini-flash-latest';
    const DEFAULT_TIMEOUT = 60000;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;
    
    // Google Generative AI instance (initialized on first use)
    let genAIInstance = null;
    
    /**
     * Get API key from storage
     * @returns {string} API key
     */
    function getApiKey() {
        return psychologyBot.StorageModule.getApiKey();
    }
    
    /**
     * Initialize Google Generative AI instance
     * @returns {Object} GoogleGenerativeAI instance
     */
    function getGenAIInstance() {
        if (!genAIInstance) {
            const apiKey = getApiKey();
            if (!apiKey || !window.GoogleGenerativeAI) {
                throw new Error('Google Generative AI SDK not loaded or API key missing');
            }
            genAIInstance = new window.GoogleGenerativeAI(apiKey);
        }
        return genAIInstance;
    }
    
    /**
     * Validate API key
     * @returns {boolean} Is valid
     */
    function validateApiKey() {
        const key = getApiKey();
        return !!(key && key.length > 20 && window.GoogleGenerativeAI);
    }
    
    /**
     * Format request payload for Gemini LLM
     * @param {string} systemPrompt - System instruction/prompt
     * @param {string} userMessage - User message
     * @param {string} model - Model to use
     * @returns {Object} Request configuration
     */
    function formatRequestPayload(systemPrompt, userMessage = '', model = DEFAULT_MODEL) {
        return {
            model: model,
            systemInstruction: systemPrompt,
            userMessage: userMessage,
            temperature: 0.7,
            maxOutputTokens: 2000
        };
    }
    
    /**
     * Send request to Gemini LLM API
     * @param {string} systemPrompt - System instruction/prompt
     * @param {string} userMessage - User message
     * @param {Object} options - Request options
     * @returns {Promise<Object>} API response
     */
    async function sendRequest(systemPrompt, userMessage = '', options = {}) {
        const model = options.model || DEFAULT_MODEL;
        const timeout = options.timeout || DEFAULT_TIMEOUT;
        
        // Validate prerequisites
        if (!window.GoogleGenerativeAI) {
            throw new LLMError('Google Generative AI SDK not loaded. Please ensure the script is included.');
        }
        
        if (!validateApiKey()) {
            throw new LLMError('API key not configured. Please set your API key first.');
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            // Get or create GenAI instance
            const genAI = getGenAIInstance();
            
            // Create model with system instruction
            const modelInstance = genAI.getGenerativeModel({
                model: model,
                systemInstruction: systemPrompt
            });
            
            // Send user message directly (not using chat session)
            const result = await modelInstance.generateContent(userMessage);
            const response = await result.response;
            
            clearTimeout(timeoutId);
            
            // Extract text content from Gemini response
            const text = response.text();
            
            return {
                success: true,
                content: text,
                usage: null, // Gemini usage stats not easily accessible in browser SDK
                model: model
            };
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError' || error.message.includes('signal')) {
                throw new LLMError('Request timeout', 408);
            }
            
            if (error instanceof LLMError) {
                throw error;
            }
            
            // Handle Gemini-specific errors
            const errorMessage = error.message || 'Unknown error';
            if (errorMessage.includes('API key') || errorMessage.includes('invalid API key')) {
                throw new LLMError('Invalid API key', 401);
            }
            
            throw new LLMError(`Gemini API error: ${errorMessage}`, 0);
        }
    }
    
    /**
     * Send request with retry logic
     * @param {string} systemPrompt - System instruction/prompt
     * @param {string} userMessage - User message
     * @param {Object} options - Request options
     * @returns {Promise<Object>} API response
     */
    async function sendRequestWithRetry(systemPrompt, userMessage = '', options = {}) {
        const maxRetries = options.maxRetries || MAX_RETRIES;
        const retryDelay = options.retryDelay || RETRY_DELAY;
        
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await sendRequest(systemPrompt, userMessage, options);
            } catch (error) {
                lastError = error;
                
                // Don't retry on certain errors
                if (error.status === 401 || error.status === 403 || error.status === 400) {
                    throw error;
                }
                
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                }
            }
        }
        
        throw lastError;
    }
    
    /**
     * Generate response for a persona
     * @param {Object} persona - Persona object
     * @param {Object} group - Group object
     * @param {Array} messages - Conversation history
     * @param {string} userMessage - User message
     * @param {Object} options - LLM options
     * @returns {Promise<Object>} Response data
     */
    async function generateResponse(persona, group, messages, userMessage, options = {}) {
        // Build prompt using ChatEngine
        const promptData = psychologyBot.ChatEngine.buildPrompt(persona, group, messages, userMessage);
        
        // Send to Gemini LLM with system instruction and user message
        const result = await sendRequestWithRetry(promptData.systemInstruction, promptData.userMessage, options);
        
        return {
            personaId: persona.id,
            personaName: persona.name,
            personaAvatar: persona.avatar,
            content: result.content,
            usage: result.usage,
            model: result.model
        };
    }
    
    /**
     * Generate responses for all personas in a group
     * @param {Object} group - Group object
     * @param {Array} messages - Conversation history
     * @param {string} userMessage - User message
     * @param {Object} options - LLM options
     * @returns {Promise<Array>} Array of responses
     */
    async function generateGroupResponses(group, messages, userMessage, options = {}) {
        const personas = psychologyBot.GroupManager.getGroupPersonas(group.id);
        
        const responses = await Promise.all(
            personas.map(persona => 
                generateResponse(persona, group, messages, userMessage, options)
            )
        );
        
        return responses;
    }
    
    /**
     * Check API key validity using Gemini test request
     * @returns {Promise<Object>} Check result
     */
    async function checkApiKeyValidity() {
        if (!validateApiKey()) {
            return {
                valid: false,
                error: 'API key not configured or Google Generative AI SDK not loaded'
            };
        }
        
        try {
            // Test with a simple Gemini request
            const testResult = await sendRequest('You are a helpful assistant.', 'Say "test"', { timeout: 10000 });
            
            if (testResult.success && testResult.content) {
                return { valid: true };
            } else {
                return {
                    valid: false,
                    error: 'Unexpected response from Gemini API'
                };
            }
        } catch (error) {
            return {
                valid: false,
                error: `API validation failed: ${error.message}`
            };
        }
    }
    
    /**
     * LLM Error class
     */
    class LLMError extends Error {
        constructor(message, status = 0, details = null) {
            super(message);
            this.name = 'LLMError';
            this.status = status;
            this.details = details;
        }
    }
    
    // Public API
    return {
        sendRequest,
        sendRequestWithRetry,
        generateResponse,
        generateGroupResponses,
        checkApiKeyValidity,
        validateApiKey,
        getApiKey,
        formatRequestPayload,
        LLMError,
        DEFAULT_MODEL,
        DEFAULT_TIMEOUT,
        MAX_RETRIES
    };
})();