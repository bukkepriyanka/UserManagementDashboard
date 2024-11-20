import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com/users";

export const getUsers = () => axios.get(BASE_URL);

export const addUser = (user) => axios.post(BASE_URL, user);

export const updateUser = (id, user) => axios.put(`${BASE_URL}/${id}`, user);

export const deleteUser = (id) => axios.delete(`${BASE_URL}/${id}`);
