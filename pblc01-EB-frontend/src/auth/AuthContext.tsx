import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UsuarioLogado {
  email: string;
  tipo: string;
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  usuario: UsuarioLogado | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodificarToken(token: string | null): UsuarioLogado | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [usuario, setUsuario] = useState<UsuarioLogado | null>(() =>
    decodificarToken(localStorage.getItem('token'))
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    setUsuario(decodificarToken(token));
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, usuario, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}