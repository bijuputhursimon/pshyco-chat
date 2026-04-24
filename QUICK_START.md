# Quick Start Guide - Psychology Bot Swarm

**Get up and running with the multi-agent AI chat system in 5 minutes!**

---

## 🚀 Running Tests (Verify Installation)

```bash
# Open test runner in browser
open tests/index.html

# Expected: 163/163 tests passing ✅
```

---

## 💻 Using the Modules

### Basic Setup

Include all modules in your HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Psychology Bot App</title>
</head>
<body>
    <!-- Load modules in order -->
    <script src="modules/storage.js"></script>
    <script src="modules/persona-manager.js"></script>
    <script src="modules/group-manager.js"></script>
    <script src="modules/chat-engine.js"></script>
    <script src="modules/llm-integration.js"></script>
    <script src="modules/trait-manager.js"></script>

    <script>
        // Your code here
    </script>
</body>
</html>
```

---

## 🎭 Creating Personas (AI Agents)

### Create a Simple Persona

```javascript
// Create a basic persona
const therapist = psychologyBot.PersonaManager.createPersona({
    name: 'Dr. Compassion',
    avatar: '🧘',
    systemPrompt: 'You are a compassionate and empathetic therapist who helps people work through their emotions.',
    tags: ['therapist', 'empathy', 'mental-health']
});

console.log('Created persona:', therapist.id);
```

### Create a Persona with Custom Traits

```javascript
const wittyBot = psychologyBot.PersonaManager.createPersona({
    name: 'Witty Wise',
    avatar: '😄',
    systemPrompt: 'You are a wise mentor who uses humor to make difficult topics easier to discuss.',
    traitValues: {
        humor: 85,
        wisdom: 75,
        empathy: 70,
        optimism: 80
    }
});
```

### Update Trait Values

```javascript
// Make the persona more empathetic
psychologyBot.PersonaManager.setTraitValue(therapist.id, 'empathy', 95);

// Or use TraitManager (with validation)
psychologyBot.TraitManager.setTraitValue(therapist.id, 'humor', 60);
```

---

## 👥 Creating Groups (Multi-Agent Conversations)

### Create a Group with Multiple Personas

```javascript
// First create personas
const alice = psychologyBot.PersonaManager.createPersona({
    name: 'Alice the Empath',
    avatar: '💕',
    systemPrompt: 'You focus on emotional support and validation.',
    traitValues: { empathy: 90, patience: 85 }
});

const bob = psychologyBot.PersonaManager.createPersona({
    name: 'Bob the Pragmatist',
    avatar: '🎯',
    systemPrompt: 'You provide practical solutions and direct advice.',
    traitValues: { directness: 85, assertiveness: 75 }
});

const carol = psychologyBot.PersonaManager.createPersona({
    name: 'Carol the Optimist',
    avatar: '✨',
    systemPrompt: 'You help people see the bright side and build confidence.',
    traitValues: { optimism: 95, humor: 70 }
});

// Create a support group
const supportGroup = psychologyBot.GroupManager.createGroup({
    name: 'Support Circle',
    personaIds: [alice.id, bob.id, carol.id]
});

console.log('Created group:', supportGroup.id);
```

---

## 💬 Processing Conversations

### Send a User Message and Get Responses

```javascript
async function handleUserMessage(groupId, message) {
    try {
        // 1. Save user message
        psychologyBot.ChatEngine.saveUserMessage(groupId, message);
        
        // 2. Get conversation context
        const group = psychologyBot.GroupManager.getGroupById(groupId);
        const messages = psychologyBot.StorageModule.getGroupMessages(groupId);
        const personas = psychologyBot.GroupManager.getGroupPersonas(groupId);
        
        // 3. Generate responses from all personas (in parallel)
        const responses = await psychologyBot.LLMIntegration.generateGroupResponses(
            group,
            messages,
            message
        );
        
        // 4. Save AI responses
        responses.forEach(response => {
            psychologyBot.ChatEngine.saveAiResponse(groupId, response.personaId, response.content);
        });
        
        // 5. Display responses
        return responses;
        
    } catch (error) {
        console.error('Error processing message:', error);
        throw error;
    }
}

