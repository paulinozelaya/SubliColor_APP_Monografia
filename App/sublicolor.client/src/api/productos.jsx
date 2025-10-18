import axios from "axios";

const API_URL = "/api/Productos";

const getAll = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

const create = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

const update = async (id, data) => {
  await axios.put(`${API_URL}/${id}`, data);
};

const remove = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default { getAll, getById, create, update, remove };