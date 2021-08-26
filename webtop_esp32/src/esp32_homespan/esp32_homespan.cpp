#include <display.h>

#include "esp32_homespan.h"
#include "dht11_temperature_sensor.h"
#include "virtual_switch_array.h"

DHT11TemperatureSensor *sensor;
void esp32_homespan_setup()
{

    Serial.begin(9600);

    homeSpan.begin(Category::Sensors, "ESP32 Sensor Hub");

    new SpanAccessory(); // Begin by creating a new Accessory using SpanAccessory(), which takes no arguments

    new Service::AccessoryInformation();          // HAP requires every Accessory to implement an AccessoryInformation Service, which has 6 required Characteristics:
    new Characteristic::Name("ESP32 Sensor Hub"); // Name of the Accessory, which shows up on the HomeKit "tiles", and should be unique across Accessories

    // The next 4 Characteristics serve no function except for being displayed in HomeKit's setting panel for each Accessory.  They are nevertheless required by HAP:

    new Characteristic::Manufacturer("Ernest Epistola"); // Manufacturer of the Accessory (arbitrary text string, and can be the same for every Accessory)
    new Characteristic::SerialNumber("00000000");        // Serial Number of the Accessory (arbitrary text string, and can be the same for every Accessory)
    new Characteristic::Model("ESP32 Sensor Hub");       // Model of the Accessory (arbitrary text string, and can be the same for every Accessory)
    new Characteristic::FirmwareRevision("0.0.1");       // Firmware of the Accessory (arbitrary text string, and can be the same for every Accessory)

    // The last required Characteristic for the Accessory Information Service is the special Identify Characteristic.  We'll learn more about this
    // Characteristic in later examples.  For now, you can just instantiate it without any arguments.

    new Characteristic::Identify(); // Create the required Identify

    // *NOTE* HAP requires that the AccessoryInformation Service always be instantiated BEFORE any other Services, which is why we created it first.

    // HAP also requires every Accessory (with the exception of those in Bridges, as we will see later) to implement the HAP Protocol Information Service.
    // This Service supports a single required Characteristic that defines the version number of HAP used by the device.
    // HAP Release R2 requires this version to be set to "1.1.0"

    new Service::HAPProtocolInformation(); // Create the HAP Protcol Information Service
    new Characteristic::Version("1.1.0");  // Set the Version Characteristicto "1.1.0" as required by HAP

    sensor = new DHT11TemperatureSensor(2);
    // // new VirtualSwitchArray();

    temperatureWidgetBegin();
}

void esp32_homespan_loop()
{
    homeSpan.poll();
    float temp = sensor->readTemperature();
    updateTemperatureWidget(temp);
}
