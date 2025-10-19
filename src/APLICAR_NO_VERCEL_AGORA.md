# 🚀 APLICAR SISTEMA DE ANÚNCIOS NO VERCEL - PASSO A PASSO

## ⚡ MUDANÇAS NECESSÁRIAS (RESUMO)

### **3 arquivos foram modificados:**

1. ✅ `/components/Ads.tsx` - Adicionado WhatsApp e verificação de admin
2. ✅ `/components/CreateAdModal.tsx` - Adicionado WhatsApp no modal
3. ✅ `/lib/api.ts` - Corrigido endpoint de invitations

---

## 📝 OPÇÃO 1: COPIAR E COLAR (MAIS FÁCIL)

### **Arquivo 1: `/components/Ads.tsx`**

**Localizar linha 29-39** e substituir por:

```tsx
  async function checkAdminStatus() {
    try {
      // Verificar diretamente o email do usuário logado
      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email === 'eri.2113@gmail.com') {
        setIsAdmin(true);
        console.log('✅ Admin detectado:', session.user.email);
      } else {
        setIsAdmin(false);
        console.log('✅ Usuário normal:', session?.user?.email || 'não logado');
      }
    } catch (error) {
      console.error("Erro ao verificar status admin:", error);
      setIsAdmin(false);
    } finally {
      setCheckingAdmin(false);
    }
  }
```

**Localizar linha 97-108** (dentro da primeira Alert) e substituir por:

```tsx
          <TabsContent value="info" className="space-y-6">
            {/* Promoção */}
            <Alert className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <Sparkles className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-base">
                <strong className="text-lg">🎉 Promoção de Lançamento!</strong>
                <p className="mt-2">
                  Anuncie seu negócio <strong>100% GRÁTIS</strong> durante nosso
                  período de divulgação! Seja uma das primeiras empresas a alcançar
                  milhares de atletas, times e fãs de vôlei em todo o Brasil.
                </p>
                <p className="mt-3 pt-3 border-t border-green-300">
                  <strong>📱 Dúvidas?</strong> Entre em contato pelo WhatsApp:{" "}
                  <a 
                    href="https://wa.me/5562920004301" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-green-700 hover:text-green-800 underline"
                  >
                    (62) 92000-4301
                  </a>
                </p>
              </AlertDescription>
            </Alert>
```

---

### **Arquivo 2: `/components/CreateAdModal.tsx`**

**Localizar linha 167-169** (DialogDescription) e substituir por:

```tsx
          <DialogDescription id="create-ad-description">
            Divulgue seu produto ou serviço gratuitamente durante o período de lançamento!
            <br />
            <span className="text-sm">
              Dúvidas? WhatsApp:{" "}
              <a 
                href="https://wa.me/5562920004301" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                (62) 92000-4301
              </a>
            </span>
          </DialogDescription>
```

---

### **Arquivo 3: `/lib/api.ts`**

**Localizar linha 628** e corrigir:

**ANTES:**
```tsx
return await apiCall('/invitations/me');
```

**DEPOIS:**
```tsx
return await apiCall('/invitations');
```

---

## 🎯 OPÇÃO 2: GITHUB CODESPACES (RECOMENDADO)

### **Passo 1: Abrir Codespaces**
1. Vá para seu repositório no GitHub
2. Clique em **"Code"** → **"Codespaces"**
3. Clique em **"Create codespace on main"**
4. Aguarde carregar (1-2 minutos)

### **Passo 2: Editar Arquivos**
1. No VS Code do Codespaces, abra cada arquivo:
   - `components/Ads.tsx`
   - `components/CreateAdModal.tsx`
   - `lib/api.ts`

2. Aplique as mudanças acima (copiar e colar)

### **Passo 3: Salvar e Publicar**

No terminal do Codespaces, execute:

```bash
git add .
git commit -m "feat: Sistema de anúncios com WhatsApp (62) 92000-4301"
git push origin main
```

### **Passo 4: Aguardar Deploy**
- O Vercel detecta automaticamente
- Deploy acontece em 2-3 minutos
- Você recebe notificação quando concluir

---

## 🖥️ OPÇÃO 3: EDITAR DIRETO NO GITHUB

### **Para cada arquivo:**

1. **Abra o arquivo no GitHub:**
   - `components/Ads.tsx`
   - `components/CreateAdModal.tsx`
   - `lib/api.ts`

2. **Clique no ícone de lápis** (✏️ Edit this file)

3. **Aplique as mudanças** (copiar e colar os códigos acima)

4. **Clique em "Commit changes"**

5. **Vercel faz deploy automático!**

---

## ✅ VERIFICAR SE FUNCIONOU

### **Após deploy:**

1. **Abra seu site:** https://volleypro-zw96.vercel.app

2. **Faça login com email normal** (não admin)

3. **Clique em "📣 Anúncios"**

4. **Você DEVE ver:**
   - ✅ Botão "Criar Anúncio Grátis"
   - ✅ WhatsApp (62) 92000-4301 na página
   - ✅ Abas: Informações | Benefícios

5. **Clique em "Criar Anúncio Grátis"**

6. **Você DEVE ver:**
   - ✅ Modal com formulário
   - ✅ WhatsApp (62) 92000-4301 no modal
   - ✅ Todos os campos para preencher

7. **Faça login como admin** (eri.2113@gmail.com)

8. **Clique em "📣 Anúncios"**

9. **Você DEVE ver:**
   - ✅ Painel administrativo
   - ✅ Cards de estatísticas
   - ❌ SEM botão "Criar Anúncio"

---

## 📱 INFORMAÇÕES ADICIONADAS

**WhatsApp:** (62) 92000-4301  
**Link:** https://wa.me/5562920004301

**Aparece em:**
1. ✅ Página de Anúncios (banner verde)
2. ✅ Modal de criação de anúncio

---

## 🐛 SE DER ERRO

### **"Erro de sintaxe" ou "Build failed":**

1. Verifique se copiou o código completo
2. Verifique se não faltou nenhuma chave `{` ou `}`
3. Confira se as aspas estão corretas

### **"Ainda vejo painel admin para todos":**

1. Limpe cache do navegador (Ctrl+Shift+Del)
2. Faça logout e login novamente
3. Verifique se está usando o email correto

### **"Link do WhatsApp não funciona":**

1. Verifique se copiou o link completo
2. Teste o link diretamente: https://wa.me/5562920004301

---

## 📊 CHECKLIST FINAL

Antes de considerar pronto:

- [ ] Mudanças aplicadas nos 3 arquivos
- [ ] Commit feito
- [ ] Push para GitHub feito
- [ ] Deploy do Vercel concluído
- [ ] Testado com usuário normal
- [ ] Testado com admin (eri.2113@gmail.com)
- [ ] WhatsApp aparece em 2 lugares
- [ ] Links do WhatsApp funcionam
- [ ] Modal abre e fecha
- [ ] Painel admin aparece só para eri.2113@gmail.com

---

## 🎊 TUDO PRONTO!

Agora seu sistema de anúncios está:

✅ Funcionando para usuários normais  
✅ Funcionando para admin  
✅ Com WhatsApp para contato  
✅ Publicado em produção  
✅ Pronto para receber anunciantes!

**Divulgue o número:** **(62) 92000-4301**

---

## 📞 PRÓXIMOS PASSOS

1. Teste tudo no site publicado
2. Compartilhe o link com potenciais anunciantes
3. Monitore os anúncios pendentes
4. Aprove/rejeite conforme necessário

**Boa sorte com os anúncios! 🚀📣**
