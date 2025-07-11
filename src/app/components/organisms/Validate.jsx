'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import TituloGeneral from "../atoms/Titulo_general";
import AlertaIndex from "../atoms/Alerta_Index";
import LinkInLine from "../atoms/LinkInLine";
import CampoTipoDocumento from "../atoms/Campo_tipo_documento";
import CampoNumeroDocumento from "../atoms/Campo_numero_documento";
import BotonPrimario from "../atoms/Boton_primario";
import Return from "../atoms/Return";
import Modal from "../atoms/Modal";

import { blockAction, typesDocSpecs, validateInactivity } from "../../utils/indexValidations";
import { BASE_PATH } from '../../utils/constants';
import { setFlowData } from "../../utils/sessionManager";

export default function Validate() {
    const router = useRouter();

    const [sessionStorageValue, setsessionStorageValue] = useState(null);

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [typeDocument, setTypeDocument] = useState(null);
    const [documentNumber, setDocumentNumber] = useState('');
    const [isDocumentNumberEnabled, setIsDocumentNumberEnabled] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isTypeDocEnabled, setIsTypeDocEnabled] = useState(false);
    
    // Constantes para alerta
    const [alertaVisible, setAlertaVisible] = useState(false);
    const [alertaClase, setAlertaClase] = useState('');
    const [alertaTipo, setAlertaTipo] = useState('');
    const [alertaMensaje, setAlertaMensaje] = useState('');
    const [alertaTitulo, setAlertaTitulo] = useState('¡Atención!');
    
    // Constantes para modal
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [modalClase, setModalClase] = useState('');
    const [modalTipo, setModalTipo] = useState('');
    const [modalMensaje, setModalMensaje] = useState('');
    const [modalTitulo, setModalTitulo] = useState('');
    const [modalButtonText, setModalButtonText] = useState('');

    const [functionCerrar, setFunctionCerrar] = useState(() => () => {});

    const nombre_apps = {
        "IB2": "app Billetera móvil",
        "IS2": "app Compensar salud",
        "IP2": "Plataforma de Bienestar"
    };

    const buildCerrarFunction = (callback) => {
        return () => {
            setAlertaVisible(false);
            setIsTypeDocEnabled(false);
            setIsDocumentNumberEnabled(true);
            setIsFormValid(false);
            if (callback) callback();
        };
    };

    const cerrarFunction = functionCerrar;

    const handleSelectChange = (document) => {
        setSelectedDocument(document);
        if( document !== null ){ 
            setTypeDocument(document.code); 
        }
        else { 
            setTypeDocument(document); 
        }
        setIsDocumentNumberEnabled(!!document); 
        setDocumentNumber(""); 
    };

    const handleDocumentNumberChange = (value) => {
        setDocumentNumber(value);
    };

    const handleActionDenied = (e) => {
        blockAction(e, { setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible });
    };

    const handleDisableFields = () => {
        setIsTypeDocEnabled(true);
        setIsDocumentNumberEnabled(false);
    };

    const FieldsValue = () => {
        setSelectedDocument('0');
        setDocumentNumber("");
    }

    const returnHome = () =>  {
        const url = `/?${sessionStorageValue || ''}`;
        router.push(url);
    }

    const redirectEvidente = () =>  {
        const url = `/evidente/search?${sessionStorageValue || ''}`;
        router.push(url);
    }

    const showAlert = ({ type, clase, titulo, mensaje, cerrarFunc = () => buildCerrarFunction() }) => {
        setAlertaClase(clase);
        setAlertaTipo(type);
        setAlertaTitulo(titulo);
        setAlertaMensaje(mensaje);
        setAlertaVisible(true);
        setFunctionCerrar(() => cerrarFunc());
    };

    const showModal = ({ tipo, clase, titulo, mensaje, btnText, cerrarFunc }) => {
        setModalClase(clase);
        setModalTipo(tipo);
        setModalTitulo(titulo);
        setModalMensaje(mensaje);
        setModalButtonText(btnText);
        setFunctionCerrar(() => cerrarFunc());
        setShowSuccessModal(true);
    };

    const handleRecoveryButton = async (e) => {
        e.preventDefault();

        setAlertaClase('alert alert-dismissible');
        setAlertaMensaje('');
        setAlertaVisible(false);

        if (!typeDocument || !documentNumber) {
            setAlertaClase('alert-danger');
            setAlertaTipo('danger');
            setAlertaMensaje('Por favor diligencia todos los campos');
            setAlertaVisible(true);
            handleDisableFields();
        }

        let exampleAlert;
        console.log(documentNumber);
        switch(documentNumber){
            case "1234": {
                exampleAlert = 1;
                break;
            }
            case "12345": {
                exampleAlert = 3;
                break;
            }
            default: {
                exampleAlert = 2;
                break;
            }
        }

        let responseGetByDocument;
        try {
            responseGetByDocument = await axios.get(`${BASE_PATH}/api/recoverySearch?type=`+exampleAlert);
            responseGetByDocument = responseGetByDocument.data;
        } catch (error) {
            responseGetByDocument = error.response.data;
        }
        
        const appRole = responseGetByDocument[0]?.appRole;
        const serviceProvider = sessionStorage.serviceProviderName;
        
        const inactiveApp = validateInactivity(appRole, serviceProvider);

        RecoveryAnalyze(responseGetByDocument, inactiveApp);
    }

    const handleErrorByCode = (code) => {
        const commonClose = () => buildCerrarFunction();

        const alerts = {
            "RVUF01": { //VUAS - usuario no tiene cuenta
                mensaje: (
                    <>
                        El número de documento no tiene una cuenta asociada. Revisa si los datos ingresados son correctos o crea una cuenta{' '}
                        <LinkInLine url={`/?${sessionStorageValue}`}>aquí</LinkInLine>
                    </>
                ),
                clase: 'alert-warning',
                tipo: 'warning'
            },
            "RFRF02-713": { //Fraude - Regla 6
                mensaje: (
                    <>
                        Proceso fallido, intenta más tarde y realiza la recuperación de la contraseña en <span className="font-medium text-orange-700">"Olvidaste tu contraseña"</span>
                    </>
                ),
                clase: 'alert-warning',
                tipo: 'warning'
            },
            "Bloqueo": { //VUAS - cuenta bloqueada por límite de intentos de  recuperación
                mensaje: 'Por seguridad tu cuenta ha sido bloqueada, haz superado los intentos de recuperación por día, por favor intenta en 24 horas',
                clase: 'alert-danger',
                tipo: 'error',
                cerrarFunc: () => buildCerrarFunction(returnHome)
            },
            "RDIT01": { //Errores técnicos asciados a directorio 
                mensaje: 'Estamos presentando intermitencias en nuestros servicios. Por favor, inténtalo más tarde.',
                clase: 'alert-danger',
                tipo: 'error'
            },
            "RFRT01": { //Errores técnicos asciados a  fraude- Analyze
                mensaje: 'Estamos presentando intermitencias en nuestros servicios. Por favor, inténtalo más tarde.',
                clase: 'alert-danger',
                tipo: 'error'
            },
            "RFRF03-713": { //Fraude - Regla 7 - Regla 8
                mensaje: 'Transacción Fallida, para validar tu caso radica una PQRS.',
                clase: 'alert-warning',
                tipo: 'warning'
            },
            "RDIF01": "showRDIF01Modal" //Sin datos de contacto
        };

        if (code === "RDIF01") {
            handleRDIF01Case();
            return;
        }

        const alert = alerts[code];
        if (alert) {
            showAlert({
                ...alert,
                titulo: '¡Atención!',
                cerrarFunc: alert.cerrarFunc || commonClose
            });
            handleDisableFields();
        }
    };

    const handleRDIF01Case = () => {
        handleDisableFields();
        //Sin datos de contacto
        const comunMsg = 'El usuario no registra datos de contacto. ';
        if (['cc', 'ce'].includes(typeDocument)) {
            showModal({
                clase: 'modal-info',
                tipo: 'info',
                titulo: '¡Atención!',
                mensaje: comunMsg + 'Haz clic en el botón continuar para realizar la validación de identidad con otro método o acércate a Compensar Av. 68, San Roque, Calle 94, Suba o Kennedy para actualizar datos',
                btnText: 'Continuar',
                cerrarFunc: () => buildCerrarFunction(redirectEvidente)
            });
        } else {
            showModal({
                clase: 'modal-danger',
                tipo: 'error',
                titulo: '¡Atención!',
                mensaje: comunMsg + 'Acércate a una de nuestras sedes Compensar Av. 68, San Roque, Calle 94, Suba o Kennedy para actualizar tus datos',
                btnText: 'Entiendo',
                cerrarFunc: () => buildCerrarFunction(returnHome)
            });
        }
    };

    const RecoveryAnalyze = (response, inactiveApp) => {
        const { actualInArray, appRoleActual } = inactiveApp;

        if (Array.isArray(response)) response = response[0];
        //Validación cuenta inactiva APPs

        if (actualInArray) {
            showAlert({
                type: 'warning',
                clase: 'alert-warning',
                titulo: '¡Atención!',
                mensaje: (
                    <>
                        El tipo y número de documento ingresado no tiene una cuenta asociada en la{' '}
                        {nombre_apps[appRoleActual]}, verifica o crea una cuenta{' '}
                        <LinkInLine url={`/?${sessionStorageValue}`}>aquí</LinkInLine>
                    </>
                ),
            });
            handleDisableFields();
            FieldsValue();
            return;
        }

        const phone = response?.phonePreferred?.phoneNumber;
        const mail = response?.emailPreferred?.email;

        if (!phone && !mail) {
            handleErrorByCode(response.component);
        } else {
            const name = `${response.firstName}${response.middleName}`;
            const surname = `${response.paternalSurname}${response.maternalSurname}`;

            setFlowData("recovery-flow", {
                documentNumber,
                typeDocument,
                name,
                surname,
                mail,
                phone,
            }, 15);

            const url = `/rec/method?${sessionStorageValue || ''}`;
            router.push(url);
        }
    };

    useEffect(()  => {
        const storedValue = sessionStorage.getItem('parameters');
        setsessionStorageValue(storedValue);

        sessionStorage.removeItem("recovery-flow");

    }, []);

    useEffect(() => {
        const isFilled =
          selectedDocument !== 0 &&
          documentNumber.trim() !== '';
    
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
      }, [selectedDocument, documentNumber]);
    
    return(
        <div className="relative flex flex-col mt-14 mx-4 w-50 lg:w-[60%] lg:-ml-[8%] lg:mt-2">
            <TituloGeneral> Recuperar mi contraseña </TituloGeneral>
            <AlertaIndex 
                clase={'max-w-80 '+alertaClase}
                mostrar={alertaVisible ? 'block' : 'none'}
                mensaje={alertaMensaje}
                cerrar={cerrarFunction}
                tipo={alertaTipo}
                titulo={alertaTitulo}
            />
            <form className={`text-center max-w-screen-lg ${
            alertaVisible ? '' : 'mt-4'}`} onSubmit={handleRecoveryButton}>
                <div className="mb-1 flex flex-col gap-4">
                    <CampoTipoDocumento
                        selectedDocument={selectedDocument}
                        onChange={handleSelectChange}
                        disabled={isTypeDocEnabled}
                        type= "flr"
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
                </div>
                <BotonPrimario type="submit" disabled={!isFormValid}>Empezar</BotonPrimario>
            </form>
            <Return url=""/>
            {/**Modal */}
                        {showSuccessModal && (
                            <Modal
                                clase={modalClase}
                                isOpen={showSuccessModal}
                                onClose={returnHome}
                                tipo={modalTipo}
                                title={modalTitulo}
                                buttonText={modalButtonText}
                                onButtonClick={functionCerrar}
                            >
                                <p className="text-left text-gray-700">{modalMensaje}</p>
                            </Modal>
                        )}
        </div>
    );
}