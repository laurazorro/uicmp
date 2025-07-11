export function blockAction(e, { setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible }) {
    e.preventDefault();
    const msg = 'Acción no permitida';
    setAlertaClase('alert-info');
    setAlertaTipo('info');
    setAlertaTitulo('¡Atención!');
    setAlertaMensaje(msg);
    setAlertaVisible(true);
  
    setTimeout(() => {
        setAlertaVisible(false);
        setAlertaMensaje('');
    }, 2000);
}

export const typesDocSpecs = {
    'Cedula': {
        code: 'cc',
        exception: 9
    },
};

export const alertNoSP = ({ setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible, handleDisableFields }) => {
    const msg = 'Recuerda que debes ingresar directamente desde alguna de nuestras aplicaciones, te redireccionaremos a nuestra página web para que puedas dar continuidad a tu proceso';
    setAlertaClase('alert-info');
    setAlertaTipo('info');
    setAlertaTitulo('¡Atención!');
    setAlertaMensaje(msg);
    setAlertaVisible(true);
    handleDisableFields();
  };

export const handleSessionError = ({ setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible, handleDisableFields }) => {
  const error = sessionStorage.error;

  if (!error) return false; // No hay error en Login

  switch (error) {
    case 'loginFailure':
      alertErrorLogin('loginFailure', { setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible, handleDisableFields });
      break;
    case 'privilegeFailure':
      alertErrorLogin('privilegeFailure', { setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible, handleDisableFields });
      break;
    default:
      alertErrorLogin('desconocido', { setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible, handleDisableFields });
      break;
  }

  delete sessionStorage.error;

  return true;
};

const alertErrorLogin = (tipo, { setAlertaClase, setAlertaTipo, setAlertaTitulo, setAlertaMensaje, setAlertaVisible, handleDisableFields }) => {
    let msg = null;
    if (tipo == 'loginFailure') {
      msg = 'Datos ingresados incorrectos, intenta nuevamente. Si no recuerdas tus datos de acceso haz clic en ¿Olvidaste tu contraseña?';
      setAlertaTitulo('Datos Incorrectos');
      setAlertaClase('alert-danger');
      setAlertaTipo('error');
    }
    else if (tipo == 'privilegeFailure') {
      msg = 'Lo sentimos, por seguridad te recomendamos recuperar tu contraseña o intenta acceder más tarde';
      setAlertaTitulo('¡Atención!');
      setAlertaClase('alert-warning');
      setAlertaTipo('warning');
    }      
    else{
      msg = 'Error desconocido, por favor intenta nuevamente más tarde.';
      setAlertaTitulo('¡Error!');
    }
    setAlertaMensaje(msg);
    setAlertaVisible(true);
    handleDisableFields();
};

export const validateInactivity = ( appRole, serviceProvider ) => {
    let actualInArray = false;
    let appRoleActual = "";
    let appRolesArray = [];
    const urlApps = {
      "APPBIENESTARPRUEBAS":"IP2",
      "APP-SALUD-SP":"IS2",
      "BMOVIL-SP":"IB2",
      "PLAT-BIENESTARTEST_CLIENTE_UAT": "IP2",
      "APPBIENSTARPROD":"IP2",
      "APP-SALUD":"IS2",
      "BILLETERAMOVIL-SP":"IB2",
      "PLAT-BIENESTAR_CLIENTE": "IP2"
    };

    if(urlApps[serviceProvider] != undefined && appRole != undefined){
      appRoleActual = urlApps[serviceProvider];
      appRolesArray = appRole.split(',');
      if( appRolesArray.includes(appRoleActual) ) actualInArray = true;
    }
    return { actualInArray, appRoleActual };
};

export const agregarCampoOculto = (form, name, value) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
};