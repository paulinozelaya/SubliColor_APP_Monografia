import axios from "axios";

const API_URL = "/api/Clientes";

const getAll = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

const create = async (cliente) => {
  const res = await axios.post(API_URL, cliente);
  return res.data;
};

const update = async (id, cliente) => {
  await axios.put(`${API_URL}/${id}`, cliente);
};

const remove = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default { getAll, getById, create, update, remove };