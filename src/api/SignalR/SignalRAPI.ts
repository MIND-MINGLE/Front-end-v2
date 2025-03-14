// import React from 'react'
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
// Local Server, change to REAL server later
//const hub_local_URL = 'http://localhost:5000/chathub'
const hub_URL = "https://mindmingle202.azurewebsites.net/chathub"


let connection: HubConnection | null = null;

export interface ChatMessageRequest {
    accountId: string;
    usersInGroupId: string;
    content: string;
    messageStatus?: string; // Optional
}

export const connectToChatHub = async (
    onMessageReceived?: (message: ChatMessageRequestProps) => void,
    onError?: (error: any) => void
): Promise<HubConnection | null> => {
    connection = new HubConnectionBuilder()
        .withUrl(hub_URL)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
    connection.on("ReceiveTextMessage", (message) => {
        console.log("YES! Message received from server");
        onMessageReceived?.(message);
    });

    connection.on("ErrorMessage", (error) => {
        console.error(" Error received:", error);
        onError?.(error);
    });

    try {
        await connection.start();
        console.log("Connected to SignalR chat hub");
        return connection;
    } catch (err) {
        console.error(" Error connecting to SignalR hub:", err);
        return null;
    }
};


export const sendMessage = async (chatMessageRequest: ChatMessageRequest): Promise<void> => {
    if (!connection || connection.state !== HubConnectionState.Connected) {
        console.error(" SignalR connection is not established.");
        return;
    }
    try {
        await connection.invoke("ReceiveTextMessage", chatMessageRequest);
        console.log("Message sent to server");
    } catch (err) {
        console.error(" Error sending message:", err);
    }
};

// dont know if I gonna need to disconnect from Server
export const disconnectFromChatHub = async (): Promise<void> => {
    if (connection) {
        await connection.stop();
        console.log("Disconnected from SignalR chat hub");
    }
};

export interface ChatMessageRequestProps {
    accountId: string;
    usersInGroupId: string;
    content: string;
    messageStatus?: string | "sent"; // Optional field
}
