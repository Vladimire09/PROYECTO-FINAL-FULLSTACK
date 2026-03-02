import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function Inicio({ filtroBusqueda = '' }) {
  const [juegosSlider, setJuegosSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [juegoActual, setJuegoActual] = useState({});
  const { addToCart, addToWishlist } = useContext(UserContext);

  useEffect(() => {
    const obtenerJuegos = async () => {
      try {
        const respuesta = await fetch("https://proyecto-final-fullstack-4pbz.onrender.com/games");
        const datos = await respuesta.json();
        setJuegosSlider(datos);
        setLoading(false);
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        setLoading(false);
      }
    };
    obtenerJuegos();
  }, []);

  const abrirModal = (juego) => {
    setJuegoActual(juego);
    setModalAbierto(true);
  };

  if (loading) return <div className="text-white text-center mt-20">Cargando...</div>;
  if (juegosSlider.length === 0) return <div className="text-white text-center mt-20">No hay juegos disponibles.</div>;

  // 1. Filtrar los juegos
  const juegosFiltrados = juegosSlider.filter(juego => 
    juego.title.toLowerCase().includes(filtroBusqueda.toLowerCase())
  );

  // 2. Agrupar por género
  const juegosPorGenero = juegosFiltrados.reduce((acc, juego) => {
    const genero = juego.genre || 'General';
    if (!acc[genero]) acc[genero] = [];
    acc[genero].push(juego);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center w-full mt-5 px-4">

      <div className="w-full max-w-[1200px]">
        {Object.keys(juegosPorGenero).length === 0 ? (
          <p className="text-center text-gray-400 text-xl mt-10">
            No se encontraron juegos que coincidan con tu búsqueda.
          </p>
        ) : (
          Object.keys(juegosPorGenero).map(genero => (
            // Centramos el contenedor del género
            <div key={genero} className="mb-12 text-center"> 

              <Link 
                to={`/genero/${genero}`} 
                className="text-3xl font-bold text-[#66b2ff] uppercase hover:text-white transition-colors mb-8 inline-block border-b-2 border-[#66b2ff] pb-1"
              >
                {genero} &raquo;
              </Link>

              {/* 'justify-center' hace que las tarjetas se agrupen al centro si no llenan la fila */}
              <section className="flex flex-wrap justify-center gap-8">
                {juegosPorGenero[genero].map((juego) => (
                  <div 
                    key={juego._id} 
                    className="w-[250px] bg-[#1a1a24] border-2 border-white rounded-xl p-4 transition-all hover:-translate-y-2 hover:border-[#66b2ff] cursor-pointer text-left" 
                    onClick={() => abrirModal(juego)}
                  >
                    <h3 className="text-white text-xl font-bold mb-2 uppercase truncate">{juego.title}</h3>
                    <img 
                        src={juego.imageUrl} 
                        alt={juego.title} 
                        className="w-full h-[250px] rounded-lg object-cover mb-3" 
                    />
                    <p className="text-[#66b2ff] font-bold text-xl">Mex ${juego.price}</p>
                  </div>
                ))}
              </section>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#2c353e] border-2 border-white rounded-2xl p-8 w-full max-w-lg text-center relative shadow-2xl">
            <button 
                className="absolute top-4 right-4 text-white text-3xl hover:text-red-500" 
                onClick={() => setModalAbierto(false)}
            >
                &times;
            </button>
            <h2 className="text-white text-3xl font-bold mb-2">{juegoActual.title}</h2>
            <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full mb-4 inline-block">
                {juegoActual.genre}
            </span>
            <img 
                src={juegoActual.imageUrl} 
                alt={juegoActual.title}
                className="w-full max-h-[250px] object-cover rounded-lg mb-4 mt-2 border border-gray-500" 
            />
            <p className="text-gray-300 mb-6">{juegoActual.description}</p>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => { addToCart(juegoActual._id); setModalAbierto(false); }} 
                className="bg-[#66b2ff] text-[#1e262c] px-6 py-2 rounded-md font-bold hover:bg-white transition-all"
              >
                Agregar al Carrito
              </button>
              <button 
                onClick={() => { addToWishlist(juegoActual._id); setModalAbierto(false); }} 
                className="bg-pink-600 text-white px-4 py-2 rounded-md font-bold hover:bg-pink-400 transition-all"
              >
                 Desear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

