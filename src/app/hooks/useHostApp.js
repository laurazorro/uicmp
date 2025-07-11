import { useEffect, useState } from 'react';

export function useHostApp() {
  const [HostApp, setHostApp] = useState(null);
  const [isMobileApp, setIsMobileApp] = useState(false); // Nuevo estado para indicar si es app móvil

  useEffect(() => {
    // Solo si estamos en el navegador (cliente)
    if (typeof window !== 'undefined') {
      if (window.HostApp) {
        // Si HostApp existe, asumimos que estamos dentro de una app móvil (WebView)
        setHostApp(window.HostApp);
        setIsMobileApp(true);
      } else {
        // Si HostApp no existe, es una página web normal
        setHostApp(null);
        setIsMobileApp(false);//TO DO Cambiar a true si es necesario testear
      }
    }
  }, []); // Se ejecuta una vez al montar el componente

  // Devolvemos tanto el objeto HostApp como el indicador isMobileApp
  return { HostApp, isMobileApp };
}