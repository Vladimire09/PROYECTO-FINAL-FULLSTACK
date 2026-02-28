import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const entrar = async (e) => {
    e.preventDefault();
    if (usuario.trim() === "" || password.trim() === "") return alert("Completa los campos.");

    try {
      const respuesta = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password: password }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        loginUser(data.token, usuario); // Guardamos en el Contexto global
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
    <div className="flex justify-center mt-20 px-4">
      <div className="w-full max-w-md bg-[#1a1a24] border-2 border-white rounded-xl p-8 text-center shadow-2xl">
        <h3 className="text-white text-2xl font-bold mb-8">Ingresa tus datos</h3>
        <form onSubmit={entrar} className="flex flex-col gap-5 items-center">
          <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} className="w-[85%] px-4 py-3 rounded-md bg-[#2c353e] text-white border border-gray-500 focus:outline-none focus:border-[#66b2ff]" />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-[85%] px-4 py-3 rounded-md bg-[#2c353e] text-white border border-gray-500 focus:outline-none focus:border-[#66b2ff]" />
          <button type="submit" className="mt-6 w-[60%] bg-[#66b2ff] text-[#1e262c] font-bold py-3 rounded-md hover:bg-white transition-all">Ingresar</button>
        </form>
      </div>
    </div>
  );
}