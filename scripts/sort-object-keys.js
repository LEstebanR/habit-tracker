#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para ordenar las claves de un objeto recursivamente
function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  
  if (obj !== null && typeof obj === 'object') {
    const sortedObj = {};
    const keys = Object.keys(obj).sort();
    
    for (const key of keys) {
      sortedObj[key] = sortObjectKeys(obj[key]);
    }
    
    return sortedObj;
  }
  
  return obj;
}

// Función para procesar archivos TypeScript/JavaScript
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar objetos en el código usando regex (esto es una aproximación)
    const objectRegex = /const\s+(\w+)\s*=\s*\{([^}]+)\}/g;
    let match;
    let modifiedContent = content;
    
    while ((match = objectRegex.exec(content)) !== null) {
      const [fullMatch, varName, objectContent] = match;
      
      try {
        // Intentar parsear el objeto como JSON (esto es limitado)
        const objectStr = `{${objectContent}}`;
        const obj = eval(`(${objectStr})`);
        const sortedObj = sortObjectKeys(obj);
        
        // Reemplazar en el contenido
        const sortedStr = JSON.stringify(sortedObj, null, 2)
          .replace(/"/g, "'")
          .replace(/'/g, '"');
        
        modifiedContent = modifiedContent.replace(fullMatch, `const ${varName} = ${sortedStr}`);
      } catch (e) {
        // Si no se puede parsear, continuar
        console.warn(`No se pudo procesar el objeto en ${filePath}: ${e.message}`);
      }
    }
    
    if (modifiedContent !== content) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      console.log(`✅ Procesado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Uso: node scripts/sort-object-keys.js <archivo1> [archivo2] ...');
    console.log('Ejemplo: node scripts/sort-object-keys.js src/components/*.tsx');
    process.exit(1);
  }
  
  args.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      processFile(filePath);
    } else {
      console.warn(`⚠️  Archivo no encontrado: ${filePath}`);
    }
  });
}

main();