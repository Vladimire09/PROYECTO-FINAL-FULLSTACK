import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Datos de ejemplo para los anuncios destacables de tu tienda
const FEATURED_GAMES = [
  {
    id: '1',
    title: 'Elden Ring',
    description: 'Ya disponible. Explora las Tierras Intermedias en esta épica aventura RPG.',
    price: '$59.99',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=200&q=80'
    ]
  },
  {
    id: '2',
    title: 'Cyberpunk 2077',
    description: 'Sumérgete en Night City con la nueva actualización y expansión.',
    price: '$29.99',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    thumbnails: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80'
    ]
  }
];

export const BannerCarousel = ({ games = FEATURED_GAMES }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambio automático de anuncio cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [games.length]);

  const currentGame = games[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
  };

  if (!games || games.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto my-6 bg-slate-900 rounded-lg overflow-hidden shadow-2xl text-white">
      {/* Contenedor Principal (Estilo Steam) */}
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[380px]">
        
        {/* Imagen principal clickeable */}
        <Link 
          to={`/game/${currentGame.id}`} 
          className="md:col-span-2 relative group overflow-hidden block"
        >
          <img 
            src={currentGame.bannerImage} 
            alt={currentGame.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
          <div className="absolute bottom-4 left-4 right-4 md:hidden">
            <h2 className="text-xl font-bold">{currentGame.title}</h2>
            <span className="text-green-400 font-semibold">{currentGame.price}</span>
          </div>
        </Link>

        {/* Panel lateral con detalles y vista previa (Fiel a la interfaz de Steam) */}
        <div className="hidden md:flex flex-col justify-between p-6 bg-slate-800/90 backdrop-blur">
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentGame.title}</h2>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              {currentGame.description}
            </p>

            {/* Vista previa de capturas de pantalla */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {currentGame.thumbnails?.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt="preview" 
                  className="rounded object-cover h-20 w-full opacity-80 hover:opacity-100 transition"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 border-t border-slate-700 pt-4">
            <span className="text-lg font-bold text-green-400">{currentGame.price}</span>
            <Link 
              to={`/game/${currentGame.id}`}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium text-sm transition"
            >
              Ver juego
            </Link>
          </div>
        </div>
      </div>

      {/* Botones de navegación Anterior / Siguiente */}
      <button 
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
        aria-label="Anuncio anterior"
      >
        ❮
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
        aria-label="Siguiente anuncio"
      >
        ❯
      </button>

      {/* Indicadores inferiores (Puntos de posición) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {games.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-gray-500/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;