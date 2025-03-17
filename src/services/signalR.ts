import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { API_URL } from '../config/config';

export const connectToSignalR = async () => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/chathub`, {
        withCredentials: false,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.Debug)
      .withAutomaticReconnect([0, 2000, 5000, 10000, null])
      .build();

    connection.onclose((error) => {
      console.log("SignalR Connection closed:", error);
    });

    await connection.start();
    console.log("SignalR Connected successfully");
    return connection;
  } catch (err) {
    console.error("SignalR Connection Error:", err);
    throw err;
  }
};