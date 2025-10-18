import axios from "axios";

const API_URL = "/api/Personas";

const getAll = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const create = async (persona) => {
  const response = await axios.post(API_URL, persona);
  return response.data;
};

const update = async (id, persona) => {
  await axios.put(`${API_URL}/${id}`, persona);
};

const remove = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default { getAll, getById, create, update, remove };
