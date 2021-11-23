import axios from "axios";
const baseUrl = "https://00ji4.sse.codesandbox.io/api/login";

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
