'use client'
import '@fontsource/montserrat';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';
import axios from 'axios';
import { BASE_PATH } from '../../utils/constants'

import PageTemplate from "../templates/PageTemplate";
import FormularioLogin from "../molecules/Formulario_login";

export default function LoginPage() {

  const handleSubmit = async (typedoc, numdoc, geodata, fingerprint) => {
    try {
      const res = await axios.post(`${BASE_PATH}/api/status`, { typedoc, numdoc, geodata, fingerprint});
      return res.data;
    } catch (err) {
      console.error("Error al enviar los datos:", err);
      return {code: 500, message: "Error al enviar los datos"};
    }
  };

  return (
    <PageTemplate>
      <FormularioLogin onSubmit={handleSubmit} />
    </PageTemplate>
  );
}
