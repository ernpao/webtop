#ifndef WEBTOP_H
#define WEBTOP_H

#include <Arduino.h>
#include <logging.h>

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>

#include <WebSocketsClient.h>

class WebtopClient
{
private:
    WiFiMulti wiFiMulti;
    WebSocketsClient webSocket;

public:
    const char *host;
    const char *ssid;
    const char *passphrase;
    int port;
    int socketPort;
    bool connectedToWifi = false;

    WebtopClient(const char *host, int port, int socketPort, const char *ssid, const char *passphrase)
    {
        this->host = host;
        this->port = port;
        this->socketPort = socketPort;
        this->ssid = ssid;
        this->passphrase = passphrase;
    }

    void printInfo()
    {
        println("Webtop Client Details: ");
        println("Host: " + String(host));
        println("Port: " + String(port));
        println("WebSocket Port: " + String(socketPort));
    }

    bool connectToWiFi()
    {
        println("Connecting to " + String(ssid) + "...");
        int attempts = 0;
        int maxAttempts = 20;
        wiFiMulti.addAP(ssid, passphrase);
        while (wiFiMulti.run() != WL_CONNECTED && attempts < maxAttempts)
        {
            attempts++;
            println("Attempt " + String(attempts) + " of " + String(maxAttempts));
            delay(3000);
        }
        if (attempts >= maxAttempts)
        {
            println("Failed to connected to " + String(ssid));
            connectedToWifi = false;
        }
        else
        {
            println("Successfully connected to " + String(ssid));
            connectedToWifi = true;
        }
        return connectedToWifi;
    }

    void connectToWebSocket(void (*eventHandler)(WStype_t type, uint8_t *payload, size_t length))
    {
        webSocket.begin(host, socketPort, "/");
        webSocket.onEvent(eventHandler);
        webSocket.setReconnectInterval(5000);
    }

    void sendToSocket(String body, String topic = "none")
    {
        webSocket.sendTXT("{\"_ws_type\":\"esp32\", \"_ws_data\": \"" + body + "\", \"_ws_topic\": \"" + topic + "\"}");
    }

    void sendBinToSocket(uint8_t *payload, size_t length)
    {
        bool headerToPayload = false;
        webSocket.sendBIN(payload, length, headerToPayload);
    }

    void socketLoop()
    {
        webSocket.loop();
    }
};

#endif