import { io } from "socket.io-client";
import { BACKEND_URL } from "@/config/config";

export const statsSocket = io(`${BACKEND_URL}/stats`, {
  autoConnect: false,
  auth: (done) => done({ token: sessionStorage.getItem("token") ?? "" })
});
