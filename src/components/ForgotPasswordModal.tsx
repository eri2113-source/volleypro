import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { createClient } from "../utils/supabase/client";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      // Validar email
      if (!email) {
        throw new Error("Por favor, informe seu email");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Email inválido");
      }

      console.log("📧 Enviando email de recuperação para:", email);

      const supabase = createClient();

      // Enviar email de recuperação
      // O Supabase vai enviar um email com um link que redireciona para o site
      // com um token na URL (formato: /reset-password#access_token=...)
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/#reset-password`,
        }
      );

      if (resetError) {
        console.error("❌ Erro ao enviar email:", resetError);
        throw new Error(resetError.message);
      }

      console.log("✅ Email de recuperação enviado com sucesso!");
      
      setEmailSent(true);
      toast.success("Email enviado!", {
        description: "Verifique sua caixa de entrada"
      });

    } catch (err: any) {
      console.error("❌ Erro ao recuperar senha:", err);

      let errorMessage = "Erro ao enviar email de recuperação";

      if (err.message?.toLowerCase().includes("email")) {
        errorMessage = "Email inválido ou não cadastrado";
      } else if (err.message?.toLowerCase().includes("network")) {
        errorMessage = "Erro de conexão. Verifique sua internet.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setEmailSent(false);
    setError("");
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="forgot-password-description">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <DialogTitle>Recuperar Senha</DialogTitle>
          </div>
          <DialogDescription id="forgot-password-description">
            {emailSent 
              ? "Email enviado com sucesso!"
              : "Informe seu email para receber o link de recuperação"
            }
          </DialogDescription>
        </DialogHeader>

        {emailSent ? (
          <div className="space-y-4 py-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Email enviado para:</strong>
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {email}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✅ Verifique sua caixa de entrada e spam
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    📧 Clique no link do email para redefinir sua senha
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ⏰ O link é válido por 1 hora
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <strong>💡 Dica:</strong> Se não receber o email em alguns minutos, 
                verifique a pasta de spam ou tente novamente.
              </p>
            </div>

            <Button 
              className="w-full" 
              onClick={handleClose}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Login
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-sm">
                <strong>📧 Como funciona:</strong>
              </p>
              <ul className="text-xs space-y-1 mt-2 text-muted-foreground">
                <li>1. Informe o email cadastrado</li>
                <li>2. Você receberá um link por email</li>
                <li>3. Clique no link para criar uma nova senha</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recovery-email">Email cadastrado</Label>
              <Input
                id="recovery-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
                disabled={loading}
                autoComplete="email"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading || !email}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Link de Recuperação
                  </>
                )}
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Lembrou sua senha? Volte e faça login normalmente.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
