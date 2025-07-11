import axios from "axios";
import { URL_BASE, getDominio, getApiKey } from "../../app/utils/setupRequests";

export const postRequest = async (app, endpoint, headers = null, data = null) => {
  try {
    if (!URL_BASE) {
      throw new Error('Error variable url_base');
    }
    const dominio = getDominio[app];
    const url = `${dominio}${endpoint}`;
    let header_list = {
        ...headers,
        "Accept-Language": "application/json",
        "Content-Type": "application/json"
    }

    const response = await axios.post(url,data,{
        headers: header_list
    });
    return response.data;
  } catch (error) {
    console.error(`Error in ${app} request to ${endpoint}:`, error);
    throw error;
  }
};

export const getRequest = async (app, endpoint, urlParams, headers = null, params = null) => {
  try {
    if (!URL_BASE){
      throw new Error('Error variable url_base');
    }
    let config = {};
    const dominio = getDominio[app];
    let url = `${dominio}${endpoint}`;
    let header_list = {
        ...headers,
        "Accept-Language": "application/json",
        "Content-Type": "application/json"
    };


    if (urlParams) {
      url = url+params;
      config = {
        headers: header_list,
      };
    }else{
      config = {
        headers: header_list,
        params: params, 
      };
    }
    
    const response = await axios.get(url,config);
    return response.data;
  }catch (error) {
    console.error(`Error in ${app} request to ${endpoint}:`, error);
    throw error;
  }
}

export const postRequestToken = async ( app, endpoint, bearer, headers = null, data = null, params = null) => {
  try {
      const dominio = getDominio[app];
      const url = `${dominio}${endpoint}`;
      let header_list = {
          ...headers,
          Authorization: "Bearer " + bearer,
      };
      const response = await axios.post(url,data,{
          headers: header_list
      });
      return response.data;
  } catch (error) {
      console.error(`Error in request to ${uri}:`, error);
      throw error;
  }
}

export const getRequestToken = async ( app, endpoint, bearer, headers = null) => {
  try {
      const dominio = getDominio[app];
      const url = `${dominio}${endpoint}`;
      let header_list = {
          ...headers,
          Authorization: "Bearer " + bearer,
      };
      const response = await axios.get(url,{
          headers: header_list
      });
      return response.data;
  } catch (error) {
      console.error(`Error in ${app} request to ${endpoint}:`, error);
      throw error;
  }
}

export const postRequestGetToken = async (app, endpoint) => {
  try {
    if (!URL_BASE) {
      throw new Error('Error variable url_base');
    }
    let apiKey = "";
    if (app != 'typeDocuments') {
      //TO DO: SI ES EVIDENTE BUSCAR LA API KEY RANDOM 
    } else {
      apiKey = getApiKey[app];
    }
    const dominio = getDominio[app];
    const url = `${dominio}${endpoint}`;
    const response = await axios.post(url, {
      api_key: apiKey, 
    });
    const access_token = response.data.Bearer;
    return access_token;
  } catch (error) {
    throw new Error(`Error al obtener el token: ${error.message}`);
  }
}