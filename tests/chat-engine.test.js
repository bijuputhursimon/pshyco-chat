/**
 * ChatEngine Module Tests
 */

TestFramework.describe('ChatEngine - Prompt Formatting', (it) => {
    
    it('should format system prompt with traits', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Persona',
            systemPrompt: 'You are a helpful assistant',
            traitValues: { optimism: 80, empathy: 70 }
        });
        
        const prompt = psychologyBot.ChatEngine.formatSystemPrompt(persona);
        
        TestFramework.assert(
            prompt.includes('You are a helpful assistant'),
            'Should include system prompt'
        );
        
        TestFramework.assert(
            prompt.includes('optimism: 80%'),
            'Should include optimism trait'
        );
        
        TestFramework.assert(
            prompt.includes('empathy: 70%'),
            'Should include empathy trait'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should format system prompt without traits', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Simple Persona',
            systemPrompt: 'You are simple'
        });
        
        const prompt = psychologyBot.ChatEngine.formatSystemPrompt(persona);
        
        TestFramework.assert(
            prompt === 'You are simple',
            'Should return prompt without trait section'
        );
        
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should format conversation history', () => {
        const messages = [
            { role: 'user', content: 'Hello' },
            { role: 'ai', personaName: 'Bot', content: 'Hi there!' }
        ];
        
        const history = psychologyBot.ChatEngine.formatConversationHistory(messages);
        
        TestFramework.assert(
            history.includes('User: Hello'),
            'Should include user message'
        );
        
        TestFramework.assert(
            history.includes('Bot: Hi there!'),
            'Should include bot message'
        );
    });
    
    it('should handle empty conversation history', () => {
        const history = psychologyBot.ChatEngine.formatConversationHistory([]);
        
        TestFramework.assert(
            history === '',
            'Should return empty string for empty array'
        );
    });
    
    it('should format group metadata', () => {
        const persona1 = psychologyBot.PersonaManager.createPersona({
            name: 'Alice',
            systemPrompt: 'You are Alice'
        });
        
        const persona2 = psychologyBot.PersonaManager.createPersona({
            name: 'Bob',
            systemPrompt: 'You are Bob'
        });
        
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Test Group',
            personaIds: [persona1.id, persona2.id]
        });
        
        const metadata = psychologyBot.ChatEngine.formatGroupMetadata(group);
        
        TestFramework.assert(
            metadata.includes('Group: Test Group'),
            'Should include group name'
        );
        
        TestFramework.assert(
            metadata.includes('Alice'),
            'Should include persona names'
        );
        
        TestFramework.assert(
            metadata.includes('Bob'),
            'Should include all personas'
        );
        
        psychologyBot.GroupManager.deleteGroup(group.id);
        psychologyBot.PersonaManager.deletePersona(persona1.id);
        psychologyBot.PersonaManager.deletePersona(persona2.id);
    });
});

TestFramework.describe('ChatEngine - Message Processing', (it) => {
    
    it('should process user message', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test',
            systemPrompt: 'You are a test persona for processing'
        });
        
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Test Group',
            personaIds: [persona.id]
        });
        
        const result = psychologyBot.ChatEngine.processMessage(group.id, 'Hello');
        
        TestFramework.assert(
            result.group.id === group.id,
            'Should return correct group'
        );
        
        TestFramework.assert(
            result.personas.length === 1,
            'Should return personas'
        );
        
        TestFramework.assert(
            result.userMessage === 'Hello',
            'Should return user message'
        );
        
        TestFramework.assert(
            result.timestamp,
            'Should include timestamp'
        );
        
        psychologyBot.GroupManager.deleteGroup(group.id);
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should throw error for non-existent group', () => {
        TestFramework.assertThrows(
            () => psychologyBot.ChatEngine.processMessage('non-existent', 'Hello'),
            'Group not found'
        );
    });
    
    it('should throw error for empty message', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test',
            systemPrompt: 'You are a test persona for validation'
        });
        
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Test Group',
            personaIds: [persona.id]
        });
        
        TestFramework.assertThrows(
            () => psychologyBot.ChatEngine.processMessage(group.id, ''),
            'Message cannot be empty'
        );
        
        psychologyBot.GroupManager.deleteGroup(group.id);
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should save user message', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test',
            systemPrompt: 'You are a test persona for saving'
        });
        
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Test Group',
            personaIds: [persona.id]
        });
        
        const message = psychologyBot.ChatEngine.saveUserMessage(group.id, 'Test message');
        
        TestFramework.assert(
            message.role === 'user',
            'Should have user role'
        );
        
        TestFramework.assert(
            message.content === 'Test message',
            'Should have correct content'
        );
        
        TestFramework.assert(
            message.groupId === group.id,
            'Should have correct group ID'
        );
        
        psychologyBot.GroupManager.deleteGroup(group.id);
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should save AI response', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test Bot',
            systemPrompt: 'You are a test bot for saving responses'
        });
        
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Test Group',
            personaIds: [persona.id]
        });
        
        const message = psychologyBot.ChatEngine.saveAiResponse(group.id, persona.id, 'AI response');
        
        TestFramework.assert(
            message.role === 'ai',
            'Should have AI role'
        );
        
        TestFramework.assert(
            message.personaId === persona.id,
            'Should have persona ID'
        );
        
        TestFramework.assert(
            message.personaName === persona.name,
            'Should have persona name'
        );
        
        TestFramework.assert(
            message.content === 'AI response',
            'Should have correct content'
        );
        
        psychologyBot.GroupManager.deleteGroup(group.id);
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
});

