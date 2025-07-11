'use client';

import { useEffect } from 'react';
import { BASE_PATH, urlCorporativo } from './constants';

export default function AppInitializer() {
    useEffect(() => {  
        if (typeof window !== 'undefined') {
          const queryHash = new URLSearchParams(window.location.hash);
          if (!window.location.pathname.includes("chg")){
            sessionStorage.clear();
            const queryParams = new URLSearchParams(window.location.search);
            if( queryParams != '' ){
              queryParams.forEach((value, key) => {
                if( key == 'error' ){
                  if( value == 'loginFailure' ){
                    sessionStorage.setItem('error', 'loginFailure');
                  }
                  else{
                    sessionStorage.setItem('error', 'privilegeFailure');
                  }
                }
                sessionStorage.setItem(key, value);
              });
              sessionStorage.setItem('parameters', queryParams);
            }
            else {
              location.href = urlCorporativo;
            }
          } else if( queryHash != '' ){
            queryHash.forEach((value, key) => {
              if(key == '#access_token' || key == 'id_token' ) sessionStorage.setItem(key, value);
            });
          }
        }
        else{
          location.href = urlCorporativo;
        }
    
        // Función para cargar un script de manera dinámica
        const loadScript = (src, callback) => {
          const script = document.createElement('script');
          script.src = src;
          script.type = 'text/javascript';
          script.async = true;
          script.onload = callback; // Ejecutamos el callback cuando el script se haya cargado
          script.onerror = (error) => {
            console.error(`Error al cargar el script ${src}:`, error);
          };
          document.body.appendChild(script);
        };
    
        // Array con las rutas de las librerías JS
        const scripts = [
          '/js/fingerprint2.js',
          '/js/jsencrypt.min.js',
          '/js/uuidv4.js',
          '/js/vubrowserfp.js',
        ].map(path => `${BASE_PATH}${path}`);
    
        // Cargar todas las librerías de manera secuencial
        let loadedScriptsCount = 0;
    
        const onScriptLoaded = () => {
          loadedScriptsCount++;
    
          // Verificar si todos los scripts se han cargado
          if (loadedScriptsCount === scripts.length) {
            
            let vuFp = new VUBrowserFP();
          
            vuFp.getFingerprintInfoWithSeed(function (info) {
                let fingerprint = info.fingerprint; //Información a enviar al server en Base64
                sessionStorage.setItem("fingerprint", fingerprint);
            });
          }
        };
    
        // Cargar los scripts
        scripts.forEach((src) => {
          loadScript(src, onScriptLoaded);
        });

        function getLocation() {
          let bdcApiBase = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  
          navigator.geolocation.getCurrentPosition(
            (position) => handleSuccess(position, bdcApiBase),
            () => getApi(bdcApiBase),
            {
              enableHighAccuracy: true,
              timeout: 5000
            }
          );
        }

        function handleSuccess(position, baseUrl) {
          const fullUrl = `${baseUrl}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`;
          getApi(fullUrl);
        }
    
        async function getApi(bdcApi) {
          try {
            const response = await fetch(bdcApi);
            if (!response.ok) {
              console.error("Error en la respuesta de la API:", response.status);
              return;
            }
            const data = await response.json();
            sessionStorage.setItem("datosGeo", JSON.stringify(data));
            handleApiResponse(data);
          } catch (error) {
            console.error("Error al llamar a la API:", error);
          }
        }
        
        function handleApiResponse(datosGeo) {
        
          const geolatitude = datosGeo.latitude;
          const geolongitude = datosGeo.longitude;
          const Pais = datosGeo.countryName;
          const Ciudad = datosGeo.city ?? '';
          const Localidad = datosGeo.locality;

          sessionStorage.setItem("latitud", geolatitude);
          sessionStorage.setItem("longitud", geolongitude);
          sessionStorage.setItem("pais", Pais);
          sessionStorage.setItem("ciudad", Ciudad);
          sessionStorage.setItem("localidad", Localidad);
        }

        //request for location and IP
        getLocation();
    
        //Capturar la IP
        async function getIpClient() {
          try {
            const response = await fetch('https://api.ipify.org?format=json');
            const dataIp = await response.json();
            sessionStorage.setItem("ipeCliente", dataIp.ip);
          }
          catch (error1) {
            console.warn("Fallo ipify:", error1); 
            try {
              const response = await fetch('https://ipinfo.io/json');
              const dataIp = await response.json();
              sessionStorage.setItem("ipeCliente", dataIp.ip);
            } 
            catch (error2) {
              console.warn("Fallo ipinfo:", error2);
              try {
                  const response = await fetch('https://ipapi.co/json/');
                  const dataIp = await response.json();
                  sessionStorage.setItem("ipeCliente", dataIp.ip);
              } 
              catch (error3) {
                  console.error("No se pudo obtener la IP desde ningún servicio", error3);
              }
           }
          }
        }
    
        setTimeout(getIpClient, 500);
    }, []);

  return null;
}