// Usage:
const replies = await handleUserMessage(supportGroup.id, "I'm feeling really stressed about work.");
replies.forEach(reply => {
    console.log(`${reply.personaName}: ${reply.content}`);
});
```

---

## 🔑 Setting Up API Key (Google Gemini)

```javascript
// Get your free API key from: https://aistudio.google.com/apikey

// Save API key (encrypted in localStorage)
psychologyBot.StorageModule.saveApiKey('your-gemini-api-key-here');

// Verify it's set
const isValid = psychologyBot.LLMIntegration.validateApiKey();
console.log('API key valid:', isValid); // true/false

// Or check with async validation
const checkResult = await psychologyBot.LLMIntegration.checkApiKeyValidity();
console.log('API check:', checkResult); 
// { valid: true } or { valid: false, error: '...' }
```

---

## 🎯 Working with Traits

### Get All Available Traits

```javascript
const traits = psychologyBot.StorageModule.getTraitDefinitions();
console.log('Available traits:', traits);

/* Output:
[
    { id: 'optimism', label: 'Optimism', enabled: true, min: 0, max: 100, default: 50 },
    { id: 'empathy', label: 'Empathy', enabled: true, ... },
    ...
]
*/
```

### Get Trait Values for a Persona

```javascript
const persona = psychologyBot.PersonaManager.getPersonaById('persona_123');

// Get single trait value
const empathyLevel = psychologyBot.TraitManager.getTraitValue(persona.id, 'empathy');
console.log(`Empathy level: ${empathyLevel}`); // e.g., 75

// Get all trait values (with defaults)
const allTraits = psychologyBot.TraitManager.getAllTraitValues(persona.id);
console.log('All traits:', allTraits);
/* Output:
{
    optimism: 50,
    empathy: 75,
    directness: 50,
    ...
}
*/
```

### Create Custom Traits

```javascript
// Add a new trait type
const newTrait = psychologyBot.TraitManager.addTraitDefinition({
    id: 'creativity',
    name: 'Creativity Level',
    description: 'How creative and imaginative the persona is',
    min: 0,
    max: 100,
    default: 50
});

// Use it in a persona
const artist = psychologyBot.PersonaManager.createPersona({
    name: 'Creative Soul',
    avatar: '🎨',
    systemPrompt: 'You approach problems with creative and artistic perspectives.',
    traitValues: { creativity: 90, humor: 75 }
});
```

### Get Trait Distribution Across Personas

```javascript
// See how empathy is distributed across all personas
const distribution = psychologyBot.TraitManager.getTraitDistribution('empathy');

console.log(distribution);
/* Output:
{
    count: 10,        // number of personas
    min: 30,          // lowest value
    max: 95,          // highest value
    avg: 67,          // average (rounded)
    values: [50, 90, 75, ...] // all values
}
*/
```

---

## 🔍 Searching and Filtering

### Search Personas

```javascript
// Find personas by name
const empatheticBots = psychologyBot.PersonaManager.searchPersonas('empath');

// Find by tag
const therapists = psychologyBot.PersonaManager.searchPersonas('therapist');

console.log('Found:', therapists.length, 'personas');
```

### Search Groups

```javascript
// Find groups by name
const supportGroups = psychologyBot.GroupManager.searchGroups('support');

// Get all groups a persona is in
const myGroups = psychologyBot.GroupManager.getGroupsForPersona(personaId);
```

---

## 📚 Managing Conversation History

### Get Conversation History

```javascript
// Get last 50 messages (default)
const history = psychologyBot.ChatEngine.getConversationHistory(groupId);

// Get last 10 messages only
const recentMessages = psychologyBot.ChatEngine.getConversationHistory(groupId, 10);

console.log('Messages:', history.length);
```

### Clear Conversation History

```javascript
// Clear all messages in a group
psychologyBot.ChatEngine.clearConversationHistory(groupId);

// Group will still exist but with no message history
```

---

## 🛠️ Building Prompts (Advanced)

The ChatEngine automatically builds prompts with persona traits:

```javascript
const persona = psychologyBot.PersonaManager.getPersonaById('persona_123');
const group = psychologyBot.GroupManager.getGroupById('group_456');
const messages = psychologyBot.StorageModule.getGroupMessages('group_456');

