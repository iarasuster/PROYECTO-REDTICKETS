# Configuración de Groq API

## ¿Por qué Groq?

- **Gratis**: Tier gratuito generoso
- **Rápido**: Inference ultra rápida con chips especializados
- **Compatible**: API compatible con OpenAI
- **Modelos**: Llama 3.1, Mixtral, Gemma, etc.

## Pasos de configuración:

### 1. Crear cuenta en Groq

- Ve a: https://console.groq.com/
- Haz clic en "Sign Up"
- Completa el registro

### 2. Obtener API Key

- Una vez dentro, ve a la sección "API Keys"
- Clic en "Create API Key"
- Dale un nombre (ej: "RedTickets Chatbot")
- **Copia la key inmediatamente** (no podrás verla después)

### 3. Configurar en el proyecto

Agrega la key al archivo `backend/.env`:

```bash
# Groq API Configuration (gratis y rápido)
GROQ_API_KEY=gsk_tu_key_aqui_xxxxxxxxxxxxx
```

### 4. Reiniciar el backend

```bash
cd backend
npm run dev
```

## Modelos disponibles (gratis):

- `llama-3.1-8b-instant` ✅ (el más rápido)
- `llama-3.1-70b-versatile` (el más potente)
- `mixtral-8x7b-32768` (mucho contexto)
- `gemma2-9b-it` (alternativa)

## Límites del tier gratuito:

- 30 requests/min
- 6,000 tokens/min
- Suficiente para desarrollo y proyectos pequeños

## Alternativa: Si Groq no funciona

Puedes usar **OpenRouter** (también gratis):

```typescript
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: 'https://openrouter.ai/api/v1',
})
```

Obtén key en: https://openrouter.ai/
