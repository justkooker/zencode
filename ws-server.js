import { WebSocketServer } from "ws";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`✅ WebSocket сервер запущен: ws://localhost:${PORT}`);

/**
 * connections — ЕДИНСТВЕННЫЙ источник правды
 * key   -> connectionId
 * value -> данные пользователя
 */
const connections = new Map();

/**
 * Рассылка всем клиентам
 */
function broadcast(message) {
  const data = JSON.stringify(message);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}

wss.on("connection", (ws) => {
  const clientId = `client-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

  let connectionId = null;

  console.log(`🔌 WebSocket подключён: ${clientId}`);

  /**
   * Сообщения от клиента
   */
  ws.on("message", (raw) => {
    try {
      const message = JSON.parse(raw.toString());

      switch (message.type) {
        case "connect": {
          const payload = message.payload;

          connectionId = payload.connectionId;

          connections.set(connectionId, {
            id: connectionId,
            userId: payload.userId,
            userName: payload.userName,
            timestamp: payload.timestamp,
            action: payload.action,
          });

          console.log(
            `➕ connect: ${connectionId}, всего: ${connections.size}`,
          );

          // 🔁 синхронизация новому клиенту
          ws.send(
            JSON.stringify({
              type: "sync",
              payload: Array.from(connections.values()),
            }),
          );

          // 🔔 уведомление остальных
          broadcast({
            type: "connect",
            payload: connections.get(connectionId),
          });

          break;
        }

        case "disconnect": {
          const id = message.payload;

          if (connections.has(id)) {
            connections.delete(id);

            console.log(
              `➖ disconnect: ${id}, всего: ${connections.size}`,
            );

            broadcast({
              type: "disconnect",
              payload: id,
            });
          }
          break;
        }

        default:
          console.warn("⚠️ Неизвестный тип сообщения:", message.type);
      }
    } catch (err) {
      console.error("❌ Ошибка обработки сообщения:", err);
    }
  });

  /**
   * Закрытие вкладки / обрыв соединения
   */
  ws.on("close", () => {
    if (connectionId && connections.has(connectionId)) {
      connections.delete(connectionId);

      console.log(
        `❎ закрытие: ${connectionId}, всего: ${connections.size}`,
      );

      broadcast({
        type: "disconnect",
        payload: connectionId,
      });
    }
  });

  ws.on("error", (err) => {
    console.error(`🔥 WS error (${clientId}):`, err);
  });
});

/**
 * ❤️ Heartbeat
 */
setInterval(() => {
  broadcast({
    type: "heartbeat",
    payload: {
      timestamp: Date.now(),
      activeConnections: connections.size,
    },
  });
}, 5000);

/**
 * 📊 Лог сервера
 */
setInterval(() => {
  console.log(`📡 Онлайн: ${connections.size}`);
}, 10000);
