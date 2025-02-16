import { useWebSocket } from "../hooks/useWebsocket";

export default function SocketManager() {
    useWebSocket(`${import.meta.env.VITE_WEBSOCKET_URL}`);
    return null;
  }