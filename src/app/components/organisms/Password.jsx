"use client";
import React, { useState, useEffect } from "react";
import TituloGeneral from "../atoms/Titulo_general";
import InputPassword from "../atoms/InputPassword";
import BotonPrimario from "../atoms/Boton_primario";
import ButtonSecondary from "../atoms/ButtonSecondary";
import AlertaIndex from "../atoms/Alerta_Index";
import Modal from "../atoms/Modal";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getFlowData } from "../../utils/sessionManager";
import { blockAction } from "../../utils/indexValidations";

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

export default function Password() {
  // Estados para las contraseñas
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validación de la contraseña
  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword;
  let isFormValid =
    passwordValidation.isValid && passwordsMatch && confirmPassword.length > 0;

  // Alertas
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaClase, setAlertaClase] = useState("");
  const [alertaTipo, setAlertaTipo] = useState("");
  const [alertaMensaje, setAlertaMensaje] = useState("");
  const [alertaTitulo, setAlertaTitulo] = useState("");
  const [functionCerrar, setFunctionCerrar] = useState(() => () => {});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [data, setData] = useState(null);

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

  // Función consumir servicio change
  const handleSubmit = (e) => {
    e.preventDefault();
    let code;
    console.log(data);
    if (isFormValid) {
      isFormValid = false;
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
      setShowSuccessModal(true);
    } else if ( code === 10003) {
      showAlert({
        type: 'warning',
        clase: 'alert-warning',
        titulo: '¡Atención!',
        mensaje: 'Lo sentimos, por seguridad te recomendamos recuperar tu contraseña o intenta acceder más tarde',
        cerrarFunc: () => {returnHome();}
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
    } else if ( code === 169) {
      //VUAS  - Politicas de contraseña información fecha de nacimiento
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'Tu contraseña no puede contener datos de tu fecha de nacimiento.  intenta con una diferente.',
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
    } else if ( code === 167) {
      //VUAS  - Politicas de contraseña Contraseña Inválida - teléfono 
      showAlert({
        type: 'error',
        clase: 'alert-danger',
        titulo: '¡Atención!',
        mensaje: 'Por seguridad, evita incluir tu número de tu celular en la contraseña. Ingresa una nueva.',
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
        mensaje: 'Ya usaste esta contraseña recientemente. Por seguridad, ingresa una nueva.',
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
    const params = sessionStorage.getItem("parameters") || "";
    const queryString = params ? `?${params}` : "";
    router.push(`/${queryString}`);
  };

  const returnHome = () =>  {
     const params = sessionStorage.getItem("parameters") || "";
    const url = `/?${params || ''}`;
    router.push(url);
  };

  useEffect(() => {
    const dataUser = getFlowData("recovery-flow");
    console.log("data password", dataUser);
    if (!dataUser) {
        returnHome();
    } else {
        setData(dataUser);
    }
  },[]);

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
        <TituloGeneral>Asigna tu contraseña</TituloGeneral>
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
            <InputPassword
                id="password"
                setPassword={setPassword}
                blockAction={handleActionDenied}
                value={password}
                onFocus={() => setPasswordTouched(true)}
                label="Contraseña"
            />
            <InputPassword
                id="confirmPassword"
                setPassword={setConfirmPassword}
                blockAction={handleActionDenied}
                value={confirmPassword}
                onFocus={() => setConfirmPasswordTouched(true)}
                label="Confirmar Contraseña"
            />
            </div>

            {/* Botones */}
            <div className="text-center mb-4">
            <BotonPrimario
                type="submit"
                className="w-full "
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
        <Modal
          clase="modal-success"
          isOpen={showSuccessModal}
          onClose={returnHome}
          tipo='success'
          title="Recuperación exitosa"
          buttonText="Salir"
          onButtonClick={returnHome}
        >
          <p className="text-left text-gray-700">
            Hemos recuperado exitosamente tu contraseña 
            <br />
            <span className="font-semibold">¡Ya puedes ingresar a nuestra plataforma!</span>
            </p>
        </Modal>
    </div>
  );
}
