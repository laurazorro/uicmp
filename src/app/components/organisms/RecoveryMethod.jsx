import React, {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { getFlowData, updatedFlowData } from "../../utils/sessionManager";
import axios from "axios";
import { BASE_PATH, urlNovedades } from '../../utils/constants';

import TituloGeneral from "../atoms/Titulo_general";
import SubtituloGeneral from "../atoms/Subtitulo_general";
import AlertaIndex from "../atoms/Alerta_Index";
import OptionOtp from "../atoms/OptionOtp";
import BotonPrimario from "../atoms/Boton_primario";
import Alert from "../atoms/Alert";
import Return from "../atoms/Return";
import LinkInLine from "../atoms/LinkInLine";
import Modal from "../atoms/Modal";

export default function RecoveryMethod() {
    const [sessionStorageValue, setSessionStorageValue] = useState(null);
    // Constantes para alerta
    const [alertaVisible, setAlertaVisible] = useState(false);
    const [alertaClase, setAlertaClase] = useState('');
    const [alertaTipo, setAlertaTipo] = useState('');
    const [alertaMensaje, setAlertaMensaje] = useState('');
    const [alertaTitulo, setAlertaTitulo] = useState('');

    // Constantes para modal
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [modalClase, setModalClase] = useState('');
    const [modalTipo, setModalTipo] = useState('');
    const [modalMensaje, setModalMensaje] = useState('');
    const [modalTitulo, setModalTitulo] = useState('');
    const [modalButtonText, setModalButtonText] = useState('');

    //Datos Cliente
    const [data, setData] = useState(null);

    const [selectedMethod, setSelectedMethod] = React.useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [functionCerrar, setFunctionCerrar] = useState(() => () => {});
    const [msg, setMsg] = useState(null);
  
    // Obtener el router para la navegación
    const router = useRouter();

    const handleOptionSelect = (method) => {
        setSelectedMethod(method);
    };

    const cerrar = () => {
        setAlertaVisible(false);
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

    const handleRecoveryButton = async (e) => {
        e.preventDefault();

        // Limpiar alerta antes de enviar
        setAlertaClase('alert alert-dismissible');
        setAlertaMensaje('');
        setAlertaVisible(false);

        if (!selectedMethod) {
            setAlertaClase('alert-danger');
            setAlertaTipo('danger');
            setAlertaMensaje('Por favor diligencia todos los campos');
            setAlertaTitulo('¡Atención!');
            setAlertaVisible(true);
            handleDisableFields();
        }

        let responseSendOtp;
        let username = data.documentNumber;
        try {
            responseSendOtp = await axios.post(`${BASE_PATH}/api/sendOtp`, {username, selectedMethod});
            responseSendOtp = responseSendOtp.data;
        } catch (error) {
            console.error("Error al enviar OTP:", error);
            showModal({
                clase: 'modal-danger',
                tipo: 'error',
                titulo: '¡Atención!',
                mensaje: 'Detectamos un inconveniente al enviar el código. Inténtalo nuevamente . Si el problema persiste inténtalo más tarde.',
                btnText: 'Reintentar',
                cerrarFunc: () => {setShowSuccessModal(false)}
                });
                return;
        }

        sendOtpValidation(responseSendOtp);
    };

    const sendOtpValidation = async (response) => {
        if (response.code === 201) {
            updatedFlowData("recovery-flow", {selectedMethod: selectedMethod});
            const url = `/rec/validate?${sessionStorageValue || ''}`;
            router.push(url);
        } else {
            const dataCode = response.data?.code;
            switch (dataCode) {
                case 302: // SMS Token bloqueado
                case 352: // E-Mail Token bloqueado
                    showModal({
                        clase: 'modal-danger',
                        tipo: 'error',
                        titulo: 'Bloqueo de medio',
                        mensaje: 'Medio bloqueado por exceso de intentos fallidos. Intenta de nuevo en 24 horas',
                        btnText: 'Reintentar',
                        cerrarFunc: () => {setShowSuccessModal(false)}
                    });
                    break;
                default:
                    showModal({
                        clase: 'modal-danger',
                        tipo: 'error',
                        titulo: '¡Atención!',
                        mensaje: 'Detectamos un inconveniente al enviar el código. Inténtalo nuevamente . Si el problema persiste inténtalo más tarde.',
                        btnText: 'Reintentar',
                        cerrarFunc: () => {setShowSuccessModal(false)}
                    });
            }
        }
    }

    const returnHome = () =>  {
        const storedValue = sessionStorage.getItem('parameters');
        const url = `/?${storedValue || ''}`;
        router.push(url);
    };

    useEffect(() => {
        const storedValue = sessionStorage.getItem('parameters');
        setSessionStorageValue(storedValue);
        const dataUser = getFlowData("recovery-flow");
        if (!dataUser) {
           returnHome();
        } else {
            setData(dataUser);
            switch(dataUser.typeDocument) {
                case 'cc':
                case 'ce':
                   setMsg(
                        <>
                            Si los datos de contacto no son correctos o tienes un bloqueo del medio ingresa{' '}
                            <LinkInLine url={`/evidente/search?${sessionStorageValue}`}>aquí</LinkInLine>
                        </>
                    ); 
                    break;
                case 'ni':
                     setMsg(
                        <>
                            Si los datos de contacto no son correctos o tienes un bloqueo del medio ingresa{' '}
                            <LinkInLine url={urlNovedades}>aquí</LinkInLine>
                        </>
                    ); 
                    break;
                case 'pt':
                    setMsg(
                       <>
                            Haz clic{' '}
                            <button
                                onClick={() => showModal({
                                    clase: 'modal-danger',
                                    tipo: 'error',
                                    titulo: '¡Atención!',
                                    mensaje: 'Para actualizar tus datos, por favor dirígete a una de nuestras sedes Compensar autorizadas (Av. 68, SanRoque, Calle 94, Suba o Kennnedy).',
                                    btnText: 'Entiendo',
                                    cerrarFunc: () => {returnHome();}
                                    }
                                )}
                                className="text-orange-600 hover:text-orange-700 inline-flex font-semibold text-xs cursor-pointer"
                            >
                            aquí
                            </button>{' '}
                            si tus datos no son correctos o generaste bloqueo por canal
                        </>
                    );
                    break;
                default:
                     setMsg("Si los datos de contacto no son correctos o tienes un bloqueo del medio ingresa");
                     break; 
            }
            setLoading(false);
        }
    },[]);

    useEffect(() => {
        setIsFormValid(selectedMethod != null);
    }, [selectedMethod]);

    return(
        <div className="relative flex flex-col mt-14 mx-4 w-full min-[640px]:w-[60%] lg:-ml-[8%] lg:mt-2">
            <TituloGeneral> Elige el medio </TituloGeneral>
            <span className="m-2"></span>
            <SubtituloGeneral> Recibirás un código de verificación</SubtituloGeneral>
            <AlertaIndex 
                clase={'max-w-80 '+alertaClase}
                mostrar={alertaVisible ? 'block' : 'none'}
                mensaje={alertaMensaje}
                cerrar={cerrar}
                tipo={alertaTipo}
                titulo={alertaTitulo}
            />
            {loading ? (
                <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Cargando...</p>
                </div>
            ) : (
                <>
                <form className={`text-center max-w-screen-lg ${
                alertaVisible ? '' : 'mt-2'}`} onSubmit={handleRecoveryButton}>
                    <ul className="grid gap-4">
                        <li><OptionOtp option="mail" onSelect={handleOptionSelect}>{data.mail}</OptionOtp></li>
                        <li><OptionOtp option="sms" onSelect={handleOptionSelect}>{data.phone}</OptionOtp></li>
                    </ul>
                    <BotonPrimario type="submit" disabled={!isFormValid}>Empezar</BotonPrimario>                
                    </form>
                    <Alert
                        clase='alert-dark'
                        mensaje={msg}
                        tipo='info'
                    />
                </>
            )}
            <Return url="search"/>

            {/**Modal */}
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