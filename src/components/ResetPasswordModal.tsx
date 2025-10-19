import { useState, useEffect } from "react";
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
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { createClient } from "../utils/supabase/client";

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ResetPasswordModal({ 
  open, 
  onClose,
  onSuccess 
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  // Limpar formulário quando o modal abrir
  useEffect(() => {
    if (open) {
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setPasswordResetSuccess(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "A senha deve ter no mínimo 6 caracteres";
    }
    if (password.length > 72) {
      return "A senha deve ter no máximo 72 caracteres";
    }
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      // Validações
      if (!newPassword || !confirmPassword) {
        throw new Error("Por favor, preencha todos os campos");
      }

      // Validar formato da senha
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        throw new Error(passwordError);
      }

      // Verificar se as senhas são iguais
      if (newPassword !== confirmPassword) {
        throw new Error("As senhas não coincidem");
      }

      console.log("🔐 Atualizando senha...");

      const supabase = createClient();

      // Atualizar a senha do usuário
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error("❌ Erro ao atualizar senha:", updateError);
        throw new Error(updateError.message);
      }

      console.log("✅ Senha atualizada com sucesso!");

      setPasswordResetSuccess(true);
      
      toast.success("Senha alterada!", {
        description: "Sua senha foi atualizada com sucesso"
      });

      // Aguardar um momento para o usuário ver a mensagem
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error("❌ Erro ao redefinir senha:", err);

      let errorMessage = "Erro ao redefinir senha";

      if (err.message?.toLowerCase().includes("password")) {
        errorMessage = err.message;
      } else if (err.message?.toLowerCase().includes("token")) {
        errorMessage = "Link expirado ou inválido. Solicite um novo link de recuperação.";
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
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setPasswordResetSuccess(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="reset-password-description">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <DialogTitle>Redefinir Senha</DialogTitle>
          </div>
          <DialogDescription id="reset-password-description">
            {passwordResetSuccess 
              ? "Senha alterada com sucesso!"
              : "Crie uma nova senha para sua conta"
            }
          </DialogDescription>
        </DialogHeader>

        {passwordResetSuccess ? (
          <div className="space-y-4 py-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>✅ Senha atualizada com sucesso!</strong>
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Você já pode fazer login com sua nova senha.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-sm">
                <strong>🔐 Requisitos da senha:</strong>
              </p>
              <ul className="text-xs space-y-1 mt-2 text-muted-foreground">
                <li>• Mínimo de 6 caracteres</li>
                <li>• Use uma senha forte e única</li>
                <li>• Não compartilhe sua senha com ninguém</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Indicador de força da senha */}
            {newPassword && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        newPassword.length < 6 
                          ? "w-1/3 bg-red-500" 
                          : newPassword.length < 10 
                          ? "w-2/3 bg-yellow-500" 
                          : "w-full bg-green-500"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {newPassword.length < 6 
                      ? "Fraca" 
                      : newPassword.length < 10 
                      ? "Média" 
                      : "Forte"
                    }
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Redefinir Senha
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Após redefinir, você poderá fazer login com a nova senha.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
