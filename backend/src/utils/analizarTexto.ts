/**
 * 🧠 Análisis de texto con IA Mock
 * 
 * Simula análisis de sentimiento y toxicidad.
 * En producción, esto se conectaría a una API real como:
 * - Google Cloud Natural Language API
 * - AWS Comprehend
 * - OpenAI Moderation API
 * - Perspective API (Google)
 */

interface AnalysisResult {
  sentiment: number    // -1 (muy negativo) a 1 (muy positivo)
  toxicity: number     // 0 (limpio) a 1 (muy tóxico)
}

/**
 * Analiza el texto de un comentario
 * @param text - Texto del comentario a analizar
 * @returns Scores de sentimiento y toxicidad
 */
export function analizarTexto(text: string): AnalysisResult {
  // Limpieza básica del texto
  const cleanText = text.toLowerCase().trim()
  
  // 🎭 MOCK: Simular análisis con heurísticas simples
  let sentiment = 0
  let toxicity = 0
  
  // Palabras positivas (incrementan sentiment)
  const positivasRegex = /excelente|genial|increíble|bueno|mejor|feliz|gracias|perfecto|fantástico|amor|maravilloso/gi
  const positivasMatches = (cleanText.match(positivasRegex) || []).length
  sentiment += positivasMatches * 0.3
  
  // Palabras negativas (decrementan sentiment)
  const negativasRegex = /malo|pésimo|horrible|terrible|odio|peor|decepción|nunca más|fraude|estafa/gi
  const negativasMatches = (cleanText.match(negativasRegex) || []).length
  sentiment -= negativasMatches * 0.35
  
  // Palabras tóxicas (incrementan toxicity)
  const toxicasRegex = /idiota|estúpido|basura|mierda|asco|porquería|inútil|insulto/gi
  const toxicasMatches = (cleanText.match(toxicasRegex) || []).length
  toxicity += toxicasMatches * 0.4
  
  // Múltiples signos de exclamación (incrementan toxicity levemente)
  const exclamacionesExcesivas = (cleanText.match(/!{2,}/g) || []).length
  toxicity += exclamacionesExcesivas * 0.1
  
  // MAYÚSCULAS SOSTENIDAS (gritando, incrementa toxicity)
  const mayusculasSostenidas = (cleanText.match(/[A-Z]{5,}/g) || []).length
  toxicity += mayusculasSostenidas * 0.15
  
  // Agregar aleatoriedad para simular análisis de IA real
  sentiment += (Math.random() * 0.4 - 0.2) // ±0.2 de ruido
  toxicity += Math.random() * 0.15 // 0-0.15 de ruido base
  
  // Normalizar valores
  sentiment = Math.max(-1, Math.min(1, sentiment))
  toxicity = Math.max(0, Math.min(1, toxicity))
  
  return {
    sentiment: parseFloat(sentiment.toFixed(2)),
    toxicity: parseFloat(toxicity.toFixed(2)),
  }
}

/**
 * Determina si un comentario debe ser moderado
 * @param analisis - Resultado del análisis
 * @returns true si necesita moderación, false si se puede publicar
 */
export function necesitaModeracion(analisis: AnalysisResult): boolean {
  // Alta toxicidad
  if (analisis.toxicity > 0.35) return true
  
  // Muy negativo pero no tóxico (podría ser crítica constructiva)
  if (analisis.sentiment < -0.55 && analisis.toxicity < 0.2) return true
  
  // Todo normal
  return false
}
