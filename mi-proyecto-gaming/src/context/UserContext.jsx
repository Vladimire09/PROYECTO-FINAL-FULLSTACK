import { createContext, useState, useEffect, useCallback } from 'react';

export const UserContext = createContext();

// URL base de tu backend en Render
const API_BASE_URL = "https://proyecto-final-fullstack-4pbz.onrender.com";

export const UserProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // 1. Inicialización robusta: Validamos que el token sea un string real y no "null"
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return (savedToken && savedToken !== "null") ? savedToken : null;
  });

  const [usuario, setUsuario] = useState(() => {
    const savedNombre = localStorage.getItem("nombreGuardado");
    return (savedNombre && savedNombre !== "null") ? savedNombre : null;
  });

  // 2. Función para obtener datos (Carrito o Wishlist)
  const fetchUserData = useCallback(async (endpoint, setter) => {
    // Si no hay token, no intentamos la petición para evitar el 403
    if (!token || token === "null") return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${endpoint}`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`, // El espacio después de Bearer es vital
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        const data = await res.json();
        setter(data); 
      } else {
        console.error(`Error ${res.status} al obtener ${endpoint}`);
        if (res.status === 403 || res.status === 401) {
          // Si el token ya no es válido, limpiamos el estado
          logoutUser();
        }
      }
    } catch (err) {
      console.error(`Error de red en ${endpoint}:`, err);
    }
  }, [token]);

  // 3. Sincronizar datos automáticamente cuando el token cambie
  useEffect(() => {
    if (token && token !== "null") {
      fetchUserData('cart', setCart);
      fetchUserData('wishlist', setWishlist);
    }
  }, [token, fetchUserData]);

  // 4. Funciones de Autenticación
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

  // 5. Acciones del Carrito
  const addToCart = async (gameId) => {
    if (!token) return alert("Debes iniciar sesión para agregar al carrito.");
    
    try {
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

  // 6. Acciones de la Wishlist
  const addToWishlist = async (gameId) => {
    if (!token) return alert("Debes iniciar sesión para la lista de deseos.");
    
    try {
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

  // 7. Eliminar elementos
  const removeFrom = async (endpoint, gameId) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/user/${endpoint}/remove/${gameId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      });

      if (res.ok) {
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
