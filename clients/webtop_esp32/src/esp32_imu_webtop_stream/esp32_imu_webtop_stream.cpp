#include "esp32_imu_webtop_stream.h"

#include <imu.h>

IMU *imu = new IMU();

void esp32_imu_webtop_stream_setup()
{
    imu->begin();
}

void esp32_imu_webtop_stream_loop()
{
    imu->loop();
}