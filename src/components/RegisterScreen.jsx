import React, { useState } from "react";
import './RegisterScreen.css';
import Logo from "../assets/react.svg";
import { validateCPF } from "../utils/helpers";

function RegisterScreen({ onRegister, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !cpf || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    // Validar nome
    if (name.trim().length < 3) {
      setError("Nome deve ter no mínimo 3 caracteres");
      return;
    }
    if (!/^[a-zA-ZÀ-ÿ\s]*$/.test(name)) {
      setError("Nome deve conter apenas letras");
      return;
    }

    // Validar senha
    if (password.length < 8) {
      setError("Senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setError("Senha deve conter letras");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Senha deve conter números");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Senha deve conter caracteres especiais");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    // Validar CPF
    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      return;
    }

    Promise.resolve(onRegister(name, cpf.replace(/\D/g, ""), password, confirmPassword)).then((ok) => {
      // onRegister now may return: true (success), a string (error message) or falsy
      if (ok === true) {
        setSuccess("Cadastro realizado com sucesso! Redirecionando para o login...");
        // Limpa os campos do formulário
        setName("");
        setCpf("");
        setPassword("");
        setConfirmPassword("");
        // Redireciona para o login após 2 segundos
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else if (typeof ok === 'string' && ok.length) {
        setError(ok);
      } else {
        setError("Erro ao realizar cadastro");
      }
    });
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
        <h2 className="auth-title">Cadastro de Usuário</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <span className="label-icon">◆</span>
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="João Silva"
            />
          </div>
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
            <small className="form-hint">Mín. 8 caracteres, letras, números e símbolos</small>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <span className="label-icon">◆</span>
              Confirmar Senha
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}
          {success && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              {success}
            </div>
          )}
          <button type="submit" className="btn-block">
            <span className="btn-text">⟶ Cadastrar</span>
          </button>
        </form>
        <div className="auth-footer">
          <p className="footer-text">Já tem uma conta? <button type="button" onClick={onSwitchToLogin} className="btn-link">Faça login</button></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
