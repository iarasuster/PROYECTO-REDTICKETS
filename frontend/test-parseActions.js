// TEST: parseActions function
// Copiar y ejecutar en consola del navegador para verificar

function parseActions(text) {
  const actionRegex = /\[ACTION:navigate:([\w-]+)\|([^\]]+)\]/g;
  const actions = [];
  let match;

  while ((match = actionRegex.exec(text)) !== null) {
    actions.push({
      type: "navigate",
      section: match[1],
      label: match[2],
      path: `/seccion/${match[1]}`,
    });
  }

  const limitedActions = actions.slice(0, 2);
  const cleanText = text.replace(actionRegex, "").trim();

  return {
    text: cleanText,
    actions: limitedActions,
  };
}

// TEST CASES
console.log("========== TEST 1: sobre-nosotros ==========");
const test1 = "Somos una empresa de gestión de eventos y venta de tickets. [ACTION:navigate:sobre-nosotros|Conoce Nuestra Historia]";
const result1 = parseActions(test1);
console.log("Input:", test1);
console.log("Output:", result1);
console.log("✅ Esperado: text limpio, 1 acción con section='sobre-nosotros'");

console.log("\n========== TEST 2: múltiples acciones ==========");
const test2 = "¡Bienvenido! ¿Necesitas ayuda con algo en particular? [ACTION:navigate:servicios|Ver Servicios] [ACTION:navigate:ayuda|Centro de Ayuda]";
const result2 = parseActions(test2);
console.log("Input:", test2);
console.log("Output:", result2);
console.log("✅ Esperado: text limpio, 2 acciones");

console.log("\n========== TEST 3: sin guiones ==========");
const test3 = "Hola [ACTION:navigate:contacto|Contactar]";
const result3 = parseActions(test3);
console.log("Input:", test3);
console.log("Output:", result3);
console.log("✅ Esperado: text='Hola', 1 acción");

console.log("\n========== TEST 4: sin acciones ==========");
const test4 = "Solo texto sin comandos";
const result4 = parseActions(test4);
console.log("Input:", test4);
console.log("Output:", result4);
console.log("✅ Esperado: text igual, actions=[]");
