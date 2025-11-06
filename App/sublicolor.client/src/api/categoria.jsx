import axios from "axios";

const API_URL = "/api/Categorias";

const getAll = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

const create = async (usuario) => {
  const res = await axios.post(API_URL, usuario);
  return res.data;
};

const update = async (id, usuario) => {
  await axios.put(`${API_URL}/${id}`, usuario);
};

const remove = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default { getAll, getById, create, update, remove };
