import axios from "axios";

const API_URL = "/api/Auth";

const login = async (usuario, clave) => {
  const response = await axios.post(`${API_URL}/login`, { usuario, clave });
  return response.data;
};

const recuperar = async (email) => {
  await axios.post(`${API_URL}/recuperar`, { email });
};

const resetear = async (token, nuevaClave) => {
  await axios.post(`${API_URL}/resetear`, { token, nuevaClave });
};

export default { login, recuperar, resetear };