#include "main.h"

void setup()
{
  // esp32_cam_demo_setup();
  esp32_camera_webtop_stream_setup();
}

void loop()
{
  // esp32_cam_demo_loop();
  esp32_camera_webtop_stream_loop();
}
