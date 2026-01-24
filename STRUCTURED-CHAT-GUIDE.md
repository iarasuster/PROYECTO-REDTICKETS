# 🤖 Structured Chatbot Implementation Guide

## Overview

This implementation follows a **Generative UI architecture** where:

- The AI returns **structured JSON** (not JSX or HTML)
- The frontend **renders components** based on the JSON structure
- Responses are **composed from layers**, not monolithic text blocks

## Architecture

```
User Input → useStructuredChat Hook
           ↓
           POST /api/chat-structured
           ↓
           Vercel AI SDK streamObject()
           ↓
           Groq (Llama 3.1-70b-versatile)
           ↓
           Structured JSON Response
           ↓
           {
             archetype: "discover",
             layers: {
               visual: [...],
               acknowledge: {...},
               context: {...},
               insight: {...},
               nextSteps: [...]
             }
           }
           ↓
           Frontend Renderer (StructuredChatUI)
           ↓
           Visual Blocks + Text Layers + Action Buttons
```

## Files Created

### Backend

- `backend/src/types/chatbot.ts` - TypeScript types for AIMessage, VisualBlock, ActionBlock
- `backend/src/app/api/chat-structured/route.ts` - Structured chat endpoint with comprehensive system prompt

### Frontend

- `frontend/src/hooks/useStructuredChat.js` - Hook for handling streaming JSON responses
- `frontend/src/components/StructuredChatUI.jsx` - Main chat UI component
- `frontend/src/components/StructuredChatUI.css` - Styles
- `frontend/src/components/chatbot/` - Visual block components:
  - `ImageBlock.jsx` - Single image with caption
  - `ImageGallery.jsx` - Grid of images (team, products)
  - `CardList.jsx` - Cards for services/options
  - `VideoBlock.jsx` - Embedded video (YouTube)
  - `VisualBlocks.css` - Shared styles
  - `SuggestedActions.jsx` - Initial chat suggestions
  - `SuggestedActions.css` - Styles

## Integration Steps

### 1. Test the Structured Chatbot

Add a test route to your frontend to try the new chatbot:

```jsx
// In frontend/src/App.jsx
import { StructuredChatUI } from "./components/StructuredChatUI";

// Add route
<Route
  path="/chat-test"
  element={
    <div style={{ padding: "20px" }}>
      <h1>Structured Chatbot Test</h1>
      <StructuredChatUI />
    </div>
  }
/>;
```

### 2. Environment Variables

Ensure your frontend `.env` includes:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Start Both Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Test the Chatbot

Visit: `http://localhost:5173/chat-test`

Try these test queries:

- "Qué servicios ofrecen?" → Should return card-list
- "Cómo compro entradas?" → Should return video + nextSteps
- "Quiénes son el equipo?" → Should return image-gallery or text
- "Qué eventos han realizado?" → Should return inform with stats

## Conversational Archetypes

Every response is classified into one archetype:

| Archetype    | Purpose           | Example Query              | Expected Response          |
| ------------ | ----------------- | -------------------------- | -------------------------- |
| **discover** | User exploring    | "Qué servicios ofrecen?"   | card-list of services      |
| **compare**  | User evaluating   | "Diferencia entre tótems?" | Comparison cards/text      |
| **inform**   | User asking facts | "Cuántos eventos?"         | Direct text answer         |
| **handoff**  | User ready to act | "Cómo compro?"             | Video tutorial + nextSteps |
| **redirect** | Out of scope      | "Qué hora es?"             | Polite redirect            |

## Message Layers

Responses can include up to 5 layers (all optional):

1. **visual** - UI components (image, gallery, cards, video)
2. **acknowledge** - Brief intent recognition ("Entiendo que...")
3. **context** - Clarification ("Trabajamos con eventos de todo tipo...")
4. **insight** - Human-like recommendation ("La mayoría inicia con...")
5. **nextSteps** - Action buttons (navigate, send message)

**Render order**: visual → acknowledge/context/insight → nextSteps

## Visual Block Types

### ImageBlock

```json
{
  "type": "image",
  "src": "https://example.com/image.jpg",
  "alt": "Description",
  "caption": "Optional caption"
}
```

### ImageGallery

```json
{
  "type": "image-gallery",
  "images": [
    {
      "src": "https://example.com/person.jpg",
      "name": "Juan Pérez",
      "role": "Fundador"
    }
  ]
}
```

### CardList

```json
{
  "type": "card-list",
  "items": [
    {
      "title": "Servicio 1",
      "description": "Descripción breve",
      "action": "servicios"
    }
  ]
}
```

### VideoBlock (CRITICAL)

**Only ONE video exists**: Tutorial "Cómo comprar entradas"

```json
{
  "type": "video",
  "src": "https://www.youtube.com/embed/SfHuVUmpzgU",
  "title": "Tutorial: Cómo comprar entradas"
}
```

## Next Steps Actions

Actions rendered as buttons after the message:

```json
{
  "type": "navigate", // or "message"
  "label": "Ver Servicios",
  "value": "servicios", // URL slug or message text
  "variant": "primary" // or "secondary"
}
```

- **navigate** - Uses React Router to go to `/seccion/{value}`
- **message** - Sends a predefined message to the chat

## Customization

### Adding New Visual Block Types

1. Create new component in `frontend/src/components/chatbot/`
2. Add type to `backend/src/types/chatbot.ts`
3. Update Zod schema in `chat-structured/route.ts`
4. Add render case in `StructuredChatUI.jsx`
5. Update system prompt with usage examples

### Modifying System Prompt

Edit `SYSTEM_PROMPT` in `backend/src/app/api/chat-structured/route.ts`:

- Add new examples
- Adjust tone/style
- Add business rules
- Update content references

### Changing AI Model

In `chat-structured/route.ts`:

```typescript
const result = await streamObject({
  model: groq("llama-3.1-70b-versatile"), // Change here
  // ...
});
```

Available Groq models:

- `llama-3.1-8b-instant` - Fast, good for simple tasks
- `llama-3.1-70b-versatile` - Better reasoning (RECOMMENDED)
- `mixtral-8x7b-32768` - Long context

## Troubleshooting

### "streamObject is not a function"

→ Update Vercel AI SDK: `npm install ai@latest` in backend

### JSON parsing errors in console

→ Check backend logs, ensure Groq API key is valid

### Visual blocks not rendering

→ Verify data structure matches TypeScript types exactly

### Video not loading

→ Check CORS, ensure YouTube embed URL is used

### Actions not working

→ Check React Router is configured, routes exist

## Migration from Old Chat

To replace the old `[ACTION:navigate:slug]` pattern:

1. Keep old endpoint for backward compatibility
2. Test structured endpoint thoroughly
3. Update `Chatbot.jsx` to use `StructuredChatUI`
4. Update environment variable to point to new endpoint
5. Monitor performance and user feedback

## Performance Notes

- **Cache**: Content data cached for 5 minutes
- **Streaming**: Responses stream as they're generated
- **Model**: 70b model ~2-3s response time
- **Fallback**: Error handling with graceful degradation

## References

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Groq API Docs](https://console.groq.com/docs)
- [Zod Schema Validation](https://zod.dev)
- [OpenAI Generative UI Guidelines](https://platform.openai.com/docs/guides/generative-ui)
