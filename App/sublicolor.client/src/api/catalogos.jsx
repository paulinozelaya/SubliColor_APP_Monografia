import axios from "axios";

const API_URL = "/api/Catalogos";

const getValores = async (codigoCategoria) => {
  const response = await axios.get(`${API_URL}/${codigoCategoria}`);
  return response.data;
};

export default { getValores };