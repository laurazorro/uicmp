import { urlAyudaLogin, urlAyudaCambio, urlAyudaRecupEmpresa, urlAyudaRecupPersona } from "../utils/constants";

export const ayudaLinksPorFlujo = {
  auth: [
    {
        id: 'auth',
        label: 'Guía de ayuda',
        href: urlAyudaLogin,
    },
  ],
  change: [
    {
        id: 'change',
        label: 'Cambio de contraseña',
        href: urlAyudaCambio,
    },
  ],
  recovery: [
    {
        id: 'recovery1',
        label: 'Recuperación Empresa NIT',
        href: urlAyudaRecupEmpresa,
    },
    {
        id: 'recovery2',
        label: 'Recuperación Persona y Empresa natural',
        href: urlAyudaRecupPersona,
    },
  ],
};