#include "esp32_homespan.h"
#include "dht11_sensor.h"
#include "simple_led.h"

void esp32_homespan_setup()
{
    // Default setup code is 466-37-726
    // simple_led_setup();
    dht11_temperature_sensor_setup();
}

void esp32_homespan_loop()
{
    // simple_led_loop();
    dht11_temperature_sensor_loop();
}
