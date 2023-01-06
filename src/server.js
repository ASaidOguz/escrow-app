import axios from "axios";

const server = axios.create({
  baseURL:"https://express-server-navy.vercel.app/",
});

export default server;