"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getFlowData } from "../../utils/sessionManager";
import axios from "axios";
import { BASE_PATH } from '../../utils/constants';

import TituloGeneral from "../atoms/Titulo_general";
import SubtituloGeneral from "../atoms/Subtitulo_general";
import BotonPrimario from "../atoms/Boton_primario";
import ButtonSecondary from "../atoms/ButtonSecondary";
import Alert from "../atoms/Alert";
import LinkInLine from "../atoms/LinkInLine";
import AlertaIndex from "../atoms/Alerta_Index";

export default function ValidateOTP() {
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutos en segundos
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef([]);
    const [sessionStorageValue, setSessionStorageValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMethodText, setSelectedMethodText] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");
    const [method, setMethod] = useState("");
    //Alertas
    const [alertaVisible, setAlertaVisible] = useState(false);
    const [alertaClase, setAlertaClase] = useState('');
    const [alertaTipo, setAlertaTipo] = useState('');
    const [alertaMensaje, setAlertaMensaje] = useState('');
    const [alertaTitulo, setAlertaTitulo] = useState('¡Atención!');
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    //Datos Cliente
    const [data, setData] = useState(null);
    const [responseTK, setResponseTK] = useState(null);
    const [otp, setOtp] = useState([
        { id: 'otp-0', value: '' },
        { id: 'otp-1', value: '' },
        { id: 'otp-2', value: '' },
        { id: 'otp-3', value: '' },
        { id: 'otp-4', value: '' },
        { id: 'otp-5', value: '' },
    ]);
    let username;
    const msg = (
        <>
            ¿No recibes el código? Ingresa{' '}
            <LinkInLine url={`method?${sessionStorageValue}`}>aquí</LinkInLine>
        </>
    );

    const returnHome = () =>  {
        const storedValue = sessionStorage.getItem('parameters');
        const url = `/?${storedValue || ''}`;
        router.push(url);
    };

    const redirectEvidente = () =>  {
        const storedValue = sessionStorage.getItem('parameters');
        const url = `/evidente/search?${storedValue || ''}`;
        router.push(url);
    };

    const router = useRouter();

    // Función para manejar el cambio en los inputs
    const handleChange = (index, value) => {
        // Solo permitir números
        if (value && !/^\d*$/.test(value)) return;
        
        const newOtp = [...otp];
        newOtp[index].value = value;
        setOtp(newOtp);

        // Mover al siguiente input si se ingresó un número
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Función para manejar la tecla borrar (backspace)
    const handleKeyDown = (index, e) => {
       if (e.key === 'Backspace' && otp[index].value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Efecto para el temporizador
    useEffect(() => {
        const storedValue = sessionStorage.getItem('parameters');
        setSessionStorageValue(storedValue);

        if (timeLeft === 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            setAlertaClase('alert-warning');
            setAlertaTipo('warning');
            setAlertaMensaje('El código ha expirado. Solicita uno nuevo e ingrésalo nuevamente.');
            setAlertaTitulo('¡Atención!');
            setAlertaVisible(true);
        }
    }, [timeLeft]);

    // Función para formatear el tiempo (MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Función para reenviar el código
    const  handleResendCode = async () => {
        if (timeLeft > 0) return;
        
        setIsResending(true);
        // Simular envío del código
        let responseSendOtp;
        try {
            responseSendOtp = await axios.post(`${BASE_PATH}/api/sendOtp`, {username, method});
            responseSendOtp = responseSendOtp.data;
            if (responseSendOtp.code === 201) {
                setTimeout(() => {
                    setTimeLeft(180); // Reiniciar a 3 minutos
                    setOtp(otp.map(item => ({...item, value: ''})));
                    setAlertaVisible(false);
                    setIsResending(false);
                    if (inputRefs.current[0]) {
                        inputRefs.current[0].focus();
                    }
                }, 1000);
            } else {
                setShowSuccessModal(true); 
            }
        } catch (error) {
            console.log(error);
            setShowSuccessModal(true);
        }       
    };

    const handleEnterCode = async () => {
        let responseToken;
        let code = otp.map(digit => digit.value).join('');
        console.log("cod",code)
        try {
            responseToken = await axios.post(`${BASE_PATH}/api/token`, {method, code});
            console.log("responseToken.data", responseToken.data);
            validateCode(responseToken.data);
            setResponseTK(responseToken.data);
            console.log(responseTK);
        } catch (error) {
            console.log(error);
            setAlertaClase('alert-danger');
            setAlertaTipo('error');
            setAlertaMensaje('En este momento estamos experimentado intermitencia en nuestros servicios web. Intenta nuevamente.');
            setAlertaTitulo('¡Atención!');
            setAlertaVisible(true);
        }
        
    };

    const validateCode = (response) => {
        console.log("validateCode", response);
        if(response.code == 201){
            const url = `/rec/pass?${sessionStorageValue || ''}`;
            router.push(url);
        }else{
            switch (response.code) {
                case "353":
                case "303"://bloqueo de canal
                    switch(data.typeDocument) {
                        case 'cc':
                        case 'ce':
                            setAlertaMensaje('Has superado el número de intentos permitidos. Puedes validar tu identidad por otro medio o volver a intentarlo en 24 horas.');
                            setAlertaClase('alert-info');
                            setAlertaTipo('info');
                            // Al cerrar se manejará en la función cerrar
                            break;
                        case 'ni':
                        case 'pt':
                            setAlertaMensaje('Has superado los intentos permitidos. Intenta nuevamente después de 24 horas.');
                            setAlertaClase('alert-danger');
                            setAlertaTipo('error');
                            // Al cerrar se manejará en la función cerrar
                            break;
                    }
                    setAlertaTitulo('¡Atención!');
                    setAlertaVisible(true);
                    break;
                case "952":
                    setAlertaMensaje('El código ingresado no es correcto. Verifícalo e intenta nuevamente.');
                    setAlertaClase('alert-danger');
                    setAlertaTipo('error');
                    setAlertaTitulo('¡Atención!');
                    setAlertaVisible(true);
                    break;
                default:
                    break;
            }
        }
    };

    const cerrar = (code) => {
        console.log(code);
        // Si hay un código de error específico, manejamos la redirección
        if (code) {
            switch(code) {
                case '353':
                case '303':
                    if (['cc', 'ce'].includes(data?.typeDocument)) {
                        redirectEvidente();
                    } else if (['ni', 'pt'].includes(data?.typeDocument)) {
                        returnHome();
                    }
                    break;
                default:
                    // Para otros códigos, solo cerramos la alerta
                    break;
            }
        }
        setAlertaVisible(false);
    };

    useEffect(() => {
            const storedValue = sessionStorage.getItem('parameters');
            setSessionStorageValue(storedValue);
            const dataUser = getFlowData("recovery-flow");
            console.log("data validate otp", dataUser);
            if (!dataUser) {
                returnHome();
            } else {
                setData(dataUser);
                setSelectedMethodText(dataUser.selectedMethod === 'mail' ? 'correo' : 'teléfono');
                setSelectedMethod(dataUser.selectedMethod === 'mail' ? dataUser.mail : dataUser.phone);
                setMethod(dataUser.selectedMethod);
                setLoading(false);
                username = dataUser.documentNumber;
            }
        },[]);

    return (
        <div className="relative flex flex-col mt-14 mx-4 w-50 min-[640px]:w-[60%] lg:w-[60%] lg:-ml-[8%] lg:mt-[10s%]">
            
            <TituloGeneral>Ingresa el código</TituloGeneral>

        {/*Loading*/}
        {loading ? (
                <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Cargando...</p>
                </div>
            ) : (
            <>
                {data.selectedMethod === 'mail' && (
                    <Alert
                        clase='alert-info mt-2'
                        mensaje='Recuerda revisar tu bandeja de entrada, así como las carpetas de correo no deseado y spam'
                        tipo='info'
                    />
                )}

                <SubtituloGeneral>
                    Hemos enviado un código de 6 dígitos  al {selectedMethodText} <span className="font-semibold"> {selectedMethod} </span>
                </SubtituloGeneral>
                <AlertaIndex 
                    clase={alertaClase}
                    mostrar={alertaVisible ? 'block' : 'none'}
                    mensaje={alertaMensaje}
                    cerrar={() => cerrar(responseTK?.code)}
                    tipo={alertaTipo}
                    titulo={alertaTitulo}
                />

                <div className="text-center text-sm mb-8">
                    <p className="text-gray-600">
                        <span className="font-semibold"> Ingresa el código</span>
                    </p>
                </div>
                
                {/* Inputs OTP */}
                <div className="flex justify-center gap-4 mb-8">
                    {otp.map((digit, index) => (
                        <input
                            key={digit.id}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit.value}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-[35px] h-[45px] border border-gray-600 rounded-lg text-center text-lg focus:outline-none focus:border-2 focus:border-gray-700"
                        />
                    ))}
                </div>
                
                {/* Temporizador */}
                <div className="text-center text-sm mb-2">
                    <p className="text-gray-600">
                        Tiempo restante <span className="font-semibold">{formatTime(timeLeft)} minutos</span>
                    </p>
                </div>
                
                {/* Botones */}
                <div className="text-center mb-4">
                    <BotonPrimario 
                        type="button" 
                        className="w-full"
                        disabled={otp.some(digit => digit.value.trim() === '') || timeLeft <= 0}
                        onClick={handleEnterCode}
                    >
                        Siguiente
                    </BotonPrimario>
                    <br />
                    <ButtonSecondary 
                        type="button" 
                        className="w-full"
                        onClick={handleResendCode}
                        disabled={timeLeft > 0}
                    >
                        {isResending ? 'Enviando...' : 'Reenviar código'}
                    </ButtonSecondary>
                </div>
            </>
            )}
            <Alert
                clase='alert-dark'
                mensaje={msg}
                tipo='info'
            />
            {/**Modal */}
                {showSuccessModal && (
                    <Modal
                        clase='modal-danger'
                        isOpen={showSuccessModal}
                        onClose={returnHome}
                        tipo='error'
                        title='¡Atención!'
                        buttonText= 'Reintentar'
                        onButtonClick={() => {setShowSuccessModal(false)}}
                    >
                        <p className="text-left text-gray-700">'Detectamos un inconveniente al enviar el código. Inténtalo nuevamente . Si el problema persiste inténtalo más tarde.'</p>
                    </Modal>
                )}
        </div>
    );
}