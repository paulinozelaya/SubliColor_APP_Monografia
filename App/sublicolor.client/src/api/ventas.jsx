import axios from "axios";
const API_URL = "/api/Ventas";

const getAll = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

const create = async (venta) => {
  const res = await axios.post(API_URL, venta);
  return res.data;
};

const remove = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default { getAll, getById, create, remove };