TestFramework.describe('ChatEngine - Validation', (it) => {
    
    it('should validate valid message', () => {
        const result = psychologyBot.ChatEngine.validateMessage('Hello world');
        
        TestFramework.assert(
            result.valid === true,
            'Should be valid'
        );
        
        TestFramework.assert(
            result.errors.length === 0,
            'Should have no errors'
        );
    });
    
    it('should reject empty message', () => {
        const result = psychologyBot.ChatEngine.validateMessage('');
        
        TestFramework.assert(
            result.valid === false,
            'Should be invalid'
        );
        
        TestFramework.assert(
            result.errors.length > 0,
            'Should have errors'
        );
    });
    
    it('should reject whitespace-only message', () => {
        const result = psychologyBot.ChatEngine.validateMessage('   ');
        
        TestFramework.assert(
            result.valid === false,
            'Should be invalid'
        );
    });
    
    it('should reject too long message', () => {
        const longMessage = 'a'.repeat(10001);
        const result = psychologyBot.ChatEngine.validateMessage(longMessage);
        
        TestFramework.assert(
            result.valid === false,
            'Should be invalid'
        );
    });
});

TestFramework.describe('ChatEngine - History Management', (it) => {
    
    it('should get conversation history', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test',
            systemPrompt: 'You are a test persona for history'
        });
        
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Test Group',
            personaIds: [persona.id]
        });
        
        // Add some messages
        psychologyBot.ChatEngine.saveUserMessage(group.id, 'Message 1');
        psychologyBot.ChatEngine.saveAiResponse(group.id, persona.id, 'Response 1');
        psychologyBot.ChatEngine.saveUserMessage(group.id, 'Message 2');
        
        const history = psychologyBot.ChatEngine.getConversationHistory(group.id);
        
        TestFramework.assert(
            history.length === 3,
            'Should return all messages'
        );
        
        psychologyBot.GroupManager.deleteGroup(group.id);
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should limit history length', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test',
            systemPrompt: 'You are a test persona for limiting'
        });
        
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Test Group',
            personaIds: [persona.id]
        });
        
        // Add many messages
        for (let i = 0; i < 60; i++) {
            psychologyBot.ChatEngine.saveUserMessage(group.id, `Message ${i}`);
        }
        
        const history = psychologyBot.ChatEngine.getConversationHistory(group.id, 50);
        
        TestFramework.assert(
            history.length === 50,
            'Should limit to 50 messages'
        );
        
        psychologyBot.GroupManager.deleteGroup(group.id);
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
    
    it('should clear conversation history', () => {
        const persona = psychologyBot.PersonaManager.createPersona({
            name: 'Test',
            systemPrompt: 'You are a test persona for clearing'
        });
        
        const group = psychologyBot.GroupManager.createGroup({
            name: 'Test Group',
            personaIds: [persona.id]
        });
        
        psychologyBot.ChatEngine.saveUserMessage(group.id, 'Message');
        
        const cleared = psychologyBot.ChatEngine.clearConversationHistory(group.id);
        
        TestFramework.assert(
            cleared === true,
            'Should return true'
        );
        
        const history = psychologyBot.ChatEngine.getConversationHistory(group.id);
        TestFramework.assert(
            history.length === 0,
            'Should have no messages'
        );
        
        psychologyBot.GroupManager.deleteGroup(group.id);
        psychologyBot.PersonaManager.deletePersona(persona.id);
    });
});