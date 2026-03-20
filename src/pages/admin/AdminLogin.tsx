import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Smartphone, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!email.trim() || !password.trim()) {
      setLocalError('Preencha todos os campos');
      return;
    }
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      // error is set in context
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <Smartphone className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Erick Imports</h1>
          <p className="text-sm text-muted-foreground">Acesse a área administrativa</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@erickimports.com"
              className="w-full h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Senha</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 rounded-lg border border-border bg-card px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {displayError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
              <p className="text-xs text-red-400">{displayError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button
            type="button"
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Esqueci minha senha
          </button>
        </form>

        {/* Dev hint */}
        <div className="rounded-lg bg-muted/50 border border-border px-3 py-2">
          <p className="text-[10px] text-muted-foreground text-center">
            Dev: admin@erickimports.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
