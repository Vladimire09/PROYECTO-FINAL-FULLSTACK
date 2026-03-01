import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function Genero() {
  const { categoria } = useParams(); // Obtiene el género de la URL
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [juegoActual, setJuegoActual] = useState({});
  const { addToCart, addToWishlist } = useContext(UserContext);

  useEffect(() => {
    const obtenerJuegos = async () => {
      try {
        const respuesta = await fetch("https://proyecto-final-fullstack-4pbz.onrender.com/games");
        const datos = await respuesta.json();
        
        // Filtramos para que solo queden los del género actual
        const filtrados = datos.filter(juego => 
          (juego.genre || 'General').toLowerCase() === categoria.toLowerCase()
        );
        
        setJuegos(filtrados);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar juegos:", error);
        setLoading(false);
      }
    };
    obtenerJuegos();
  }, [categoria]);

  const abrirModal = (juego) => {
    setJuegoActual(juego);
    setModalAbierto(true);
  };

  if (loading) return <div className="text-white text-center mt-20">Cargando categoría...</div>;

  return (
    <div className="flex flex-col items-center w-full mt-5 px-4">
      <div className="w-full max-w-[1200px] mb-8">
        <Link to="/" className="text-gray-400 hover:text-white transition-colors mb-4 inline-block">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver al Inicio
        </Link>
        <h2 className="text-[#66b2ff] text-4xl font-bold uppercase border-b-4 border-[#66b2ff] pb-2 inline-block">
          Juegos de {categoria}
        </h2>
      </div>
      
      {juegos.length === 0 ? (
        <p className="text-gray-400 text-xl mt-10">No hay juegos disponibles en esta categoría.</p>
      ) : (
        <section className="flex flex-wrap gap-8 w-full max-w-[1200px]">
          {juegos.map((juego) => (
            <div key={juego._id} className="w-[250px] bg-[#1a1a24] border-2 border-white rounded-xl p-4 transition-all hover:-translate-y-2 hover:border-[#66b2ff] cursor-pointer" onClick={() => abrirModal(juego)}>
              <h3 className="text-white text-xl font-bold mb-2 uppercase truncate">{juego.title}</h3>
              <img src={juego.imageUrl} alt={juego.title} className="w-full h-[250px] rounded-lg object-cover mb-3" />
              <p className="text-[#66b2ff] font-bold text-xl">Mex ${juego.price}</p>
            </div>
          ))}
        </section>
      )}

      {/* MODAL (Reutilizamos el mismo diseño) */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#2c353e] border-2 border-white rounded-2xl p-8 w-full max-w-lg text-center relative">
            <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setModalAbierto(false)}>&times;</button>
            <h2 className="text-white text-3xl font-bold mb-4">{juegoActual.title}</h2>
            <img src={juegoActual.imageUrl} className="w-full max-h-[250px] object-cover rounded-lg mb-4 mt-2" />
            <p className="text-gray-300 mb-6">{juegoActual.description}</p>
            
            <div className="flex gap-4 justify-center">
              <button onClick={() => addToCart(juegoActual._id)} className="bg-[#66b2ff] text-[#1e262c] px-6 py-2 rounded-md font-bold hover:bg-white transition-all">
                Agregar al Carrito
              </button>
              <button onClick={() => addToWishlist(juegoActual._id)} className="bg-pink-600 text-white px-4 py-2 rounded-md font-bold hover:bg-pink-400 transition-all">
                ♥ Desear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
