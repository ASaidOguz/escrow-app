import axios from "axios";

const server = axios.create({
  baseURL:"https://express-server-nc6y.vercel.app/",
});

export default server;