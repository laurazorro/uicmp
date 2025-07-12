'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import PropTypes from 'prop-types';
import axios from "axios";
import { useHostApp } from '../../hooks/useHostApp';
import { BASE_PATH, SINCONV } from '../../utils/constants';
import { 
  blockAction, 
  typesDocSpecs, 
  alertNoSP, 
  handleSessionError,
  validateInactivity,
  agregarCampoOculto,
} from "../../utils/indexValidations"

import TituloGeneral from "../atoms/Titulo_general";
import SubtituloGeneral from "../atoms/Subtitulo_general";
import AlertaIndex from "../atoms/Alerta_Index";
import CampoTipoDocumento from "../atoms/Campo_tipo_documento";
import CampoNumeroDocumento from "../atoms/Campo_numero_documento";
import CampoPassword from "../atoms/Campo_password";
import Enlace from "../atoms/Enlace";
import LinkInLine from "../atoms/LinkInLine";
import BotonPrimario from "../atoms/Boton_primario";

import { IoMdFingerPrint } from "react-icons/io";

export default function Formulario_login({ onSubmit }) {

  const servicioConsumido = process.env.NEXT_PUBLIC_API_URL_TYPE_DOCUMENTS;

  const [sessionStorageValue, setSessionStorageValue] = useState(null);
  const [csrf, setCsrf] = useState(null);
  
  const { HostApp, isMobileApp } = useHostApp();
  const [isBiometricOptionAvailable, setIsBiometricOptionAvailable] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [typeDocument, setTypeDocument] = useState(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isDocumentNumberEnabled, setIsDocumentNumberEnabled] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [pubKy, setPubKy] = useState('');

  // Constantes para alerta
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaClase, setAlertaClase] = useState('');
  const [alertaTipo, setAlertaTipo] = useState('');
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [alertaTitulo, setAlertaTitulo] = useState('');

  useEffect(() => {
    const storedValue = sessionStorage.getItem('parameters');
    setSessionStorageValue(storedValue);

    const storedCsrf = sessionStorage.getItem('_csrf');
    setCsrf(storedCsrf);

    const fetchInitialData = async () => {
      const sp = sessionStorage.serviceProviderName;
      if (!sp) {
        alertNoSP({ setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible, handleDisableFields });
        return;
        //TO DO: Devolver al invocador
      }
      try {
        const pub = await axios.post(`${BASE_PATH}/api/edge`, {sp});
        setPubKy(pub.data.publicKey);
      } catch (err) {
        setInitialDataError(err);
        alertNoSP({ setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible, handleDisableFields });
        return;
        //TO DO: Devolver al invocador
      };
    };
    
    fetchInitialData();

    if (handleSessionError({ setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible, handleDisableFields })) return;
    
  }, []);

  useEffect(() => {
    const isFilled =
      selectedDocument !== 0 &&
      documentNumber.trim() !== '' &&
      password.trim() !== '' &&
      password.length >= 8;

    let isValid = false;

    if (isFilled) {
      const { code, min, max } = selectedDocument;
      const docLength = documentNumber.length;
      const isCedula = code === typesDocSpecs.Cedula.code;
      const cedulaException = typesDocSpecs.Cedula.exception;

      const isWithinRange = docLength >= min && docLength <= max;
      const isCedulaValid = !isCedula || (docLength !== cedulaException && isWithinRange);
      const isOtherValid = isCedula || isWithinRange;

      isValid = isCedulaValid && isOtherValid;
    }
    setIsFormValid(isValid);
  }, [selectedDocument, documentNumber, password]);
  
  useEffect(() => {

    if (window.HostApp) {
      // Si HostApp existe, asumimos que estamos dentro de una app móvil (WebView)
      console.log(window.HostApp);
    } else {
      // Si HostApp no existe, es una página web normal
      console.log("no encontro window.hostapp")
    }

    //window.biometricSetup = biometricSetup;
    window.biometricSetup = () => {
      console.log("Entre en biometricSetup");
      if (biometricAuthAvailable()) {
        console.log("biometricAuthAvailable true");
        setIsBiometricOptionAvailable(HostApp.biometricAuthAvailable());
      } else {
        console.log("biometricAuthAvailable false");
        setIsBiometricOptionAvailable(false);
      }
      console.log(biometricAuthAvailable());
      console.log("IsBiometricOptionAvailable",isBiometricOptionAvailable);
    };

    window.biometricAuthAvailable = () => {
      console.log("isMobileApp",isMobileApp);
      console.log("HOSTaPP",HostApp);
      if (isMobileApp && HostApp) {
        try {
          return HostApp.biometricAuthAvailable();
        }
        catch (error) {
          console.error("Error al verificar disponibilidad biométrica:", error);
          return false;
        }
      } else {
        return false; 
      }
    };

    window.loginConfirmed = (token) => {
      if (HostApp) {
        try {
          HostApp.loginConfirmed(token);
        } catch (error) {
          console.error("Error al llamar a HostApp.loginConfirmed:", error);
        }
      } else {
        console.warn("HostApp no disponible para loginConfirmed.");
      }
    };

    window.saveCredentials = (idNumber, idType, password) => {
      if (HostApp) {
        try {
          HostApp.rememberUser(idNumber, idType, password);
        } catch (error) {
          console.error("Error al llamar a HostApp.rememberUser:", error);
        }
      } else {
        console.warn("HostApp no disponible para saveCredentials.");
      }
    };

    window.biometricAuth = () => {
      if (HostApp) {
        try {
          HostApp.biometricAuth();
        } catch (error) {
          console.error("Error al llamar a HostApp.biometricAuth:", error);
        }
      } else {
        console.warn("HostApp no disponible para biometricAuth.");
      }
    };

    window.enterCredentials = (num, type, pwd) => {
      setDocumentNumber(num);
      setTypeDocument(type);
      setPassword(pwd);

      setTimeout(() => {
        //Hacer click en el botón de login
        const loginButton = document.querySelector('button[type="submit"]');
        loginButton.click();
      }, 0);
    };

    biometricSetup();
  }, [HostApp]);

  const handleSelectChange = (document) => {
    setSelectedDocument(document);
    if( document !== null ){ 
      setTypeDocument(document.code); 
    }
    else { 
      setTypeDocument(document); 
    }
    setIsDocumentNumberEnabled(!!document); // Habilita si hay un documento seleccionado
    setDocumentNumber(""); // Limpia el valor del campo número de documento
  };

  const handleDocumentNumberChange = (value) => {
    setDocumentNumber(value);
  };

  const handleActionDenied = (e) => {
    blockAction(e, { setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible });
  };

  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [isTypeDocEnabled, setIsTypeDocEnabled] = useState(false);

  const cerrar = () => {
    setAlertaVisible(false);
    setIsTypeDocEnabled(false);
    setSelectedDocument('0');
    setIsDocumentNumberEnabled(true);
    setDocumentNumber("");
    setIsPasswordEnabled(false);
    setPassword("");
  };

  const handleDisableFields = () => {
    setIsTypeDocEnabled(true);
    setIsDocumentNumberEnabled(false);
    setIsPasswordEnabled(true);
  };

  const doLogin = (password) => {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubKy);

    let reto = encrypt.encrypt(password);
    return reto;
  }

  const handleLoginButton = async (e) => {
    e.preventDefault();

    // Limpiar alerta antes de enviar
    setAlertaClase('alert alert-dismissible');
    setAlertaMensaje('');
    setAlertaVisible(false);

    if (!typeDocument || !documentNumber || !password) {
      setAlertaClase('alert-danger');
      setAlertaTipo('danger');
      setAlertaTitulo('¡Atención!');
      setAlertaMensaje('Por favor diligencia todos los campos');
      setAlertaVisible(true);
      return;
    }

    const geodataSt = {
      "ipeCliente": sessionStorage.ipeCliente,
      "serviceProviderName": sessionStorage.serviceProviderName,
      "latitud": sessionStorage.latitud,
      "longitud": sessionStorage.longitud,
      "pais": sessionStorage.pais,
      "ciudad": sessionStorage.ciudad,
      "localidad": sessionStorage.localidad,
    };

    const fingerprintSt = sessionStorage.fingerprint;

    const responseStatus = await onSubmit(typeDocument, documentNumber, geodataSt, fingerprintSt);

    const appRole = responseStatus?.appRole;
    const serviceProvider = sessionStorage.serviceProviderName;
    const nombre_apps = {
      "IB2": "app Billetera móvil",
      "IS2": "app Compensar salud",
      "IP2": "Plataforma de Bienestar"
    };

    const inactiveApp = validateInactivity(appRole, serviceProvider);

    saveCredentials(documentNumber, typeDocument, password);

    alertaFraude(responseStatus.code, inactiveApp, nombre_apps, password);
  }

  const alertaFraude = ( statusCode, inactiveApp, nombre_apps, password ) => {

    const { actualInArray, appRoleActual } = inactiveApp;
    console.warn(password);

    switch (statusCode) {
      case "VUF01-100":{
        //Usuario no existe VUAS
        const msg = (
          <>
           El tipo y número de documento ingresado no tiene una cuenta asociada, verifica o ingresa en la opción <span className="font-medium text-orange-700">"Crear cuenta"</span>
          </>
        );
        setAlertaClase('alert-warning');
        setAlertaTipo('warning');
        setAlertaTitulo('¡Atención!');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
      case "DIF01-100":{
        //Usuario no existe Directorio
        const msg = 'Transacción Fallida, para validar tu caso radica una PQRS.';
        setAlertaClase('alert-danger');
        setAlertaTipo('error');
        setAlertaTitulo('¡Atención!');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
      case "AUF01":{
        //login ciam - Datos no coinciden
        const msg = 'Datos ingresados incorrectos, intenta nuevamente. Si no recuerdas tus datos de acceso clic ¿Olvidaste tu contraseña?';
        setAlertaClase('alert-danger');
        setAlertaTipo('error');
        setAlertaTitulo('Datos Incorrectos');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
      case "VUF02-152":{
        //Usuario bloqueado por ingreso de datos incorrectos              
        if (actualInArray) {
          const msg = (
            <>
              El tipo y número de documento ingresado no tiene una cuenta asociada en la{' '}
              {nombre_apps[appRoleActual]}, verifica o crea una cuenta{' '}
              <LinkInLine url={`/?${sessionStorageValue}`}>aquí</LinkInLine>
            </>
          );
          setAlertaClase('alert-warning');
          setAlertaTipo('warning');
          setAlertaTitulo('¡Atención!');
          setAlertaMensaje(msg);
          setAlertaVisible(true);
          handleDisableFields();
        }
        else{
          const msg = (
            <>
             Por seguridad tu cuenta ha sido bloqueada, por favor seleccione la opción <span className="font-medium text-orange-700">¿Olvidaste tu contraseña?</span>
            </>
          );
          setAlertaClase('alert-danger');
          setAlertaTipo('error');
          setAlertaTitulo('¡Atención!');
          setAlertaMensaje(msg);
          setAlertaVisible(true);
          handleDisableFields();
        }
        break;
      }
      case "FRF06-713T"://Fraude - Regla 3 Login Paises Restringidos - Transversal
      case "FRF01-713T"://Fraude - Regla 5 General Cambio Pais 15 - Trasversal
      case "FRF02-713T"://Fraude - Regla 6 General 10 Tx 30 Seg - Transversal  
      {
        const msg = 'Lo sentimos, por seguridad te recomendamos recuperar tu contraseña o intenta acceder más tarde';
        setAlertaClase('alert-warning');
        setAlertaTipo('warning');
        setAlertaTitulo('¡Atención!');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
      case "FRF06-713P"://Fraude - Regla 3 Login Paises Restringidos - Personalizado
      case "FRF01-713P"://Fraude - Regla 5 General Cambio Pais 15 - Personalizado
      {
        const msg = (
          <>
           Autenticación Fallida, te invitamos a realizar la recuperación de la contraseña en la opción <span className="font-medium text-orange-700">"Olvidaste tu contraseña"</span>
          </>
        );
        setAlertaClase('alert-warning');
        setAlertaTipo('warning');
        setAlertaTitulo('¡Atención!');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
      case "FRF02-713P":{
        //Fraude - Regla 6 General 10 Tx 30 Seg - Personalizado
        const msg = (
          <>
           Falla en la autenticación, te invitamos a realizar la recuperación de la contraseña en la opción <span className="font-medium text-orange-700">"Olvidaste tu contraseña"</span>
          </>
        );
        setAlertaClase('alert-warning');
        setAlertaTipo('warning');
        setAlertaTitulo('¡Atención!');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
      case "FRF03-713-1P"://Fraude - Regla 7_8 Listas Negras - Personalizado Login_documentos_bloqueados
      case "FRF03-713-2P"://Fraude - Regla 7_8 Listas Negras - Personalizado Login_CiamId_Bloqueado
      case "FRF03-713-3P"://Fraude - Regla 7_8 Listas Negras - Personalizado Login_IP_bloqueada
      {
        const msg = 'Transacción Fallida, para validar tu caso radica una PQRS';
        setAlertaClase('alert-warning');
        setAlertaTipo('warning');
        setAlertaTitulo('¡Atención!');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
      case "FRF03-713-1T"://Fraude - Regla 7_8 Listas Negras - Transversal Login_documentos_bloqueados
      case "FRF03-713-2T"://Fraude - Regla 7_8 Listas Negras - Transversal Login_CiamId_Bloqueado
      case "FRF03-713-3T"://Fraude - Regla 7_8 Listas Negras - Transversal Login_IP_bloqueada
      case "FRF05-713T"://Fraude - Regla 9 Multisesion - Transversal
      {
        const msg = 'Lo sentimos, por seguridad te recomendamos recuperar tu contraseña o intenta acceder más tarde.';
        setAlertaClase('alert-warning');
        setAlertaTipo('warning');
        setAlertaTitulo('¡Atención!');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
      case "DIT01-500"://Error inesperado o Internal Server Error - Login Status - Directorio
      case "VUT01-500"://Error inesperado o Internal Server Error - Login Status - VUAS
      case "FRT01-500"://Error inesperado o Internal Server Error - Login Status - Fraude
      case "ENC01-505"://Error inesperado o Internal Server Error - Login Status - 505
      case "ENC02"://Error inesperado o Internal Server Error - Login - ENC02
      {
        const msg = 'En este momento estamos experimentando intermitencia en nuestros servicios web. Intenta nuevamente.';
        setAlertaClase('alert-danger');
        setAlertaTipo('error');
        setAlertaTitulo('¡Atención!');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
      case 201:
      case 202:
      case "FRF07-713P":
      case "FRF08-713":{
        //Usuario existe
        if (actualInArray) {
          const msg = (
            <>
              El tipo y número de documento ingresado no tiene una cuenta asociada en la{' '}
              {nombre_apps[appRoleActual]}, verifica o crea una cuenta{' '}
              <LinkInLine url={`/?${sessionStorageValue}`}>aquí</LinkInLine>
            </>
          );
          setAlertaClase('alert-warning');
          setAlertaTipo('warning');
          setAlertaTitulo('¡Atención!');
          setAlertaMensaje(msg);
          setAlertaVisible(true);
          handleDisableFields();
        }
        else{
          const pascifr = doLogin(password);
          console.info(`%cPassword cifrado: ${pascifr}`, 'color: green; font-size: 12px; font-weight: bold;');
          const serviceProviderName = sessionStorage.serviceProviderName;
          llamadoLogin(csrf, documentNumber, pascifr, serviceProviderName, typeDocument);
        }
        break;
      }
      case 505:
      default:{
        //Error inesperado
        const msg = 'En este momento estamos experimentado intermitencia en nuestros servicios web. Intenta nuevamente';
        setAlertaClase('alert-danger');
        setAlertaTipo('error');
        setAlertaTitulo('¡Atención!');
        setAlertaMensaje(msg);
        setAlertaVisible(true);
        handleDisableFields();
        break;
      }
    }
  };

  const llamadoLogin = (csrf, documento, passcif, serviceProviderName, tipodoc) => {

    const form = document.getElementById('loginForm');
    const typeNum = tipodoc.toLowerCase() + documento;
    const geolatitude = sessionStorage.latitud;
    const geolongitude = sessionStorage.longitud;
    const Pais = sessionStorage.pais;
    const Ciudad = sessionStorage.ciudad;
    const Localidad = sessionStorage.localidad;
    let context = '{"Username": "' + typeNum + '","Ciudad": "' + Ciudad + '", "Pais": "' + Pais + '","Localidad": "' + Localidad + '"}';

    const fingerprintLg = sessionStorage.fingerprint;

    if( csrf !== null && csrf !== undefined && csrf !== '' ){
      form.action = servicioConsumido + '/oidcauthentication/login';
      agregarCampoOculto(form, '_csrf', csrf);
    }
    else {
      form.action = servicioConsumido + '/samlauth/login';
      agregarCampoOculto(form, '_csrf', "");
    }
    
    agregarCampoOculto(form, 'typeLogin', 'alias');
    agregarCampoOculto(form, 'serviceProviderName', serviceProviderName);
    agregarCampoOculto(form, 'username', typeNum);
    agregarCampoOculto(form, 'password', passcif);
    agregarCampoOculto(form, 'context', context);
    agregarCampoOculto(form, 'device_latitude', geolatitude);
    agregarCampoOculto(form, 'device_longitude', geolongitude);
    agregarCampoOculto(form, 'browser_fingerprint', fingerprintLg);

    form.submit();
  };

  return (
      <div className="relative flex flex-col rounded-xl mt-14 mx-4 w-50 lg:w-[60%] lg:-ml-[8%]">
        <TituloGeneral>Bienvenido a Compensar</TituloGeneral>
        <SubtituloGeneral> Completa los siguientes campos</SubtituloGeneral>
        <AlertaIndex 
          clase={'max-w-80 ' + alertaClase}
          mostrar={alertaVisible ? 'block' : 'none'}
          mensaje={alertaMensaje}
          cerrar={cerrar}
          tipo={alertaTipo}
          titulo={alertaTitulo}
        />
        <form id="loginForm" method="POST" className="text-center max-w-screen-lg" onSubmit={handleLoginButton}>
          <div className="mb-1 flex flex-col gap-4">
            <CampoTipoDocumento
              selectedDocument={selectedDocument}
              onChange={handleSelectChange}
              disabled={isTypeDocEnabled}
              type= "fla"
            />
            <CampoNumeroDocumento
              min={selectedDocument?.min}
              max={selectedDocument?.max}
              Alfanumerico={selectedDocument?.Alfanumerico}
              disabled={!isDocumentNumberEnabled}
              onInputChange={handleDocumentNumberChange}
              value={documentNumber}
              blockAction={handleActionDenied}
              typeDocSelected={typeDocument}
            />
            <CampoPassword 
              setPassword={setPassword}
              disabled={isPasswordEnabled}
              blockAction={handleActionDenied}
              value={password}
            />
            <Enlace pagina={`/rec/search?${sessionStorageValue}`}>¿Olvidaste tu Contraseña?</Enlace>
          </div>
          <BotonPrimario type="submit" disabled={!isFormValid}>Ingresar</BotonPrimario>

          {isBiometricOptionAvailable && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={biometricAuth}
              id="btnBiometric"
              className="max-[1280px]:text-sm max-[1280px]:mb-2 max-[1280px]:mt-5 mt-4 mb-4 p-button w-auto rounded-full bg-orange-600 py-2 px-4 border border-transparent text-center text-white transition-all shadow-md hover:shadow-lg focus:bg-orange-600 focus:shadow-none active:bg-orange-700 hover:bg-orange-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none overflow-hidden"
            >
              <IoMdFingerPrint />
            </button>
          </div>
          )}
          
          <p className="text-gray-600 text-sm mt-5 leading-[120%]">
            ¿No tienes cuenta? 
            <Link href={`/create/search?${sessionStorageValue}`} className="font-semibold text-orange-600 hover:text-orange-700"> Crear cuenta</Link>
          </p>
          <Enlace pagina={`/delegados?${sessionStorageValue}`}>Mockup Delegados</Enlace>
          <Enlace pagina={`${SINCONV}/views/validar.html?${sessionStorageValue}`} clase="lime">¿Olvidaste tu contraseña - UI vigente?</Enlace>
          <Enlace pagina={`${SINCONV}/views/verifique.html?${sessionStorageValue}`} clase="lime">Crear cuenta persona - UI vigente</Enlace>
          <Enlace pagina={`${SINCONV}/views/verifique2.html?${sessionStorageValue}`} clase="lime">Crear cuenta empresa - UI vigente</Enlace>
        </form>
      </div>
  );
}

Formulario_login.propTypes = {
  onSubmit: PropTypes.func.isRequired
};