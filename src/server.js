import axios from "axios";

const server = axios.create({
  baseURL:"https://express-server-virid.vercel.app",
});

export default server;