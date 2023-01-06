import axios from "axios";

const server = axios.create({
  baseURL:"https://express-server-asaidoguz.vercel.app",
});

export default server;