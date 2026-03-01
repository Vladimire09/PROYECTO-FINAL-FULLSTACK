
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
  const [datos, setDatos] = useState({ nombre: '', email: '', password: '' });
  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://proyecto-final-fullstack-4pbz.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: datos.nombre,
          email: datos.email,
          password: datos.password
        })
      });

      if (res.ok) {
        alert("¡Cuenta creada!");
        navigate('/login');
      } else {
        alert("Error al registrar");
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1a1a24] border-2 border-white rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 text-[#66b2ff] text-center">
        Crear Cuenta
      </h2>

      <form onSubmit={manejarRegistro} className="flex flex-col gap-6">

        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm font-semibold">
            Nombre de Usuario
          </label>
          <input
            type="text"
            placeholder="Tu apodo gaming"
            value={datos.nombre}
            onChange={e => setDatos({ ...datos, nombre: e.target.value })}
            required
            className="p-3 rounded-lg bg-[#2c353e] border border-gray-500 focus:border-[#66b2ff] outline-none text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm font-semibold">
            Correo Electrónico
          </label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={datos.email}
            onChange={e => setDatos({ ...datos, email: e.target.value })}
            required
            className="p-3 rounded-lg bg-[#2c353e] border border-gray-500 focus:border-[#66b2ff] outline-none text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm font-semibold">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={datos.password}
            onChange={e => setDatos({ ...datos, password: e.target.value })}
            required
            className="p-3 rounded-lg bg-[#2c353e] border border-gray-500 focus:border-[#66b2ff] outline-none text-white"
          />
        </div>

        <button
          type="submit"
          className="bg-[#66b2ff] text-[#1e262c] font-bold py-3 rounded-lg hover:bg-white transition-all text-lg shadow-lg"
        >
          Registrarse
        </button>

        <p className="text-center text-gray-400 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-[#66b2ff] hover:underline font-bold"
          >
            Inicia sesión aquí
          </Link>
        </p>

      </form>
    </div>
  );
}
