import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Pago() {
  const [datos, setDatos] = useState({ tarjeta: '', nombre: '', exp: '', cvv: '' });
  const [mensaje, setMensaje] = useState({ texto: '', color: '' });
  const navigate = useNavigate();

  const procesarPago = (e) => {
    e.preventDefault();
    
    // Simulación de validación
    if (datos.tarjeta.length === 16 && datos.cvv.length === 3) {
      setMensaje({ texto: "✅ Pago realizado correctamente. ¡Gracias por tu compra!", color: "text-green-400" });
      
      // Regresar al inicio tras 3 segundos
      setTimeout(() => navigate('/'), 3000);
    } else {
      setMensaje({ texto: "❌ Error al pagar: Datos de tarjeta inválidos.", color: "text-red-400" });
    }
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-md bg-[#1a1a24] border-2 border-white rounded-xl p-8 shadow-2xl">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Finalizar Compra</h2>
        
        <form onSubmit={procesarPago} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Nombre en la tarjeta" required
            className="p-3 rounded bg-[#2c353e] text-white border border-gray-600"
            onChange={(e) => setDatos({...datos, nombre: e.target.value})}
          />
          <input 
            type="number" placeholder="Número de tarjeta (16 dígitos)" required
            className="p-3 rounded bg-[#2c353e] text-white border border-gray-600"
            onChange={(e) => setDatos({...datos, tarjeta: e.target.value})}
          />
          <div className="flex gap-2">
            <input 
              type="text" placeholder="MM/AA" required className="w-1/2 p-3 rounded bg-[#2c353e] text-white border border-gray-600" 
              onChange={(e) => setDatos({...datos, exp: e.target.value})}
            />
            <input 
              type="number" placeholder="CVV" required className="w-1/2 p-3 rounded bg-[#2c353e] text-white border border-gray-600"
              onChange={(e) => setDatos({...datos, cvv: e.target.value})}
            />
          </div>

          <button type="submit" className="mt-4 bg-[#66b2ff] text-[#1e262c] font-bold py-3 rounded-md hover:bg-white transition-all">
            Pagar Ahora
          </button>
        </form>

        {mensaje.texto && (
          <p className={`mt-6 font-bold text-center ${mensaje.color}`}>
            {mensaje.texto}
          </p>
        )}
      </div>
    </div>
  );
}