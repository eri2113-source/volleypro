# 📋 CÓDIGO PARA COPIAR E COLAR - Aviso de Migração

## 🎯 SUPER RÁPIDO - APENAS 2 EDIÇÕES

---

## ✅ PASSO 1: EDITAR APP.TSX

Abra `/App.tsx` no Codespaces.

### **1.1 - Adicionar import (topo do arquivo, com outros imports)**

Procure onde tem:
```typescript
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CacheBuster } from "./components/CacheBuster";
```

Logo abaixo, adicione:

```typescript
import { MigrationNotice } from "./components/MigrationNotice";
```

### **1.2 - Adicionar componente no return**

Procure no código onde tem o return principal (geralmente linha ~380-400).

**Encontre isto:**
```typescript
return (
  <ErrorBoundary>
    <CacheBuster />
```

**Mude para isto:**
```typescript
return (
  <ErrorBoundary>
    <MigrationNotice />
    <CacheBuster />
```

**OU se preferir antes do ErrorBoundary:**

**Encontre isto:**
```typescript
return (
  <ErrorBoundary>
```

**Mude para isto:**
```typescript
return (
  <>
    <MigrationNotice />
    <ErrorBoundary>
```

E no final do return, antes do último parêntese, adicione:
```typescript
    </ErrorBoundary>
  </>
);
```

---

## ✅ PASSO 2: SALVAR E PUBLICAR

### **Salvar:**
```
Ctrl + S (Windows/Linux)
Cmd + S (Mac)
```

### **Publicar:**
```bash
bash publicar.sh
```

### **Aguardar:**
```
5 minutos
```

### **Testar:**
```
https://easing-spice-52755640.figma.site
```

---

## 🎨 PRÉVIA DO CÓDIGO COMPLETO

### **ARQUIVO: App.tsx (parte relevante)**

```typescript
// Imports no topo (adicionar junto com os outros)
import { ErrorBoundary } from "./components/ErrorBoundary";
import { CacheBuster } from "./components/CacheBuster";
import { MigrationNotice } from "./components/MigrationNotice"; // ← ADICIONAR ESTA LINHA

// ... resto dos imports ...

export default function App() {
  // ... todo código existente ...
  
  // No return principal
  return (
    <>
      {/* AVISO DE MIGRAÇÃO */}
      <MigrationNotice />
      
      {/* Resto da aplicação */}
      <ErrorBoundary>
        <CacheBuster />
        <SidebarProvider>
          {/* ... código existente ... */}
        </SidebarProvider>
      </ErrorBoundary>
    </>
  );
}
```

---

## 🚀 ALTERNATIVA: CÓDIGO INLINE (SE DER PROBLEMA DE IMPORT)

Se por algum motivo o import não funcionar, você pode adicionar o componente diretamente no App.tsx:

### **Adicionar ANTES do export default function App():**

```typescript
// Componente de aviso de migração
function MigrationNotice() {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const wasDismissed = localStorage.getItem('migration-notice-dismissed');
    if (wasDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('migration-notice-dismissed', 'true');
    setIsVisible(false);
  };

  const handleGoToNewSite = () => {
    window.location.href = 'https://volleypro-zw96.vercel.app';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card border-2 border-primary shadow-2xl rounded-lg p-6 sm:p-8 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted"
        >
          ✕
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">🚀 VolleyPro Evoluiu!</h2>
            <p className="text-muted-foreground">
              Importante: O site mudou de endereço
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
              Período de Testes Encerrado
            </h3>
            <div className="text-blue-800 dark:text-blue-200 text-sm space-y-2">
              <p>O período de testes no Figma Make foi encerrado com sucesso! 🎉</p>
              <p>Agora o <strong>VolleyPro</strong> está rodando em infraestrutura profissional.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Novo endereço oficial:
            </p>
            <div className="bg-white dark:bg-gray-900 rounded-md p-3 border">
              <code className="text-sm font-mono text-primary break-all">
                https://volleypro-zw96.vercel.app
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium">O que mudou para melhor:</p>
            <div className="grid gap-2 text-sm">
              <div className="flex gap-2">
                <span className="text-green-500">✅</span>
                <span><strong>10x mais rápido</strong> - Carregamento ultrarrápido</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500">✅</span>
                <span><strong>PWA instalável</strong> - Use como app no celular</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500">✅</span>
                <span><strong>Backup automático</strong> - Dados sempre seguros</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500">✅</span>
                <span><strong>Infraestrutura profissional</strong> - Mais estabilidade</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoToNewSite}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90"
            >
              Ir para o Novo Site →
            </button>
            <button
              onClick={handleDismiss}
              className="border px-6 py-3 rounded-lg hover:bg-muted"
            >
              Continuar Aqui
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            💡 Salve o novo endereço nos seus favoritos!
          </p>
        </div>
      </div>
    </div>
  );
}

// Depois vem o export default function App()
export default function App() {
  // ... código existente ...
```

---

## 📝 RESUMO ULTRA RÁPIDO

**2 coisas para fazer:**

1. **Adicionar import:**
   ```typescript
   import { MigrationNotice } from "./components/MigrationNotice";
   ```

2. **Adicionar componente:**
   ```typescript
   <MigrationNotice />
   ```

**Publicar:**
```bash
bash publicar.sh
```

**PRONTO! 🎉**

---

## ✅ CHECKLIST FINAL

- [ ] Abri Codespaces
- [ ] Abri App.tsx
- [ ] Adicionei import do MigrationNotice
- [ ] Adicionei <MigrationNotice /> no return
- [ ] Salvei (Ctrl+S)
- [ ] Executei bash publicar.sh
- [ ] Aguardei 5 minutos
- [ ] Testei no site Figma
- [ ] Aviso apareceu! ✅

---

**É SÓ ISSO! Simples e rápido! 🚀**
