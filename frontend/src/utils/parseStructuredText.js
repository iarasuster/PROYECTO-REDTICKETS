/**
 * Parser de texto estructurado del chatbot
 * Convierte respuesta en formato texto a estructura de layers
 */

export function parseStructuredText(text) {
  // Asegurar que el texto termine con ---
  let normalizedText = text.trim();
  if (!normalizedText.endsWith("---")) {
    normalizedText += "\n---";
  }

  const result = {
    archetype: "inform", // Default fallback
    layers: {
      message: "", // Campo textual único y canónico
      visual: [],
      actions: [],
    },
  };

  // Extract archetype (con validación)
  const archetypeMatch = normalizedText.match(/ARCHETYPE:\s*(\w+)/i);
  if (archetypeMatch) {
    const archetype = archetypeMatch[1].trim().toLowerCase();
    // Validar arquetipos válidos
    const validArchetypes = [
      "discover",
      "inform",
      "handoff",
      "redirect",
      "farewell",
    ];
    result.archetype = validArchetypes.includes(archetype)
      ? archetype
      : "inform";
  }

  // Extract message text (regex más tolerante)
  const messageMatch = normalizedText.match(
    /MESSAGE:\s*([\s\S]*?)(?=VISUAL:|ACTIONS:|---|$)/i,
  );
  if (messageMatch) {
    result.layers.message = messageMatch[1].trim();
  }

  // Validación silenciosa en producción
  if (!result.layers.message || result.layers.message.trim().length === 0) {
    // Solo advertir en desarrollo
    if (import.meta.env.DEV && normalizedText.includes("---")) {
      console.warn("⚠️ MESSAGE vacío detectado");
    }
  }

  // Extract visual section (opcional, regex más tolerante)
  const visualMatch = text.match(/VISUAL:\s*([\s\S]*?)(?=ACTIONS:|---|$)/i);
  if (visualMatch) {
    const visualContent = visualMatch[1];
    const visualLines = visualContent.split("\n").filter((l) => l.trim());

    const cards = [];
    let currentVideo = null;

    for (const line of visualLines) {
      const trimmed = line.trim();

      // Parse CARDS: Title | Description | action (o solo Title | Description)
      if (trimmed.startsWith("CARDS:")) {
        const parts = trimmed
          .replace("CARDS:", "")
          .split("|")
          .map((p) => p.trim());

        if (parts.length >= 2) {
          cards.push({
            title: parts[0],
            description: parts[1],
            action: parts[2] || "", // action es opcional
          });
        }
      }

      // Parse VIDEO: url | title
      if (trimmed.startsWith("VIDEO:")) {
        const parts = trimmed
          .replace("VIDEO:", "")
          .split("|")
          .map((p) => p.trim());
        if (parts.length >= 1) {
          currentVideo = {
            type: "video",
            src: parts[0],
            title: parts[1] || "Video tutorial",
          };
        }
      }
    }

    // Prioridad: VIDEO > CARDS
    if (currentVideo) {
      result.layers.visual = [currentVideo];
    } else if (cards.length > 0) {
      result.layers.visual.push({
        type: "card-list",
        items: cards,
      });
    }
  }

  // Extract actions section (opcional, máx 3)
  const actionsMatch = text.match(/ACTIONS:\s*\n([\s\S]*?)(?=---|$)/i);
  if (actionsMatch) {
    const actionsContent = actionsMatch[1];
    const actionLines = actionsContent.split("\n").filter((l) => l.trim());

    for (const line of actionLines) {
      const trimmed = line.trim();
      // Parse: Label → value (type)
      const actionMatch = trimmed.match(/^(.+?)\s*→\s*(.+?)\s*\((.+?)\)$/);
      if (actionMatch) {
        result.layers.actions.push({
          type: actionMatch[3].trim(), // navigate or message
          label: actionMatch[1].trim(),
          value: actionMatch[2].trim(),
        });

        // Limitar a 3 acciones máximo
        if (result.layers.actions.length >= 3) break;
      }
    }
  }

  // 🚨 VALIDACIÓN CRÍTICA: MESSAGE nunca puede estar vacío
  if (!result.layers.message || result.layers.message.trim().length === 0) {
    if (import.meta.env.DEV) console.warn("⚠️ Respuesta sin MESSAGE detectada. Agregando fallback.");

    // Generar mensaje fallback según componentes presentes
    if (result.layers.visual.length > 0) {
      result.layers.message = "Aquí tenés la información que solicitaste:";
    } else if (result.layers.actions.length > 0) {
      result.layers.message = "Te comparto estas opciones útiles:";
    } else {
      result.layers.message = "¿En qué más puedo ayudarte?";
    }
  }

  return result;
}
