import axios from 'axios';

const URL_TYPE_DOCUMENTS = process.env.NEXT_PUBLIC_API_URL_TYPE_DOCUMENTS;
const API_KEY_TYPE_DOCUMENTS = process.env.NEXT_PUBLIC_API_KEY_TYPE_DOCUMENTS;

const getDominio = {
    typeDocuments: URL_TYPE_DOCUMENTS + "/typedocuments",
    login:  URL_TYPE_DOCUMENTS + "/flask-backend/middleware/login",
}

async function obtenerToken() {
  console.log(process.env.NEXT_PUBLIC_API_URL_TYPE_DOCUMENTS);
   console.log(process.env.NEXT_PUBLIC_API_KEY_TYPE_DOCUMENTS);
  try {
    const dominio = getDominio["typeDocuments"];
    const response = await axios.post(dominio + "/generate_token", {
      api_key: API_KEY_TYPE_DOCUMENTS,
    });
    const access_token = response.data.Bearer;
    sessionStorage.setItem('type_tk', access_token);
  } catch (error) {
    throw new Error(`Error al obtener el token: ${error.message}`);
  }
}

export async function obtenerTiposDocumento() {
  try {
    await obtenerToken();
    const dominio = getDominio["typeDocuments"];
    const accessToken = sessionStorage.getItem('type_tk');
    const response = await axios.get(dominio + "/api/v2/tiposdedocumento", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const documentosCondensados = response.data.map((documento) => ({
      code: documento.code,
      Title: documento.Title,
      Alfanumerico: documento.AlfaNumerico,
      min: documento.min.Autenticacion,
      max: documento.max.Autenticacion,
      personaAutenticacion: documento.persona.Autenticacion,
      empresaAutenticacion: documento.empresa.Autenticacion,
    }));
    return documentosCondensados.filter(
      (documento) =>
        documento.personaAutenticacion === true ||
        documento.empresaAutenticacion === true
    );
  } catch (error) {
    throw new Error(`Error al obtener tipos de documento: ${error.message}`);
  }
}

export async function postRequest(app, uri, headers, data) {
    const dominio = getDominio[app];
    const response = await axios.post(dominio+uri,data,{
      headers: headers
    });
    return response;
}

export async function getRequestWithOutToken(dominio, uri) {
    const options = {
        api_key: API_KEY_TYPE_DOCUMENTS  
    };
    const response = await (axios.get(dominio + uri, options));

    return response;
}