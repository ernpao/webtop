#include "esp32_cam_webtop_stream.h"

WebtopClient webtop("192.168.100.191", 6767, 6868, "wNetworkSaBahay2.4GHz", "alotsipe");

static auto loRes = esp32cam::Resolution::find(320, 240);
static auto hiRes = esp32cam::Resolution::find(800, 600);

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    default:
        break;
    }
}

void setupCamera()
{
    {
        using namespace esp32cam;
        Config cfg;
        cfg.setPins(pins::AiThinker);
        cfg.setResolution(hiRes);
        cfg.setBufferCount(2);
        cfg.setJpeg(80);

        bool ok = Camera.begin(cfg);
        Serial.println(ok ? "CAMERA OK" : "CAMERA FAIL");
    }
    esp32cam::Camera.changeResolution(loRes);
}

uint8_t *imageData;
size_t imageSize;

void captureImage()
{
    auto frame = esp32cam::capture();
    imageData = frame->data();
    imageSize = frame->size();
}

void esp32_camera_webtop_stream_setup()
{
    initLogging();
    webtop.printInfo();
    webtop.connectToWiFi();
    delay(300);
    webtop.connectToWebSocket(webSocketEvent);
    setupCamera();
}

void esp32_camera_webtop_stream_loop()
{
    static unsigned long lastCaptureTime = 0;
    unsigned long currentTime = millis();
    unsigned long sendInterval = 200;
    if (currentTime - lastCaptureTime > sendInterval)
    {
        captureImage();
        webtop.sendBinToSocket(imageData, imageSize);
        lastCaptureTime = currentTime;
    }
    webtop.socketLoop();
}