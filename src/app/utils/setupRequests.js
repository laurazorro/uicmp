export const URL_BASE = process.env.NEXT_PUBLIC_API_URL_TYPE_DOCUMENTS;
export const API_KEY_TYPE_DOCUMENTS = process.env.NEXT_PUBLIC_API_KEY_TYPE_DOCUMENTS;

export const getDominio = {
    typeDocuments: URL_BASE + "/typedocuments",
    login: URL_BASE + "/flask-backend/middleware/login",
    edgeService: URL_BASE + "/edgeServer",
};
  
export const getApiKey = {
    typeDocuments: API_KEY_TYPE_DOCUMENTS,
};