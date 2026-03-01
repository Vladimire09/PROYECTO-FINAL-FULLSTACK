import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const entrar = async (e) => {
    e.preventDefault();

    if (usuario.trim() === "" || password.trim() === "") {
      return alert("Completa los campos.");
    }

    try {
      const respuesta = await fetch("https://proyecto-final-fullstack-4pbz.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usuario,
          password: password
        }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        loginUser(data.token, usuario);
        alert(`¡Bienvenido, ${usuario}!`);
        navigate('/');
      } else {
        alert(data.message || "Credenciales incorrectas");
      }

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1a1a24] border-2 border-white rounded-2xl p-8 shadow-2xl">
      
      <h2 className="text-3xl font-bold mb-8 text-[#66b2ff] text-center">
        Ingresa tus datos
      </h2>

      <form onSubmit={entrar} className="flex flex-col gap-6">

        {/* Usuario */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm font-semibold">
            Usuario
          </label>
          <input 
            type="text"
            placeholder="Tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            className="p-3 rounded-lg bg-[#2c353e] border border-gray-500 focus:border-[#66b2ff] outline-none text-white"
          />
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm font-semibold">
            Contraseña
          </label>
          <input 
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded-lg bg-[#2c353e] border border-gray-500 focus:border-[#66b2ff] outline-none text-white"
          />
        </div>

        {/* Botón */}
        <button 
          type="submit"
          className="bg-[#66b2ff] text-[#1e262c] font-bold py-3 rounded-lg hover:bg-white transition-all text-lg shadow-lg"
        >
          Ingresar
        </button>

        {/* Registro */}
        <p className="text-center text-gray-400 text-sm">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-[#66b2ff] hover:underline font-bold"
          >
            Regístrate aquí
          </Link>
        </p>

      </form>
    </div>
  );
}
