
#include "esp32_cam_demo.h"
const char *WIFI_SSID = "wNetworkSaBahay2.4GHz";
const char *WIFI_PASS = "alotsipe";
const char *CAM_SERVER = "http://192.168.100.254";

void esp32_cam_demo_setup()
{
    Serial.begin(9600);
    Serial.println("Connecting to WiFI...");
    Serial.println("Connected to WiFI!");
}

void esp32_cam_demo_loop()
{
}