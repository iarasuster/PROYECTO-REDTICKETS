#!/bin/bash

echo "🌱 Script de Re-Seed de ContenidoBlog"
echo "======================================"
echo ""

# Verificar si el backend está corriendo
if ! lsof -i :3001 | grep -q LISTEN; then
    echo "⚠️  El backend NO está corriendo en el puerto 3001"
    echo ""
    echo "Por favor, inicia el backend primero:"
    echo "  cd backend"
    echo "  npm run dev"
    echo ""
    echo "Luego ejecuta este script nuevamente:"
    echo "  bash reseed.sh"
    exit 1
fi

echo "✅ Backend detectado en puerto 3001"
echo ""
echo "🔄 Ejecutando seed vía API endpoint..."
echo ""

# Ejecutar el seed
response=$(curl -s -X POST http://localhost:3001/api/seed-contenido -H "Content-Type: application/json")

echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"

echo ""
echo "✅ Seed completado!"
echo ""
echo "📝 Próximo paso:"
echo "   Recarga el frontend (F5) para ver los datos actualizados"
