import { createContext, useState, useEffect, useCallback } from 'react';

export const UserContext = createContext();

// URL base de tu backend en Render
const API_BASE_URL = "https://proyecto-final-fullstack-4pbz.onrender.com";

export const UserProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Corregimos la carga inicial: si no hay token, debe ser null (no "null" en texto)
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [usuario, setUsuario] = useState(localStorage.getItem("nombreGuardado") || null);

  // Función para obtener datos (Carrito o Wishlist)
  const fetchUserData = useCallback(async (endpoint, setter) => {
    // Si no hay token o es el string "null", no hacemos la petición
    if (!token || token === "null") return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${endpoint}`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      });

      if (res.ok) {
        const data = await res.json();
        // El backend devuelve directamente el arreglo poblado
        setter(data); 
      } else {
        console.error(`Error al obtener ${endpoint}: ${res.status}`);
      }
    } catch (err) {
      console.error(`Error de red al obtener ${endpoint}:`, err);
    }
  }, [token]);

  // Sincronizar datos cuando el token cambie (Login/Logout)
  useEffect(() => {
    if (token && token !== "null") {
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

  // --- CARRITO ---
  const addToCart = async (gameId) => {
    if (!token || token === "null") return alert("Debes iniciar sesión para agregar al carrito.");
    
    try {
      // Tu backend espera la ruta /api/user/cart/add
      const res = await fetch(`${API_BASE_URL}/api/user/cart/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ gameId })
      });

      if (res.ok) {
        fetchUserData('cart', setCart);
      } else {
        const error = await res.json();
        alert(error.msg || "Error al agregar al carrito");
      }
    } catch (err) {
      console.error("Error en addToCart:", err);
    }
  };

  // --- WISHLIST ---
  const addToWishlist = async (gameId) => {
    if (!token || token === "null") return alert("Debes iniciar sesión para la lista de deseos.");
    
    try {
      // Tu backend espera la ruta /api/user/wishlist/add
      const res = await fetch(`${API_BASE_URL}/api/user/wishlist/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ gameId })
      });

      if (res.ok) {
        fetchUserData('wishlist', setWishlist);
      } else {
        const error = await res.json();
        alert(error.msg || "Error al agregar a favoritos");
      }
    } catch (err) {
      console.error("Error en addToWishlist:", err);
    }
  };

  // --- ELIMINAR ---
  const removeFrom = async (endpoint, gameId) => {
    if (!token || token === "null") return;

    try {
      // Ruta: /api/user/cart/remove/:gameId o /api/user/wishlist/remove/:gameId
      const res = await fetch(`${API_BASE_URL}/api/user/${endpoint}/remove/${gameId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      });

      if (res.ok) {
        // Refrescamos los datos localmente
        fetchUserData(endpoint, endpoint === 'cart' ? setCart : setWishlist);
      }
    } catch (err) {
      console.error(`Error al eliminar de ${endpoint}:`, err);
    }
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
