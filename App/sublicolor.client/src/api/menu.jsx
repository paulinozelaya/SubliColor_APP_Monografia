import axios from "axios";

const API_URL = "/api/Menu";

const getMenuJerarquico = async (idUsuario) => {
  const response = await axios.get(`${API_URL}/usuario/${idUsuario}/jerarquia`);
  return response.data;
};

export default { getMenuJerarquico };