// Build complete prompt for LLM
const promptData = psychologyBot.ChatEngine.buildPrompt(
    persona,
    group,
    messages,
    "User's message here"
);

console.log('System Prompt:', promptData.systemPrompt);
console.log('Full Prompt:', promptData.fullPrompt);

/* Output includes:
- Persona system prompt
- Personality traits (if not default 50)
- Group metadata
- Conversation history
- Current user message
*/
```

---

## 🧹 Data Management

### Export All Data

```javascript
const exportData = psychologyBot.StorageModule.exportAllData();

console.log(exportData);
/* Output:
{
    version: 1,
    timestamp: '2026-04-24T...',
    data: {
        personas: [...],
        groups: [...],
        traits: [...]
        // Note: API key NOT included for security
    }
}
*/

// Save to file (browser)
const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'psychology-bot-backup.json';
a.click();
```

### Import Data

```javascript
// Load from file
async function importDataFromFile(file) {
    const text = await file.text();
    const data = JSON.parse(text);
    
    psychologyBot.StorageModule.importData(data);
    
    console.log('Imported:', data.data.personas.length, 'personas');
}

// Usage with file input:
document.getElementById('importFile').addEventListener('change', (e) => {
    importDataFromFile(e.target.files[0]);
});
```

### Clear All Data

```javascript
// ⚠️ WARNING: This deletes EVERYTHING!
psychologyBot.StorageModule.clearAllData();

// localStorage is now empty for psychology_bot keys
```

---

## 🎨 Example: Complete Chat Interface Flow

```javascript
class ChatApp {
    constructor() {
        this.currentGroupId = null;
        this.init();
    }
    
    async init() {
        // Create default personas if none exist
        const personas = psychologyBot.PersonaManager.getAllPersonas();
        
        if (personas.length === 0) {
            await this.createDefaultPersonas();
        }
        
        // Create or select a group
        const groups = psychologyBot.GroupManager.getAllGroups();
        this.currentGroupId = groups.length > 0 ? groups[0].id : null;
    }
    
    async createDefaultPersonas() {
        const therapist = psychologyBot.PersonaManager.createPersona({
            name: 'Dr. Compassion',
            avatar: '🧘',
            systemPrompt: 'You are a compassionate therapist.',
            traitValues: { empathy: 90, patience: 85 }
        });
        
        const coach = psychologyBot.PersonaManager.createPersona({
            name: 'Life Coach Alex',
            avatar: '💪',
            systemPrompt: 'You are an encouraging life coach.',
            traitValues: { optimism: 90, assertiveness: 75 }
        });
        
        // Create group
        this.currentGroupId = psychologyBot.GroupManager.createGroup({
            name: 'My Support Team',
            personaIds: [therapist.id, coach.id]
        }).id;
    }
    
    async sendMessage(message) {
        try {
            // Save user message
            psychologyBot.ChatEngine.saveUserMessage(this.currentGroupId, message);
            
            // Get context
            const group = psychologyBot.GroupManager.getGroupById(this.currentGroupId);
            const messages = psychologyBot.StorageModule.getGroupMessages(this.currentGroupId);
            
            // Generate responses from all personas
            const responses = await psychologyBot.LLMIntegration.generateGroupResponses(
                group,
                messages,
                message
            );
            
            // Save and return responses
            responses.forEach(response => {
                psychologyBot.ChatEngine.saveAiResponse(
                    this.currentGroupId, 
                    response.personaId, 
                    response.content
                );
            });
            
            return responses;
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

// Usage:
const chat = new ChatApp();
const replies = await chat.sendMessage("I'm feeling overwhelmed.");
replies.forEach(r => console.log(`${r.personaName}: ${r.content}`));
```

---

## 📖 More Examples

- See `tests/` folder for detailed unit test examples
- Check `psychology-bot-swarm.html` for full UI implementation (coming soon)
- Review module source files for JSDoc comments on all functions

---

**Need help?** Check the documentation:
- `ARCHITECTURE.md` - Full API reference
- `IMPLEMENTATION_STATUS.md` - Current status and features
- `MIGRATION_GUIDE.md` - Integrating with existing apps
