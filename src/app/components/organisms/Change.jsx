"use client";
import React, { useState, useEffect } from "react";
import TituloGeneral from "../atoms/Titulo_general";
import CampoPassword from "../atoms/Campo_password";
import InputPassword from "../atoms/InputPassword";
import BotonPrimario from "../atoms/Boton_primario";
import ButtonSecondary from "../atoms/ButtonSecondary";
import AlertaIndex from "../atoms/Alerta_Index";
import Modal from "../atoms/Modal";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { blockAction } from "../../utils/indexValidations";
import { parseJwt } from "../../utils/parseJwt";
import { redirect } from "../../utils/redirectValidation";

// Función para validar los requisitos de la contraseña
const validatePassword = (password) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*+\-()/;?,._~":{}|<=>]/.test(password);
  const hasNumber = /\d/.test(password);

  return {
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasSpecialChar,
    hasNumber,
    isValid:
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasSpecialChar &&
      hasNumber,
  };
};

export default function Change() {
  const [localStorageValue, setLocalStorageValue] = useState(null);

  // Estados para las contraseñas
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validación de la contraseña
  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword;
  const isFormValid =
    passwordValidation.isValid && passwordsMatch && confirmPassword.length > 0 && (passwordCurrent.length >= 8 && passwordCurrent.length <= 25);

  // Alertas
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaClase, setAlertaClase] = useState("");
  const [alertaTipo, setAlertaTipo] = useState("");
  const [alertaMensaje, setAlertaMensaje] = useState("");
  const [alertaTitulo, setAlertaTitulo] = useState("");
  const [functionCerrar, setFunctionCerrar] = useState(() => () => {});

  // Constantes para modal
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [modalClase, setModalClase] = useState('');
  const [modalTipo, setModalTipo] = useState('');
  const [modalMensaje, setModalMensaje] = useState('');
  const [modalTitulo, setModalTitulo] = useState('');
  const [modalButtonText, setModalButtonText] = useState('');

  let accessToken = '';
  let idToken = '';

  const handleActionDenied = (e) => {
    blockAction(e, {
      setAlertaClase,
      setAlertaTipo,
      setAlertaTitulo,
      setAlertaMensaje,
      setAlertaVisible,
    });
  };
  
  // Obtener el router para la navegación
  const router = useRouter();

  const showAlert = ({ type, clase, titulo, mensaje, cerrarFunc }) => {
    setAlertaClase(clase);
    setAlertaTipo(type);
    setAlertaTitulo(titulo);
    setAlertaMensaje(mensaje);
    setAlertaVisible(true);
    setFunctionCerrar(() => cerrarFunc);
  };

  const showModal = ({ tipo, clase, titulo, mensaje, btnText, cerrarFunc }) => {
    setModalTipo(tipo);
    setModalClase(clase);
    setModalTitulo(titulo);
    setModalMensaje(mensaje);
    setModalButtonText(btnText);
    setFunctionCerrar(() => cerrarFunc);
    setShowSuccessModal(true);
  };

  // Función consumir servicio change
  const handleSubmit = (e) => {
    e.preventDefault();
    let code;
    if (isFormValid) {
      if ( password === 'Compensar1234*' ) {
        code = 166;
      } else if ( password === 'Pruebas1234*' ) {
        code = 10003;
      } else {
        code = 201;
      }
      validateResponse(code);
    }
  };

  const validateResponse = (code) => {
    //FRAUDE
    if ( code === 201) {
      //MODAL POP UP
      showModal({
        clase: 'modal-success',
        tipo: 'success',
        titulo: 'Cambio exitoso',
        mensaje: 'Hemos cambiado correctamente tu contraseña',
        btnText: 'Salir',
        cerrarFunc: () => {redirect()}
      });
    } else if ( code === 10003) {
      //Fraude
      showAlert({
        type: 'warning',
        clase: 'alert-warning',
        titulo: '¡Atención!',
        mensaje: 'Lo sentimos, por seguridad te recomendamos recuperar tu contraseña o intenta acceder más tarde',
        cerrarFunc: () => {returnHome();}
      });
    } else if ( code === 154) {
      //VUAS - Contraseña actual no es correcta 
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'Los datos de la contraseña actual no coinciden, por favor válida nuevamente',
        cerrarFunc: () => {setAlertaVisible(false)}
      });
    } else if ( code === 157) {
      //VUAS  - Politicas de contraseña cracteres invalidos
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'No es posible asignar esta contraseña, ya que contiene caracteres especiales invalidos, ingresa una nueva',
        cerrarFunc: () => {setAlertaVisible(false)}
      });
    } else if ( code === 160) {
      //VUAS - Contraseña utilizada recientemente 
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'La contraseña ha sido usada recientemente, ingresa una nueva',
        cerrarFunc: () => {setAlertaVisible(false)}
      });
    } else if ( code === 166) {
      //VUAS  - Politicas de contraseña - Contraseña Inválida - lista exclusión
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'La contraseña no cumple con nuestras políticas de seguridad. Por favor, intenta con una diferente.',
        cerrarFunc: () => {setAlertaVisible(false)}
      });
    } else if ( code === 167) {
      //VUAS  - Politicas de contraseña Contraseña Inválida - teléfono 
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'Por seguridad, evita incluir tu número de tu celular en la contraseña. Ingresa una nueva.',
        cerrarFunc: () => {setAlertaVisible(false)}
      });
    } else if ( code === 168) {
      //VUAS  - Politicas de contraseña información del número de documento 
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'Por seguridad tu contraseña no debe contener tu número de documento, ingresa una nueva.',
        cerrarFunc: () => {setAlertaVisible(false)}
      });
    } else if ( code === 169) {
      //VUAS  - Politicas de contraseña información fecha de nacimiento
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'Tu contraseña no puede contener datos de tu fecha de nacimiento.  intenta con una diferente.',
        cerrarFunc: () => {setAlertaVisible(false)}
      });
    } else {
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'Estamos presentando intermitencias en nuestros servicios. Por favor, inténtalo más tarde.',
        cerrarFunc: () => {setAlertaVisible(false)}
      });
    }
  };

  // Función para cancelar y volver a la página de inicio
  const handleCancel = () => {
    const params = sessionStorage.getItem("params") || "";
    const queryString = params ? `?${params}` : "";
    router.push(`/${queryString}`);
  };

  const returnHome = () =>  {
    const storedValue = localStorageValue;
    const url = `/?${storedValue || ''}`;
    router.push(url);
  };

  const initialValidations = (params) => {
    if (params.hasOwnProperty('Proxy')) {
      showModal({
        clase: 'modal-danger',
        tipo: 'error',
        titulo: '¡Atención!',
        mensaje: 'No está permitido cambiar la contraseña en nombre de otra persona.',
        btnText: 'Entiendo',
        cerrarFunc: () => {redirect()}
      });
    } else {
      const now = Math.floor(Date.now() / 1000);
      const exp = params.exp;
      if (now >= exp) {
        showModal({
          clase: 'modal-warning',
          tipo: 'warning',
          titulo: '¡Atención!',
          mensaje: 'Ocurrió un error. La solicitud de cambio de contraseña se debe iniciar desde nuestra página web',
          btnText: 'Salir',
          cerrarFunc: () => {redirect()}
        });
      }
    }
  }

  useEffect(() => {
    const storedValue = sessionStorage.getItem("parameters");
    setLocalStorageValue(storedValue);
    const idTokenParam = sessionStorage.getItem("id_token");
    if (idTokenParam == null) {
      showModal({
        clase: 'modal-danger',
        tipo: 'error',
        titulo: '¡Atención!',
        mensaje: 'No has iniciado sesión. Serás redirigido a nuestra página principal.',
        btnText: 'Entiendo',
        cerrarFunc: () => {redirect()}
      });
    } else {
      idToken = idTokenParam;
      accessToken = sessionStorage.getItem("#access_token");
      sessionStorage.removeItem("id_token");
      sessionStorage.removeItem("#access_token");
      let response = parseJwt(idToken);
      console.log(accessToken);
      initialValidations(response);
    }
    
  },[]);

  // Efecto para mostrar alerta de contraseña actual y nueva no pueden ser iguales
  useEffect(() => {
    if (password === passwordCurrent && password.length > 0) {
      setAlertaVisible(true);
      setAlertaClase('alert-warning');
      setAlertaTipo('warning');
      setAlertaTitulo('¡Atención!');
      setAlertaMensaje('La contraseña nueva no puede ser igual a al actual');
    } else if (password != passwordCurrent) {
      setAlertaVisible(false);
    }
  }, [password, passwordCurrent]);
    
    
  // Efecto para mostrar alerta de contraseñas no coincidentes
  useEffect(() => {
    if (password !== confirmPassword && confirmPassword.length > 0) {
      setAlertaVisible(true);
      setAlertaClase('alert-danger');
      setAlertaTipo('error');
      setAlertaTitulo('Datos incorrectos');
      setAlertaMensaje('Las contraseñas no coinciden');
    } else if (password === confirmPassword && confirmPassword.length > 0) {
      setAlertaVisible(false);
    }
  }, [password, confirmPassword]);
    
  return (
      <div className="relative flex flex-col mt-12 lg:mt-20 mx-6 w-full max-w-md">
        <TituloGeneral>Cambiar contraseña</TituloGeneral>
        <AlertaIndex
            clase="alert-info mt-2"
            mostrar="block"
            mensaje="No uses datos personales como tu documento, fecha de nacimiento o número de celular, ten en cuenta para una contraseña segura los siguientes requisitos:"
            tipo="info"
            titulo="Por tu seguridad"
            cerrar={null}
        />

        {/* Formulario */}
        <form
            onSubmit={handleSubmit}
            className="mt-2"
            data-testid="password-form"
            autoComplete="off"
        >
            {/* Lista de requisitos */}
            <div className="mb-6">
            <ul className="text-xs text-gray-700">
                <li
                className={`flex items-center ${
                    passwordValidation.hasMinLength
                    ? "text-green-600"
                    : "text-red-600"
                }`}
                >
                {passwordValidation.hasMinLength ? (
                    <FaRegCheckCircle className="mr-2" />
                ) : (
                    <FaRegTimesCircle className="mr-2" />
                )}
                Contener un mínimo de 8 caracteres
                </li>
                <li
                className={`flex items-center ${
                    passwordValidation.hasUpperCase
                    ? "text-green-600"
                    : "text-red-600"
                }`}
                >
                {passwordValidation.hasUpperCase ? (
                    <FaRegCheckCircle className="mr-2" />
                ) : (
                    <FaRegTimesCircle className="mr-2" />
                )}
                Contener al menos una letra mayúscula
                </li>
                <li
                className={`flex items-center ${
                    passwordValidation.hasLowerCase
                    ? "text-green-600"
                    : "text-red-600"
                }`}
                >
                {passwordValidation.hasLowerCase ? (
                    <FaRegCheckCircle className="mr-2" />
                ) : (
                    <FaRegTimesCircle className="mr-2" />
                )}
                Contener al menos una letra minúscula
                </li>
                <li
                className={`flex items-center ${
                    passwordValidation.hasNumber ? "text-green-600" : "text-red-600"
                }`}
                >
                {passwordValidation.hasNumber ? (
                    <FaRegCheckCircle className="mr-2" />
                ) : (
                    <FaRegTimesCircle className="mr-2" />
                )}
                Contener al menos un número
                </li>
                <li
                className={`flex items-center ${
                    passwordValidation.hasSpecialChar
                    ? "text-green-600"
                    : "text-red-600"
                }`}
                >
                {passwordValidation.hasSpecialChar ? (
                    <FaRegCheckCircle className="mr-2" />
                ) : (
                    <FaRegTimesCircle className="mr-2" />
                )}
                Contener al menos un caracter especial (ej: !@#$%^&*)
                </li>
            </ul>
            </div>

            {/* Alerta error */}
            {alertaVisible && (
                <AlertaIndex
                    clase={alertaClase + " mt-2"}
                    mostrar="block"
                    mensaje={alertaMensaje}
                    tipo={alertaTipo}
                    titulo={alertaTitulo}
                    cerrar={() => functionCerrar()}
                />
            )}

            {/* Campos de contraseña */}
            <div className="flex flex-col gap-6">
            <CampoPassword 
                setPassword={setPasswordCurrent}
                disabled={false}
                blockAction={handleActionDenied}
                value={passwordCurrent}
                label="Contraseña actual"
            />
            <InputPassword
                id="password"
                setPassword={setPassword}
                blockAction={handleActionDenied}
                value={password}
                onFocus={() => setPasswordTouched(true)}
                label="Contraseña nueva"
            />
            <InputPassword
                id="confirmPassword"
                setPassword={setConfirmPassword}
                blockAction={handleActionDenied}
                value={confirmPassword}
                onFocus={() => setConfirmPasswordTouched(true)}
                label="Confirma la contraseña"
            />
            </div>

            {/* Botones */}
            <div className="text-center mb-4">
            <BotonPrimario
                type="submit"
                className="w-full"
                disabled={!isFormValid}
            >
                Finalizar
            </BotonPrimario>
            <br />
            <ButtonSecondary
                type="button"
                className="w-full"
                onClick={handleCancel}
            >
                Cancelar
            </ButtonSecondary>
            </div>
        </form>
        {showSuccessModal && (
          <Modal
            clase={modalClase}
            isOpen={showSuccessModal}
            onClose={returnHome}
            tipo={modalTipo}
            title={modalTitulo}
            buttonText={modalButtonText}
            onButtonClick={() => functionCerrar()}
          >
            <p className="text-left text-gray-700">{modalMensaje}</p>
          </Modal>
        )}
    </div>
  );
}
