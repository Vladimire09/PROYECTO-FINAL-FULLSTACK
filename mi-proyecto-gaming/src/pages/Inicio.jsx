import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function Inicio({ filtroBusqueda = '' }) {
  const [juegosSlider, setJuegosSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [juegoActual, setJuegoActual] = useState({});
  const [indiceSlider, setIndiceSlider] = useState(0); // Para el control del carrusel
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

  // Lógica para cambiar el slider automáticamente cada 5 segundos
  useEffect(() => {
    if (juegosSlider.length > 0) {
      const intervalo = setInterval(() => {
        setIndiceSlider((prev) => (prev + 1) % juegosDestacados.length);
      }, 5000);
      return () => clearInterval(intervalo);
    }
  }, [juegosSlider]);

  const abrirModal = (juego) => {
    setJuegoActual(juego);
    setModalAbierto(true);
  };

  if (loading) return <div className="text-white text-center mt-20">Cargando...</div>;
  if (juegosSlider.length === 0) return <div className="text-white text-center mt-20">No hay juegos disponibles.</div>;

  // 1. Filtrar los juegos por búsqueda
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

  // 3. Seleccionar los juegos destacados (el primero de cada categoría) para el Carrusel
  const juegosDestacados = Object.values(juegosPorGenero).map(lista => lista[0]).slice(0, 5); // Limitado a 5 destacados
  const destacadoActual = juegosDestacados[indiceSlider];

  return (
    <div className="flex flex-col items-center w-full mt-5 px-4">
      
      {/* --- CARRUSEL ESTILO TODO GAMING --- */}
      {juegosDestacados.length > 0 && !filtroBusqueda && (
        <div className="w-full max-w-[1000px] mb-12 relative group">
          <div 
            className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden relative border-2 border-gray-700 shadow-2xl cursor-pointer"
            onClick={() => abrirModal(destacadoActual)}
          >
            {/* Imagen de fondo */}
            <img 
              src={destacadoActual.imageUrl} 
              alt={destacadoActual.title} 
              className="w-full h-full object-cover transition-opacity duration-700"
            />
            
            {/* Barra de información inferior (Estilo imagen) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[#1a1a24]/90 border border-white/20 py-2 px-6 rounded-md flex justify-center items-center gap-4 text-white shadow-lg">
              <span className="font-bold text-lg">{destacadoActual.title}</span>
              <span className="text-[#66b2ff] font-bold">Mex ${destacadoActual.price}</span>
              <span className="text-gray-400 text-sm uppercase">{destacadoActual.genre}</span>
            </div>
          </div>

          {/* Botones de navegación (1, 2, 3...) */}
          <div className="flex justify-center gap-3 mt-4">
            {juegosDestacados.map((_, index) => (
              <button
                key={index}
                onClick={() => setIndiceSlider(index)}
                className={`w-10 h-10 rounded-lg font-bold transition-all border-2 ${
                  indiceSlider === index 
                  ? "bg-white text-black border-white" 
                  : "bg-[#2c353e] text-white border-gray-600 hover:border-white"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <h2 className="text-white text-4xl font-black text-center mt-6 tracking-widest uppercase">TENDENCIA</h2>
        </div>
      )}

      {/* --- GRILLA DE JUEGOS POR CATEGORÍA --- */}
      <div className="w-full max-w-[1200px]">
        {Object.keys(juegosPorGenero).length === 0 ? (
          <p className="text-center text-gray-400 text-xl mt-10">
            No se encontraron juegos que coincidan con tu búsqueda.
          </p>
        ) : (
          Object.keys(juegosPorGenero).map(genero => (
            <div key={genero} className="mb-12 text-center"> 
              <Link 
                to={`/genero/${genero}`} 
                className="text-3xl font-bold text-[#66b2ff] uppercase hover:text-white transition-colors mb-8 inline-block border-b-2 border-[#66b2ff] pb-1"
              >
                {genero} &raquo;
              </Link>

              <section className="flex flex-wrap justify-center gap-8">
                {juegosPorGenero[genero].map((juego) => (
                  <div 
                    key={juego._id} 
                    className="w-[250px] bg-[#1a1a24] border-2 border-white rounded-xl p-4 transition-all hover:-translate-y-2 hover:border-[#66b2ff] cursor-pointer text-left shadow-lg" 
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

      {/* MODAL DE DETALLES */}
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
