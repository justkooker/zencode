import { useEffect, useState, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addConnection,
  removeConnection,
  setWSStatus,
  clearConnections,
  setActiveConnections,
} from "../store/slices/connectionsSlice";
import {
  wsService,
  type ConnectionStatus,
  type ActiveConnection,
} from "../services/websocket";

const ActiveConnections = () => {
  const dispatch = useAppDispatch();
  const [connectionId] = useState(
    `browser-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );
  const connections = useAppSelector(
    (state) => state.connections.activeConnections
  );
  const wsStatus = useAppSelector((state) => state.connections.wsStatus);
  const connectionSentRef = useRef(false);

  const handleConnectionsSynced = useCallback(
    (list: ActiveConnection[]) => {
      dispatch(setActiveConnections(list));
    },
    [dispatch]
  );

  useEffect(() => {
    wsService.connect().catch((error) => {
      console.error("Ошибка подключения WebSocket:", error);
    });

    wsService.on("connectionAdded", (connection: any) => {
      if (connection.id !== connectionId) {
        dispatch(addConnection(connection));
      }
    });

    wsService.on("connectionRemoved", (cid: string) => {
      dispatch(removeConnection(cid));
    });

    wsService.on("connectionsSynced", handleConnectionsSynced);

    wsService.on("statusChange", (status: ConnectionStatus) => {
      dispatch(setWSStatus(status));

      if (status === "connected" && !connectionSentRef.current) {
        connectionSentRef.current = true;
        const payload = {
          id: connectionId,
          connectionId,
          userId: Math.floor(Math.random() * 1000),
          userName: `Пользователь-${Math.floor(Math.random() * 999)}`,
          timestamp: Date.now(),
          action: "view" as const,
        };
        wsService.sendConnection(payload);
      }
    });

    return () => {
      wsService.off("connectionsSynced", handleConnectionsSynced);
      if (connectionSentRef.current && wsService.isConnected()) {
        wsService.sendDisconnection(connectionId);
      }
      wsService.disconnect();
      dispatch(clearConnections());
    };
  }, [dispatch, connectionId, handleConnectionsSynced]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "#4caf50";
      case "connecting":
        return "#ff9800";
      case "disconnected":
        return "#f44336";
      default:
        return "#999";
    }
  };

  return (
    <div className="active-connections-widget">
      <div
        className="widget-status"
        style={{ backgroundColor: getStatusColor(wsStatus) }}
      >
        <span className={`status-dot ${wsStatus}`}></span>
      </div>
      <div className="widget-content">
        <div className="user-count">{connections.length}</div>
        <div className="user-label">онлайн</div>
      </div>
    </div>
  );
};

export default ActiveConnections;
