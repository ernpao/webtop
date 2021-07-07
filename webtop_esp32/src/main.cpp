#include "main.h"

WebtopClient webtop("192.168.100.191", 6767, 6868, "wNetworkSaBahay2.4GHz", "alotsipe");

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
  switch (type)
  {
  default:
    break;
  }
}

void setup()
{
  initLogging();
  webtop.printInfo();
  webtop.connectToWiFi();
  delay(300);
  webtop.connectToWebSocket(webSocketEvent);
}

void loop()
{

  webtop.socketLoop();

  static unsigned long lastSendTime = 0;
  unsigned long currentTime = millis();
  unsigned long sendInterval = 2000;
  if (currentTime - lastSendTime > sendInterval)
  {
    String data = String(currentTime);
    webtop.sendToSocket(data);
    lastSendTime = currentTime;
  }
}