import axios from "axios";
const baseUrl = "/api/blogs";

var token;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
  window.localStorage.setItem("token", token);
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const likeBlog = (blog) => {
  const likedBlog = blog;
  likedBlog.likes = blog.likes + 1;
  return axios.put(`${baseUrl}/${blog.id}`, likedBlog);
};
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const deleteBlog = (blog, token) => {
  const config = { headers: { Authorization: `bearer ${token.token}` } };
  return axios.delete(`${baseUrl}/${blog.id}`, config);
};

export default {
  getAll,
  create,
  likeBlog,
  deleteBlog,
  update
};
