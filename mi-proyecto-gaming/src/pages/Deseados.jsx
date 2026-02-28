
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCartPlus } from '@fortawesome/free-solid-svg-icons';

export default function Deseados() {
  const { wishlist, removeFrom, addToCart } = useContext(UserContext);

  const moverAlCarrito = (id) => {
    addToCart(id);
    removeFrom('wishlist', id); // Opcional: Quitar de deseados al pasarlo al carrito
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#1a1a24] border-2 border-white rounded-2xl shadow-2xl text-white">
      <h2 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4 text-pink-500">Tu Lista de Deseos</h2>

      {wishlist.length > 0 ? (
        <div className="flex flex-col gap-4">
          {wishlist.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-[#2c353e] p-4 rounded-xl border border-gray-600 hover:border-pink-500 transition-all">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-[#66b2ff]">${item.price} MXN</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => moverAlCarrito(item._id)} title="Mover al Carrito" className="bg-[#66b2ff] text-[#1e262c] p-2 rounded hover:bg-white transition-colors">
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
                <button onClick={() => removeFrom('wishlist', item._id)} title="Eliminar" className="text-red-400 hover:text-red-600 p-2 transition-colors">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 text-xl mb-6">Aún no tienes juegos en tu lista de deseos.</p>
          <Link to="/" className="text-pink-500 hover:underline font-bold text-lg">Explorar catálogo</Link>
        </div>
      )}
    </div>
  );
}