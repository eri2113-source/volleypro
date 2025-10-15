// ============================================
// ADICIONAR ESTE CÓDIGO NO FINAL DO Feed.tsx
// ANTES DO FECHAMENTO DO </div> PRINCIPAL
// ============================================

{/* Modal de Compartilhamento (já existe) */}
{/* ... código existente de ShareDialog ... */}

{/* NOVO: Modal de Inspiração de Conteúdo */}
<ContentInspirationModal
  open={showInspirationModal}
  onClose={() => setShowInspirationModal(false)}
  onUseTemplate={(template) => {
    setNewPost(template);
    toast.success("Template aplicado! ✨", {
      description: "Personalize e publique seu conteúdo"
    });
  }}
/>

// ============================================
// FIM DO CÓDIGO A ADICIONAR
// ============================================

// INSTRUÇÕES:
// 1. Abra /components/Feed.tsx
// 2. Role até o final do componente (antes do último </div>)
// 3. Adicione este código após o Dialog de compartilhamento existente
// 4. Salve o arquivo
// 5. O botão "Inspiração" já está funcionando!

// LOCALIZAÇÃO EXATA:
// Procure por algo como:
//   </Dialog> {/* Share Dialog */}
// </div>  {/* Container principal */}
// );
// }

// E adicione o código entre o </Dialog> e o </div>
