"use client";
import React from "react";
import StrongText from "../atoms/StrongText";
import OptionOtp from "../atoms/OptionOtp";
import Modal from "../atoms/Modal";

export default function Otp() {
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState(null);

  const handleOptionSelect = (method) => {
    setSelectedMethod(method);
    setShowSuccessModal(true);
  };

  return (
    <>
      <div className="mt-4 space-y-2">
        <StrongText>Hola</StrongText>
        <div className="mx-auto max-w-md border-x border-x-gray-200 px-4 py-6 text-gray-700 dark:border-x-gray-800 dark:bg-gray-950/10 dark:text-gray-200">
          <fieldset>
            <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
              How much do you expect to use each month?
            </h3>
            <div className="mt-4 space-y-2">
              <ul className="grid w-full gap-6">
                <li>
                  <OptionOtp 
                    option="sms" 
                    onSelect={handleOptionSelect}
                  ></OptionOtp>
                </li>
                <li>
                  <OptionOtp 
                    option="mail" 
                    onSelect={handleOptionSelect}
                  ></OptionOtp>
                </li>
              </ul>
            </div>
          </fieldset>
        </div>
      </div>
      {showSuccessModal && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="¡Éxito!"
          buttonText="Continuar"
          onButtonClick={() => setShowSuccessModal(false)}
        >
          <p className="text-center text-gray-700">Has seleccionado correctamente tu método de autenticación.</p>
          {selectedMethod && (
            <p className="mt-2 text-center text-gray-600">
              Método seleccionado: {selectedMethod === 'mail' ? 'Correo electrónico' : 'SMS'}
            </p>
          )}
        </Modal>
      )}
    </>
  );
}
