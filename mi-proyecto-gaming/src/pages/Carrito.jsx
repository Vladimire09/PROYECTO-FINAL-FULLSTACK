import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Carrito() {
  const { cart, removeFrom } = useContext(UserContext);
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#1a1a24] border-2 border-white rounded-2xl shadow-2xl text-white">
      <h2 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-4">Tu Carrito de Compras</h2>

      {cart.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center justify-between bg-[#2c353e] p-4 rounded-xl border border-gray-600 hover:border-[#66b2ff] transition-all">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-[#66b2ff]">${item.price} MXN</p>
                  </div>
                </div>
                <button onClick={() => removeFrom('cart', item._id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-6 bg-[#252a33] rounded-xl border-t-4 border-[#66b2ff]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl text-gray-300">Total estimado:</span>
              <span className="text-3xl font-bold">${total} MXN</span>
            </div>
            
            <Link to="/pago" className="flex items-center justify-center gap-3 w-full bg-[#66b2ff] text-[#1e262c] font-bold py-4 rounded-lg hover:bg-white transition-all duration-300">
              Proceder al Pago <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-400 text-xl mb-6">Tu carrito está vacío. ¡Ve por unos juegos!</p>
          <Link to="/" className="text-[#66b2ff] hover:underline font-bold text-lg">Volver a la tienda</Link>
        </div>
      )}
    </div>
  );
}