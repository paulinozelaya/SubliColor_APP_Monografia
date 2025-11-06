// src/api/rol.js
import axios from "axios";

const API_URL = "/api/RolMenu";

const getAllMenus = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const getMenusPorRol = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

const asignar = async (rol) => {
  const res = await axios.post(API_URL, rol);
  return res.data;
};

export default { getAllMenus, getMenusPorRol, asignar };