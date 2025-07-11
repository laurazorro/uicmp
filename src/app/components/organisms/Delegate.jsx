import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

import { BASE_PATH, SINCONV } from '../../utils/constants';
import {} from '../../utils/delegateValidations';

import TituloGeneral from "../atoms/Titulo_general";
import SubtituloGeneral from "../atoms/Subtitulo_general";
import StrongText from "../atoms/StrongText";
import Paginador from "../molecules/Paginador";
import BotonPrimario from "../atoms/Boton_primario";
import ButtonSecondary from "../atoms/ButtonSecondary"
import Modal from "../atoms/Modal";

export default function Delegate() {

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [usuarioPersonal, setUsuarioPersonal] = useState({});
  const [delegados, setDelegados] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState("");
  const delegadosPorPagina = 3;
  const [paginaActual, setPaginaActual] = useState(1);
  const totalPaginas = Math.ceil(delegados.length / delegadosPorPagina);
  const inicio = (paginaActual - 1) * delegadosPorPagina;
  const delegadosPagina = delegados.slice(inicio, inicio + delegadosPorPagina);
  const [loading, setLoading] = useState(true);
  const [endpoint, setEndpoint] = useState('');
  const [csrfVal, setCsrfVal] = useState('');

  useEffect(() => {
    const callRepresentados = async (ciamIDproxy, protocolo) => {

      try {
        const delegatesList = await axios.get(`${BASE_PATH}/api/edge`, { params: { ciamIDproxy } });
        
        if (
          (Array.isArray(delegatesList.data) && delegatesList.data.length === 0) ||
          (typeof delegatesList.data === 'object' && delegatesList.data !== null && Object.keys(delegatesList.data).length === 0)
        ) {
          // Si la lista de delegados está vacía, mostrar un modal de error
          setShowSuccessModal(true);
          return;
        }
        
        // Imprimir lista de delegados
        console.log("Respuesta del Servicio:", delegatesList.data);
        const titular = delegatesList.data.filter((persona) => persona.proxy === true);
        let usuarioPersonalOne = {
            id: titular[0].ciamId,
            nombre: titular[0].name,
        };
        setUsuarioPersonal(usuarioPersonalOne);
        console.log("Usuario Personal:", usuarioPersonalOne);

        const delegates = delegatesList.data.filter((delegate) => delegate.proxy === false);
        let delegadosArray = delegates.map((delegado) => ({
            id: delegado.ciamId,
            nombre: delegado.name,
        }));
        setDelegados(delegadosArray);
        console.log("Delegados:", delegadosArray);

        // Calcular el endpoint según el protocolo y el CSRF
        let endpoint = "oidcauthentication/representative";
        if (protocolo == "SAML") endpoint = "samlauth/represented";
        setEndpoint(endpoint);
        
        let csrf = verCsrf();
        setCsrfVal(csrf);

        setLoading(false);

      } catch (err) {
        setShowSuccessModal(true);
        return err;
      }
    };

    callRepresentados(verProxy(), verProtocolo());
  }, []);

  // Separa parametros que llegan en la url y devuelve su contenido
  const getUrlParameter = (sParam) => {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) 
        return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  };

  // Función para obtener el proxy del usuario (simulada)
  const verProxy = () => {
    return getUrlParameter('ciamId');
  };

  // Función para obtener el protocolo del usuario (simulada)
  const verProtocolo = () => {
    return getUrlParameter('protocol');
  };

  const verCsrf = () => {
    return getUrlParameter('_csrf') || "undefined";
  };

  const returnHome = () => {
    setShowSuccessModal(false);
    // Aquí puedes redirigir al usuario a la página de inicio o a otra página
    //TO DO: Redireccionar al invocador
  };

  const ingresar = () => {
    setRolSeleccionado('');
    const form = document.getElementById('formdelegados');
    form.submit();
  };

  return (
    <div className="relative flex flex-col rounded-xl mt-14 min-[1024px]:mt-4 mx-8 w-50 lg:w-[85%] lg:mr-[15%] lg:ml-[8%]">
      <TituloGeneral> Bienvenido a Compensar </TituloGeneral>
      <SubtituloGeneral>
        Tienes más de una cuenta asignada. <br />
        Elige un rol para iniciar sesión en Compensar.
      </SubtituloGeneral>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : (

      <div className="w-full max-w-screen-lg sm:w-full">
        <div className="flex flex-col" id="principal">
          {/* Cuenta personal */}
          <StrongText>Mi cuenta personal</StrongText>
          <div className="flex gap-4 mt-2 mb-2">
            <button
              className={`flex-1 text-left rounded-full px-2 py-1 transition border ${
                rolSeleccionado === usuarioPersonal.id
                  ? "border-orange-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                  : "border-gray-300 hover:border-orange-600"
              }`}
              onClick={() => setRolSeleccionado(usuarioPersonal.id)}
            >
              <Image
                className="inline-flex"
                src={`${BASE_PATH}/person_icon.svg`}
                alt="Icono usuario personal"
                width={25}
                height={26}
                priority
              />
              <span
                className={`font-medium ml-4 text-sm ${
                  rolSeleccionado === usuarioPersonal.id
                    ? "text-orange-700"
                    : "text-gray-700"
                }`}
              >
                {usuarioPersonal.nombre}
              </span>
            </button>
          </div>

          {/* Delegados */}
          <StrongText>Representante de</StrongText>
          <div className="space-y-2 mt-2 mb-3">
            {delegadosPagina.map((delegado) => (
              <div className="flex items-center gap-4" key={delegado.id}>
                <button
                  className={`flex-1 text-left rounded-full px-2 py-1 transition border ${
                    rolSeleccionado === delegado.id
                      ? "border-orange-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                      : "border-gray-300 hover:border-orange-600"
                  }`}
                  onClick={() => setRolSeleccionado(delegado.id)}
                >
                  <Image
                    className="inline-flex"
                    src={`${BASE_PATH}/company_icon.svg`}
                    alt="Icono compañía"
                    width={25}
                    height={26}
                    priority
                  />
                  <span
                    className={`font-medium ml-4 text-sm ${
                      rolSeleccionado === delegado.id
                        ? "text-orange-700"
                        : "text-gray-700"
                    }`}
                  >
                    {delegado.nombre}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <Paginador
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            setPaginaActual={setPaginaActual}
          />

          <form
            action={`${SINCONV}/${endpoint}`}
            method="POST"
            name="formdelegados"
            id="formdelegados"
            autoComplete="off"
          >
            <input type="hidden" id="_csrf" name="_csrf" value={csrfVal} />
            <input type="hidden" id="ciamid" name="representedCiamId" value={rolSeleccionado} />
          </form>
        </div>

        {/* Botón ingresar */}
        <div className="text-center">
          <BotonPrimario
            onClick={ingresar}
            disabled={rolSeleccionado === ""}
          >
            Ingresar
          </BotonPrimario>
          <br />
          <ButtonSecondary
            type="button"
            onClick={() => alert(`Ingresando como: ${rolSeleccionado}`)}
          >
            Cancelar
          </ButtonSecondary>{/** TO DO: Redireccionar al invocador */}
        </div>
      </div>
      )}
      {/**Modal */}
      {showSuccessModal && (
        <Modal
          clase="modal-warning"
          isOpen={showSuccessModal}
          onClose={returnHome}
          tipo='warning'
          title="Atención"
          buttonText="Entiendo"
          onButtonClick={returnHome}
        >
          <p className="text-left text-gray-700">Estimado usuario da clic en "Entiendo" para continuar con tu proceso.</p>
        </Modal>
      )}
    </div>
  );
}