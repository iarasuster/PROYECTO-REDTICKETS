#!/bin/bash

# ========================================
# Script de Verificación de Seguridad
# Pre-Push a GitHub
# ========================================

echo "🔐 Ejecutando auditoría de seguridad pre-push..."
echo ""

ERRORS=0
WARNINGS=0

# Colores para output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# ========================================
# 1. Verificar que .env NO esté en staging
# ========================================
echo "📋 [1/7] Verificando archivos .env en staging..."
if git status --short | grep -E "\.env$|\.env\.local|\.env\.production" | grep -v ".env.example"; then
    echo -e "${RED}❌ ERROR: Archivos .env detectados en staging!${NC}"
    echo "   Ejecuta: git reset HEAD <archivo>"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ OK: No hay archivos .env en staging${NC}"
fi
echo ""

# ========================================
# 2. Verificar .env en historial de Git
# ========================================
echo "📋 [2/7] Verificando .env en historial de Git..."
if git log --all --oneline -- "*/.env" "**/.env" ".env" 2>/dev/null | head -1; then
    echo -e "${RED}❌ ERROR: .env encontrado en historial de Git!${NC}"
    echo "   Acción requerida: Limpiar historial o rotar credenciales"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ OK: .env no está en historial${NC}"
fi
echo ""

# ========================================
# 3. Buscar patrones de secrets en staged files
# ========================================
echo "📋 [3/7] Buscando patrones de secrets en cambios staged..."
if git diff --cached | grep -E "gsk_[a-zA-Z0-9]{20,}|sk-[a-zA-Z0-9]{20,}|mongodb\+srv://[^:]+:[^@]+@"; then
    echo -e "${RED}❌ ERROR: Posibles secrets detectados en cambios!${NC}"
    echo "   Revisa los archivos marcados arriba"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ OK: No se detectaron secrets en staged files${NC}"
fi
echo ""

# ========================================
# 4. Verificar que .gitignore contenga .env
# ========================================
echo "📋 [4/7] Verificando .gitignore..."
if grep -q "^\.env$" .gitignore && grep -q "^\.env$" backend/.gitignore; then
    echo -e "${GREEN}✅ OK: .env está en .gitignore${NC}"
else
    echo -e "${RED}❌ ERROR: .env NO está en .gitignore!${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# ========================================
# 5. Verificar que existan .env.example
# ========================================
echo "📋 [5/7] Verificando .env.example..."
if [ -f "backend/.env.example" ] && [ -f "frontend/.env.example" ]; then
    echo -e "${GREEN}✅ OK: .env.example existen${NC}"
    
    # Verificar que no contengan valores reales
    if grep -E "gsk_[a-zA-Z0-9]{20,}|mongodb\+srv://[^:]+:[^@]+@cluster" backend/.env.example; then
        echo -e "${RED}❌ ERROR: .env.example contiene credenciales reales!${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ OK: .env.example sin credenciales reales${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  ADVERTENCIA: Falta algún .env.example${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ========================================
# 6. Buscar TODO/FIXME relacionados con seguridad
# ========================================
echo "📋 [6/7] Buscando TODOs de seguridad..."
if git diff --cached | grep -i "TODO.*\(security\|secret\|password\|key\)"; then
    echo -e "${YELLOW}⚠️  ADVERTENCIA: TODOs de seguridad pendientes${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ OK: No hay TODOs de seguridad pendientes${NC}"
fi
echo ""

# ========================================
# 7. Verificar dependencias vulnerables
# ========================================
echo "📋 [7/7] Verificando dependencias (npm audit)..."
cd backend
if npm audit --audit-level=high 2>&1 | grep -q "found 0 vulnerabilities"; then
    echo -e "${GREEN}✅ OK: Sin vulnerabilidades de alto riesgo${NC}"
else
    echo -e "${YELLOW}⚠️  ADVERTENCIA: Ejecuta 'npm audit fix' en backend${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
cd ..
echo ""

# ========================================
# Resumen
# ========================================
echo "========================================"
echo "📊 RESUMEN DE AUDITORÍA"
echo "========================================"
echo -e "Errores críticos: ${RED}${ERRORS}${NC}"
echo -e "Advertencias: ${YELLOW}${WARNINGS}${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ AUDITORÍA FALLIDA${NC}"
    echo ""
    echo "⛔ NO HAGAS PUSH hasta resolver los errores críticos."
    echo ""
    echo "📚 Para más información, consulta:"
    echo "   - SECURITY-AUDIT.md"
    echo "   - SECURITY.md"
    exit 1
else
    echo -e "${GREEN}✅ AUDITORÍA PASADA${NC}"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Hay ${WARNINGS} advertencia(s). Revísalas antes de continuar.${NC}"
        echo ""
    fi
    echo "✅ Es SEGURO hacer push a GitHub"
    echo ""
    echo "📋 Pasos siguientes recomendados:"
    echo "   1. git push origin main"
    echo "   2. Habilitar GitHub Secret Scanning"
    echo "   3. Habilitar Dependabot"
    echo "   4. Configurar branch protection"
    exit 0
fi
