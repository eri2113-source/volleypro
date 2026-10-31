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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { authApi } from "../lib/api";
import { Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { trackSignUp, trackLogin } from "../utils/googleTagManager";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Sign up state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [userType, setUserType] = useState<"athlete" | "team" | "fan">("fan");
  const [position, setPosition] = useState("");
  const [city, setCity] = useState("");

  // Sign in state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Reset states when modal opens/closes
  useEffect(() => {
    if (open) {
      setError("");
      setLoading(false);
      setShowForgotPassword(false); // Garantir que o modal de recuperação está fechado
    } else {
      // Limpar formulários ao fechar
      setTimeout(() => {
        setSignUpEmail("");
        setSignUpPassword("");
        setSignUpName("");
        setPosition("");
        setCity("");
        setSignInEmail("");
        setSignInPassword("");
        setError("");
        setShowForgotPassword(false);
      }, 300);
    }
  }, [open]);

  // Reset error when switching tabs or changing user type
  useEffect(() => {
    setError("");
  }, [activeTab, userType]);

  const handleSignUp = async () => {
    console.log("🚀 [Chrome-Optimized] Iniciando cadastro...");
    setError("");
    setLoading(true);

    try {
      // Validações
      if (!signUpEmail || !signUpPassword) {
        throw new Error("Por favor, preencha email e senha");
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signUpEmail)) {
        throw new Error("Email inválido. Use um email válido.");
      }

      if (signUpPassword.length < 8) {
        throw new Error("A senha deve ter no mínimo 8 caracteres");
      }

      // Nome padrão derivado do email
      const defaultName = signUpEmail.split('@')[0];
      const additionalData: any = {};

      console.log("📝 Criando usuário...", { email: signUpEmail });

      // Criar usuário com tipo padrão "fan" (será definido no perfil depois)
      const signUpResult = await authApi.signUp(
        signUpEmail.trim().toLowerCase(),
        signUpPassword,
        defaultName,
        "fan",
        additionalData
      );

      console.log("✅ Cadastro recebido; aguardando confirmação por email.");

      // Email verification is required; do not attempt a password login before confirmation.
      // Mostrar toast de sucesso
      toast.success('Confira sua caixa de entrada', {
        description: "Confirme seu email antes de entrar na conta."
      });

      // Aguardar um pouco para garantir que tudo foi salvo
      await new Promise(resolve => setTimeout(resolve, 500));

      // Chamar callbacks
      // Registration is pending email confirmation; keep the user unauthenticated.
      // Fechar modal após pequeno delay
      setTimeout(() => {
        onClose();
      }, 300);

      // Track sign up (conversão importante!)
      trackSignUp('email');

    } catch (err: any) {
      console.error("❌ Erro no cadastro:", err);

      // Mensagens de erro amigáveis
      let errorMessage = "Erro ao criar conta. Por favor, tente novamente.";

      if (err.message?.toLowerCase().includes("user already registered") || 
          err.message?.toLowerCase().includes("already registered")) {
        errorMessage = "Este email já está cadastrado. Tente fazer login.";
        // Mudar para aba de login
        setTimeout(() => setActiveTab("signin"), 1500);
      } else if (err.message?.toLowerCase().includes("invalid email")) {
        errorMessage = "Email inválido. Verifique o formato do email.";
      } else if (err.message?.toLowerCase().includes("password")) {
        errorMessage = "A senha deve ter no mínimo 8 caracteres.";
      } else if (err.message?.toLowerCase().includes("network") || 
                 err.message?.toLowerCase().includes("fetch")) {
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

  const handleSignIn = async () => {
    console.log("🔐 [Chrome-Optimized] Iniciando login...");
    console.log("📝 Email:", signInEmail, "| Senha length:", signInPassword?.length);
    setError("");
    setLoading(true);

    try {
      if (!signInEmail || !signInPassword) {
        console.error("❌ Campos vazios - Email:", !!signInEmail, "| Senha:", !!signInPassword);
        throw new Error("Por favor, preencha email e senha");
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signInEmail)) {
        throw new Error("Email inválido");
      }

      console.log("📧 Fazendo login com:", signInEmail);

      const result = await authApi.signIn(
        signInEmail.trim().toLowerCase(),
        signInPassword
      );

      console.log("✅ Login concluído!");

      // Mostrar toast de sucesso
      toast.success("🏐 Login realizado com sucesso!", {
        description: "Bem-vindo de volta ao VolleyPro!"
      });

      // Aguardar um pouco para garantir que tudo foi salvo
      await new Promise(resolve => setTimeout(resolve, 500));

      // Chamar callbacks
      onSuccess();
      
      // Fechar modal após pequeno delay
      setTimeout(() => {
        onClose();
      }, 300);

      // Track login (conversão!)
      trackLogin('email');

    } catch (err: any) {
      console.error("❌ Erro no login:", err);

      // Mensagens de erro amigáveis
      let errorMessage = "Erro ao fazer login.";

      if (err.message?.toLowerCase().includes("invalid") || 
          err.message?.toLowerCase().includes("credentials")) {
        errorMessage = "Email ou senha incorretos. Verifique suas credenciais.";
      } else if (err.message?.toLowerCase().includes("not confirmed")) {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
      } else if (err.message?.toLowerCase().includes("network") || 
                 err.message?.toLowerCase().includes("fetch")) {
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

  // 🛡️ Proteção contra erros de removeChild - não criar novos elementos no DOM
  try {
    return (
      <>
        <ForgotPasswordModal
          open={showForgotPassword && !loading}
          onClose={() => setShowForgotPassword(false)}
        />
        
        {!showForgotPassword && (
        <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" aria-describedby="auth-description">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <DialogTitle>VolleyPro</DialogTitle>
            </div>
            <DialogDescription id="auth-description">
              Entre ou crie sua conta para acessar a rede social do vôlei
            </DialogDescription>
          </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <p className="text-sm text-primary">
                💡 <strong>Primeira vez?</strong> Clique em "Criar Conta" acima
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="seu@email.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSignIn()}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password">Senha</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSignIn()}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleSignIn}
              disabled={loading || !signInEmail || !signInPassword}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:underline"
                disabled={loading}
              >
                Esqueci minha senha
              </button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Não tem uma conta? Clique em "Criar Conta" acima.
            </p>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20 rounded-lg p-3">
              <p className="text-sm">
                🏐 <strong>Junte-se ao VolleyPro!</strong> Crie sua conta gratuitamente!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                💡 Defina seu tipo de conta (atleta, time, fã, árbitro, federação) depois no perfil
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="seu@email.com"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
              <p className="text-xs text-amber-600 dark:text-amber-500 flex items-start gap-1">
                <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                <span>⚠️ Use email REAL. Emails falsos podem causar bloqueio.</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Senha (mínimo 8 caracteres)</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              onClick={handleSignUp}
              disabled={loading || !signUpEmail || !signUpPassword}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando conta...
                </div>
              ) : (
                "Criar Conta"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Já tem uma conta? Clique em "Entrar" acima.
            </p>
          </TabsContent>
        </Tabs>
        </DialogContent>
      </Dialog>
        )}
      </>
    );
  } catch (error) {
    // 🔴 Em caso de erro, retornar null ao invés de criar novos elementos
    console.error("🔴 Erro ao renderizar AuthModal:", error);
    return null;
  }
}