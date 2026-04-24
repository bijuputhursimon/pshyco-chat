# Psychology Bot Swarm 🤖

A powerful multi-agent AI chat system that enables conversations with multiple specialized AI personas simultaneously. Built with vanilla JavaScript and powered by Google's Gemini API.

## ✨ Features

- **Multi-Persona Conversations**: Create groups with multiple AI agents, each with unique personalities and expertise
- **Turn-Based Responses**: Automatic responder rotation for natural group dynamics
- **Custom Personas**: Design AI agents with custom names, avatars, system prompts, and character traits
- **Persistent Storage**: All conversations, personas, and settings saved locally with encrypted API keys
- **Markdown Support**: Rich text formatting with code syntax highlighting
- **No Build Tools Required**: Pure browser-based application - just open the HTML file!

## 🚀 Quick Start

### 1. Get Your Gemini API Key

Visit [Google AI Studio](https://aistudio.google.com/apikey) to get your free API key.

### 2. Open the Application

Simply open `psychology-bot-swarm.html` in your browser:

```bash
# On Windows
start psychology-bot-swarm.html

# On Mac
open psychology-bot-swarm.html

# On Linux
xdg-open psychology-bot-swarm.html
```

Or just double-click the file!

### 3. Configure Your API Key

1. Click **⚙️ Settings** in the top right
2. Enter your Gemini API key
3. Click **💾 Save Key**

### 4. Create Your First Persona

1. Click **🎭 Personas** tab
2. Click **+ New Persona**
3. Fill in:
   - Name (e.g., "Career Coach")
   - Avatar (emoji like 🤖 or 👩‍💼)
   - System Prompt (e.g., "You are a supportive career advisor...")
4. Click **Create Persona**

### 5. Start a Conversation

1. Click **💬 Groups** tab
2. Click **+ New Group**
3. Enter group name and select personas
4. Click **Create Group**
5. Type your message and hit send!

## 📖 Documentation

- **[Architecture Guide](ARCHITECTURE.md)** - System design and module structure
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[Quick Reference](QUICK_REFERENCE.md)** - API reference for developers
- **[Migration Guide](MIGRATION_GUIDE.md)** - Migrate from other LLM providers
- **[Test Requirements](TEST_REQUIREMENTS.md)** - Testing guidelines and coverage

## 🏗️ Architecture

The application follows a modular design with clear separation of concerns:

```
modules/
├── storage.js          # LocalStorage wrapper with encryption
├── persona-manager.js  # Persona CRUD operations
├── group-manager.js    # Conversation group management
├── chat-engine.js      # Chat logic and message handling
├── llm-integration.js  # Gemini API integration
└── trait-manager.js    # Character traits system
```

## 🧪 Running Tests

The application includes comprehensive test suites:

```bash
# Open test runner in browser
open tests/index.html

# Expected: All tests passing ✅
```

## 🔒 Privacy & Security

- **Local Storage Only**: All data stored in your browser's LocalStorage
- **Encrypted API Keys**: Base64 encoding for sensitive data
- **No Server Required**: Everything runs client-side
- **No Data Collection**: Your conversations never leave your device

## 🎨 Customization

### Creating Specialized Personas

Each persona can be customized with:

- **Name & Avatar**: Visual identity
- **System Prompt**: Core personality and behavior instructions
- **Character Traits**: Personality dimensions (e.g., empathy, expertise level)
- **Tags**: Categorization for easy management

**Example System Prompts:**

```
Career Coach: "You are an experienced career advisor with 15 years of coaching professionals. You provide actionable advice, ask probing questions, and help people navigate career transitions."

Therapist Bot: "You are a compassionate therapeutic assistant trained in CBT techniques. You listen actively, validate feelings, and guide users toward self-discovery without giving medical advice."

Mentor AI: "You are a wise mentor who has achieved success in multiple fields. You share insights from experience, challenge assumptions, and encourage growth mindset."
```

## 🛠️ For Developers

### Module Usage

```javascript
// Access all modules via psychologyBot namespace
const { StorageModule, PersonaManager, GroupManager, ChatEngine, LLMIntegration } = window.psychologyBot;

// Create a persona
const persona = PersonaManager.createPersona({
  name: "My AI Agent",
  avatar: "🎯",
  systemPrompt: "You are helpful and knowledgeable.",
  tags: ["general", "assistant"]
});

// Generate a response
const response = await LLMIntegration.generateResponse(
  message,
  persona.systemPrompt,
  apiKey
);
```

### API Integration

The application uses Google's Gemini API (`gemini-flash-latest` model):

```javascript
// Configuration
const genAI = new window.GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  systemInstruction: personaPrompt
});

// Generate response
const result = await model.generateContent(message);
const text = result.response.text();
```

## 📝 Project Structure

```
psychology-bot-swarm/
├── psychology-bot-swarm.html    # Main application UI
├── modules/                     # Backend JavaScript modules
│   ├── storage.js
│   ├── persona-manager.js
│   ├── group-manager.js
│   ├── chat-engine.js
│   ├── llm-integration.js
│   └── trait-manager.js
├── tests/                       # Test suites
│   ├── index.html              # Test runner UI
│   ├── framework.js            # Testing framework
│   └── *.test.js               # Individual test files
├── mocks/                       # Mock implementations
│   └── storage-mock.js
└── README.md                    # This file
```

## 🎯 Use Cases

- **Career Counseling**: Get advice from specialized career coaches
- **Decision Making**: Consult multiple perspectives on important choices
- **Skill Development**: Learn from expert personas in various domains
- **Creative Brainstorming**: Collaborate with AI agents for idea generation
- **Therapeutic Support**: Practice conversations with supportive AI companions
- **Sales Training**: Role-play with realistic customer personas

## 🐛 Troubleshooting

### API Key Not Working

1. Verify your key is correct (no extra spaces)
2. Check if you have quota limits in Google AI Studio
3. Ensure the key hasn't expired

### Messages Not Sending

1. Check browser console for errors (F12 → Console)
2. Verify API key is saved in Settings
3. Clear browser cache and reload

### Data Lost After Refresh

- All data should persist automatically
- If lost, check browser's LocalStorage settings
- Use **📤 Export All Data** to backup your content

## 🤝 Contributing

This is an open-source project! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for personal or commercial projects!

## 🌟 Roadmap

- [ ] Voice input/output support
- [ ] Export conversations as PDF
- [ ] Share personas with community
- [ ] Advanced trait customization UI
- [ ] Multi-language support
- [ ] Mobile-responsive design improvements

---

**Built with ❤️ using Google Gemini API and vanilla JavaScript**

For questions or issues, please open a GitHub issue or contact the maintainer.
