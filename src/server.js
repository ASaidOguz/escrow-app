import axios from "axios";

const server = axios.create({
  baseURL:"https://express-server-git-master-asaidoguz.vercel.app/",
});

export default server;