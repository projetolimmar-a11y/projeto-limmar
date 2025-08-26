import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost/backend/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `cpf=${cpf}&password=${password}`
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("Erro ao conectar ao servidor."));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Login
        </h1>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg"
        >
          Entrar
        </button>
        <p className="text-center mt-4">
          Não tem conta?{" "}
          <a href="/register" className="text-blue-600 font-semibold">
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  );
}
