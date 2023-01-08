import axios from "axios";

const server = axios.create({
  baseURL:"http://localhost:3042",
});
server.defaults.headers.common['Authorization'] =`Bearer ${window.localStorage.getItem('jwt')}`;
server.defaults.headers.post['Authorization'] = `Bearer ${localStorage.getItem('jwt')}`;
export default server;