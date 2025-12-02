import React, { useState } from "react";
import './LoginScreen.css';
import Logo from "../assets/react.svg";
import { validateCPF } from "../utils/helpers";

function LoginScreen({ onLogin, onSwitchToRegister }) {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!cpf) {
      setError("CPF é obrigatório");
      return;
    }

    if (!password) {
      setError("Senha é obrigatória");
      return;
    }

    if (password.trim() === '') {
      setError("Senha não pode ser apenas espaços em branco");
      return;
    }

    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      return;
    }

    // Mostra feedback de carregamento
    setError("");
    setIsLoading(true);
    
    // Tenta fazer login
    try {
      const result = await onLogin(cpf.replace(/\D/g, ""), password);
      
      // Se result é true, login foi bem sucedido
      // Se é uma string, é uma mensagem de erro
      if (result !== true) {
        setError(result || "Erro ao tentar fazer login");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Erro ao tentar fazer login. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0f1a 0%, #23282e 60%, #0a0f1a 100%), linear-gradient(90deg, transparent 0%, rgba(93,223,255,0.04) 50%, transparent 100%), linear-gradient(0deg, rgba(93,223,255,0.02) 0%, transparent 100%)',
      backgroundAttachment: 'fixed',
      position: 'relative',
      borderRadius: 18,
      boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1.5px #5ddfff',
      padding: 0,
    }}>
      <div className="auth-logo-container">
        <img src={Logo} alt="Limmar Logo" className="auth-logo" />
      </div>
      <div className="auth-card">
        <h2 className="auth-title">Login no Sistema</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="cpf" className="form-label">
              <span className="label-icon">◆</span>
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              className="form-control"
              value={cpf}
              onChange={(e) => {
                if (!e.target.value) {
                  setCpf('');
                  return;
                }
                const value = e.target.value.replace(/\D/g, '');
                let formattedValue = value;
                if (value.length > 3) formattedValue = value.replace(/^(\d{3})/, '$1.');
                if (value.length > 6) formattedValue = formattedValue.replace(/^(\d{3}\.)(\d{3})/, '$1$2.');
                if (value.length > 9) formattedValue = formattedValue.replace(/^(\d{3}\.\d{3}\.)(\d{3})/, '$1$2-');
                setCpf(formattedValue);
              }}
              placeholder="000.000.000-00"
              maxLength="14"
              inputMode="numeric"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <span className="label-icon">◆</span>
              Senha
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}
          <button type="submit" className="btn-block" disabled={isLoading}>
            <span className="btn-text">
              {isLoading ? '⟳ Entrando...' : '⟶ Entrar'}
            </span>
          </button>
        </form>
        <div className="auth-footer">
          <p className="footer-text">Não tem conta? <button type="button" onClick={onSwitchToRegister} className="btn-link">Cadastre-se aqui</button></p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
