import { createContext, useState, useEffect, useCallback } from 'react';

export const UserContext = createContext();

// Definimos la URL base para no repetirla y evitar errores
const API_BASE_URL = "https://proyecto-final-fullstack-4pbz.onrender.com";

export const UserProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(localStorage.getItem("nombreGuardado"));

  const fetchUserData = useCallback(async (endpoint, setter) => {
    if (!token) return;
    try {
      // Agregamos /api/user/ antes del endpoint (cart o wishlist)
      const res = await fetch(`${API_BASE_URL}/api/user/${endpoint}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setter(data);
      }
    } catch (err) {
      console.error(`Error al obtener ${endpoint}:`, err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserData('cart', setCart);
      fetchUserData('wishlist', setWishlist);
    }
  }, [token, fetchUserData]);

  const loginUser = (newToken, username) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("nombreGuardado", username);
    setToken(newToken);
    setUsuario(username);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombreGuardado");
    setToken(null);
    setUsuario(null);
    setCart([]);
    setWishlist([]);
  };

  const addToCart = async (gameId) => {
    if (!token) return alert("Debes iniciar sesión para agregar al carrito.");
    try {
      // Ruta corregida: /api/user/cart
      const res = await fetch(`${API_BASE_URL}/api/user/cart`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ gameId })
      });
      if (res.ok) fetchUserData('cart', setCart);
    } catch (err) { console.error(err); }
  };

  const addToWishlist = async (gameId) => {
    if (!token) return alert("Debes iniciar sesión para agregar a deseados.");
    try {
      // Ruta corregida: /api/user/wishlist
      const res = await fetch(`${API_BASE_URL}/api/user/wishlist`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ gameId })
      });
      if (res.ok) fetchUserData('wishlist', setWishlist);
    } catch (err) { console.error(err); }
  };

  const removeFrom = async (endpoint, gameId) => {
    try {
      // Ruta corregida: /api/user/[endpoint]/remove/[id]
      const res = await fetch(`${API_BASE_URL}/api/user/${endpoint}/remove/${gameId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        endpoint === 'cart' ? fetchUserData('cart', setCart) : fetchUserData('wishlist', setWishlist);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <UserContext.Provider value={{ 
      cart, wishlist, token, usuario, 
      loginUser, logoutUser, addToCart, addToWishlist, removeFrom 
    }}>
      {children}
    </UserContext.Provider>
  );
};
