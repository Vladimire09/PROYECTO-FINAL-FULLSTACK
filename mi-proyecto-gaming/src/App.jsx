
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from './context/UserContext';

// Páginas
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import Deseados from './pages/Deseados';
import Pago from './pages/Pago';
import Genero from './pages/Genero';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCartShopping, 
  faHeart, 
  faRightFromBracket, 
  faMagnifyingGlass 
} from '@fortawesome/free-solid-svg-icons';

import logo from './assets/LOGO.jpeg';

function App() {
  const { usuario, logoutUser, cart, wishlist } = useContext(UserContext);
  const [busqueda, setBusqueda] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-[#1e262c] text-white font-sans">
      <BrowserRouter>

        {/* HEADER */}
        <header className="bg-[#404040] border-b-[3px] border-[#1a1a1a] py-3 px-6 sticky top-0 z-50 shadow-2xl">
          <div className="flex items-center justify-between gap-4 w-full">

            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center min-w-[200px] no-underline"
              onClick={() => setBusqueda('')}
            >
              <img 
                src={logo} 
                alt="Logo"
                style={{ width: '45px', height: '45px' }}
                className="rounded-full border-2 border-black object-cover"
              />
              <span className="ml-3 text-2xl font-bold text-white">
                Todo Gaming
              </span>
            </Link>

            {/* Buscador */}
            <div className="flex-grow max-w-[600px] relative mx-6">
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-[#2c353e] border border-gray-500 text-white py-2 pl-10 pr-4 rounded-full focus:outline-none focus:border-[#66b2ff]"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* NAV */}
            <nav className="flex items-center gap-12">

              {/* Links principales */}
              <div className="flex items-center gap-8">
                <Link 
                  to="/" 
                  className="text-white font-semibold hover:text-[#66b2ff]"
                >
                  Inicio
                </Link>

                {!usuario && (
                  <Link 
                    to="/login" 
                    className="text-white font-semibold hover:text-[#66b2ff]"
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Usuario logueado */}
              {usuario && (
                <div className="flex items-center gap-3 bg-[#2c353e] px-4 py-1 rounded-full border border-gray-500">
                  <span className="text-[#66b2ff] font-bold text-sm">
                    {usuario}
                  </span>
                  <button
                    onClick={logoutUser}
                    className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                  </button>
                </div>
              )}

              {/* Iconos */}
              <div className="flex items-center gap-8 border-l border-gray-600 pl-8">

                <Link
                  to="/deseados"
                  className="relative text-white hover:text-pink-500 transition-transform hover:scale-110"
                >
                  <FontAwesomeIcon icon={faHeart} size="lg" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/carrito"
                  className="relative text-white hover:text-[#66b2ff] transition-transform hover:scale-110"
                >
                  <FontAwesomeIcon icon={faCartShopping} size="lg" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#66b2ff] text-[#1e262c] text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {cart.length}
                    </span>
                  )}
                </Link>

              </div>
            </nav>

          </div>
        </header>

        {/* MAIN CENTRADO */}
        <main className="flex items-center justify-center flex-grow px-4 py-12">
          <Routes>
            <Route path="/" element={<Inicio filtroBusqueda={busqueda} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/deseados" element={<Deseados />} />
            <Route path="/pago" element={<Pago />} />
            <Route path="/genero/:categoria" element={<Genero />} />
            <Route path="*" element={<Inicio filtroBusqueda={busqueda} />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="py-8 text-center text-gray-500 text-xs border-t border-gray-800">
          Todo gaming para todo público. <br />
          © 2026 Todo Gaming - Todos los derechos reservados.
        </footer>

      </BrowserRouter>
    </div>
  );
}

export default App;