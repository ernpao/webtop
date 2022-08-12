#include "main.h"

/*
  ESP32 CAM Uploading: 
    - Pin D0 must be connected to GND during upload. Disconnect D0 from GND and press RST after upload.
    - There is no need to hold the RST/FLASH buttons during upload. When upload begins, simply press the RST button to begin flashing.
*/

void setup()
{
  // esp32_cam_demo_setup();
  esp32_camera_webtop_stream_setup();
  // esp32_homespan_setup();
  // esp32_imu_webtop_stream_setup();
}

void loop()
{
  // esp32_cam_demo_loop();
  esp32_camera_webtop_stream_loop();
  // esp32_homespan_loop();
  // esp32_imu_webtop_stream_loop();
}
