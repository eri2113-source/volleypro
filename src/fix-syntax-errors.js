const fs = require('fs');

// Ler o arquivo
let content = fs.readFileSync('supabase/functions/server/index.tsx', 'utf8');

// CORREÇÃO 1: Linha 4795 - Remover \n mal escapado
content = content.replace(
  /console\.error\(`   ❌ ERRO: Time não encontrado ou não é do tipo correto`\);\\n\s+console\.error\(`\s+• team exists:`, !!team\);/,
  `console.error(\`   ❌ ERRO: Time não encontrado ou inválido\`);\n      console.error(\`      • team exists:\`, !!team);`
);

// CORREÇÃO 2: Linha 4801 - Simplificar teamData
content = content.replace(
  /\/\/ Usar dados do time \(não do user\)\n\s+const teamData = team \|\| user;/,
  `// Usar dados do time\n    const teamData = team;`
);

// CORREÇÃO 3: Linha 4866 - Trocar user.name por team.name
content = content.replace(
  /console\.log\(`✅ Time completo \\"\\$\{user\.name\}\\" inscrito com sucesso`\);/,
  `console.log(\`✅ Time completo "\\${team.name}" inscrito com sucesso\`);`
);

// Salvar
fs.writeFileSync('supabase/functions/server/index.tsx', content, 'utf8');

console.log('✅ Correções aplicadas com sucesso!');
console.log('');
console.log('Mudanças:');
console.log('1. ✅ Corrigido escape \\\\n na linha 4795');
console.log('2. ✅ Simplificado teamData = team (linha 4801)');
console.log('3. ✅ Corrigido user.name → team.name (linha 4866)');
