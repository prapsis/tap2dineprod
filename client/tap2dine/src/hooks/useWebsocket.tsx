import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toastTrigger } from "../lib/utils";

export function useWebSocket(url:string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const description =
        typeof data === "object" && data.message
            ? data.message
            : JSON.stringify(data);
      toastTrigger("New order received", description, "success");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed.");
    };

    return () => {
      ws.close();
    };
  }, [url, queryClient]);
}
