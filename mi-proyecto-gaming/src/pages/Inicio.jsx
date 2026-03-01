import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function Inicio({ filtroBusqueda = '' }) {
  const [juegosSlider, setJuegosSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [juegoActual, setJuegoActual] = useState({});
  const { addToCart, addToWishlist } = useContext(UserContext);

  // ESTADOS PARA EL CARRUSEL
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // EFECTO PARA AUTO-ROTAR EL CARRUSEL
  const juegosCarrusel = juegosSlider.slice(0, 5); // Tomamos los primeros 5 juegos
  useEffect(() => {
    if (juegosCarrusel.length > 0 && !filtroBusqueda) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === juegosCarrusel.length - 1 ? 0 : prev + 1));
      }, 5000); // Cambia cada 5 segundos
      return () => clearInterval(timer);
    }
  }, [juegosCarrusel.length, filtroBusqueda]);

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

        {/* --- INICIO DEL CARRUSEL --- */}
        {!filtroBusqueda && juegosCarrusel.length > 0 && (
          <div className="w-full h-[400px] sm:h-[500px] relative overflow-hidden rounded-2xl mb-16 border-2 border-gray-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] group bg-[#1a1a24]">
            {juegosCarrusel.map((juego, index) => (
              <div
                key={juego._id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Imagen de fondo oscurecida */}
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img 
                  src={juego.imageUrl} 
                  alt={juego.title} 
                  className="w-full h-full object-cover blur-[2px] scale-105"
                />
                
                {/* Contenido del carrusel */}
                <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center justify-center gap-8 p-8 bg-gradient-to-t from-[#1e262c] via-transparent to-transparent">
                  <img 
                    src={juego.imageUrl} 
                    alt={juego.title} 
                    className="h-[200px] md:h-[300px] object-cover rounded-xl shadow-2xl border-2 border-gray-600 cursor-pointer hover:border-[#66b2ff] transition-all hover:scale-105"
                    onClick={() => abrirModal(juego)}
                  />
                  <div className="text-center md:text-left max-w-md">
                    <span className="bg-[#66b2ff] text-[#1e262c] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                      Destacado
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2 uppercase drop-shadow-lg">
                      {juego.title}
                    </h2>
                    <p className="text-[#66b2ff] text-2xl font-bold mb-6 drop-shadow-md">
                      Mex ${juego.price}
                    </p>
                    <button 
                      onClick={() => abrirModal(juego)}
                      className="bg-[#66b2ff] text-[#1e262c] px-8 py-3 rounded-full font-bold text-lg hover:bg-white transition-all shadow-lg hover:shadow-[#66b2ff]/50"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Controles del Carrusel (Flechas) */}
            <button
              onClick={() => setCurrentSlide(prev => prev === 0 ? juegosCarrusel.length - 1 : prev - 1)}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white w-12 h-12 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-[#66b2ff] hover:text-black text-2xl"
            >
              &#10094;
            </button>
            <button
              onClick={() => setCurrentSlide(prev => prev === juegosCarrusel.length - 1 ? 0 : prev + 1)}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white w-12 h-12 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-30 hover:bg-[#66b2ff] hover:text-black text-2xl"
            >
              &#10095;
            </button>

            {/* Indicadores (Puntitos) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30">
              {juegosCarrusel.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-[#66b2ff] w-8' : 'bg-gray-400 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        {/* --- FIN DEL CARRUSEL --- */}

        {Object.keys(juegosPorGenero).length === 0 ? (
          <p className="text-center text-gray-400 text-xl mt-10">
            No se encontraron juegos que coincidan con tu búsqueda.
          </p>
        ) : (
          Object.keys(juegosPorGenero).map(genero => (
            <div key={genero} className="mb-16 text-center"> 
              
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
                    className="w-[250px] bg-[#1a1a24] border-2 border-white rounded-xl p-4 transition-all hover:-translate-y-2 hover:border-[#66b2ff] hover:shadow-[0_10px_20px_rgba(102,178,255,0.2)] cursor-pointer text-left flex flex-col" 
                    onClick={() => abrirModal(juego)}
                  >
                    <img 
                        src={juego.imageUrl} 
                        alt={juego.title} 
                        className="w-full h-[250px] rounded-lg object-cover mb-4" 
                    />
                    <h3 className="text-white text-xl font-bold mb-1 uppercase truncate" title={juego.title}>
                      {juego.title}
                    </h3>
                    <p className="text-[#66b2ff] font-bold text-xl mt-auto">Mex ${juego.price}</p>
                  </div>
                ))}
              </section>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-[#2c353e] border-2 border-[#66b2ff] rounded-2xl p-8 w-full max-w-lg text-center relative shadow-[0_0_40px_rgba(102,178,255,0.3)]">
            <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-4xl leading-none transition-colors" 
                onClick={() => setModalAbierto(false)}
            >
                &times;
            </button>
            <h2 className="text-white text-3xl font-bold mb-2 uppercase">{juegoActual.title}</h2>
            <span className="bg-[#1a1a24] border border-gray-600 text-[#66b2ff] text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                {juegoActual.genre}
            </span>
            <img 
                src={juegoActual.imageUrl} 
                alt={juegoActual.title}
                className="w-full max-h-[250px] object-cover rounded-lg mb-6 mt-2 border border-gray-600 shadow-lg" 
            />
            <p className="text-gray-300 mb-8 text-sm md:text-base leading-relaxed">{juegoActual.description}</p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => { addToCart(juegoActual._id); setModalAbierto(false); }} 
                className="bg-[#66b2ff] text-[#1e262c] px-6 py-3 rounded-full font-bold hover:bg-white transition-all shadow-lg hover:shadow-[#66b2ff]/50 flex-1"
              >
                Agregar al Carrito
              </button>
              <button 
                onClick={() => { addToWishlist(juegoActual._id); setModalAbierto(false); }} 
                className="bg-transparent border-2 border-pink-500 text-pink-500 px-6 py-3 rounded-full font-bold hover:bg-pink-500 hover:text-white transition-all shadow-lg flex-1"
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
