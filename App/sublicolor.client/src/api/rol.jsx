// src/api/rol.js
import axios from "axios";

const API_URL = "/api/Roles";

const getAll = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

const create = async (rol) => {
  const res = await axios.post(API_URL, rol);
  return res.data;
};

const update = async (id, rol) => {
  await axios.put(`${API_URL}/${id}`, rol);
};

const remove = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default { getAll, getById, create, update, remove };