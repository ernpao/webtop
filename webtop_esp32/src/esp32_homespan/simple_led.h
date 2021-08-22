
#ifndef SIMPLE_LED_H
#define SIMPLE_LED_H

#include <Arduino.h>
#include <HomeSpan.h>

void simple_led_setup()
{
    Serial.begin(9600); // Start a serial connection so you can receive HomeSpan diagnostics and control the device using HomeSpan's Command-Line Interface (CLI)

    // The HomeSpan library creates a global object named "homeSpan" that encapsulates all HomeSpan functionality.
    // The begin() method is used to initialize HomeSpan and start all HomeSpan processes.

    // The first two parameters are Category and Name, which are used by HomeKit to configure the icon and name of the device shown in your Home App
    // when initially pairing your device.

    homeSpan.begin(Category::Lighting, "HomeSpan LightBulb"); // initializes a HomeSpan device named "HomeSpan Lightbulb" with Category set to Lighting

    // Next, we construct a simple HAP Accessory Database with a single Accessory containing 3 Services,
    // each with their own required Characteristics.

    new SpanAccessory(); // Begin by creating a new Accessory using SpanAccessory(), which takes no arguments

    new Service::AccessoryInformation();       // HAP requires every Accessory to implement an AccessoryInformation Service, which has 6 required Characteristics:
    new Characteristic::Name("My Table Lamp"); // Name of the Accessory, which shows up on the HomeKit "tiles", and should be unique across Accessories

    // The next 4 Characteristics serve no function except for being displayed in HomeKit's setting panel for each Accessory.  They are nevertheless required by HAP:

    new Characteristic::Manufacturer("HomeSpan"); // Manufacturer of the Accessory (arbitrary text string, and can be the same for every Accessory)
    new Characteristic::SerialNumber("123-ABC");  // Serial Number of the Accessory (arbitrary text string, and can be the same for every Accessory)
    new Characteristic::Model("120-Volt Lamp");   // Model of the Accessory (arbitrary text string, and can be the same for every Accessory)
    new Characteristic::FirmwareRevision("0.9");  // Firmware of the Accessory (arbitrary text string, and can be the same for every Accessory)

    // The last required Characteristic for the Accessory Information Service is the special Identify Characteristic.  We'll learn more about this
    // Characteristic in later examples.  For now, you can just instantiate it without any arguments.

    new Characteristic::Identify(); // Create the required Identify

    // *NOTE* HAP requires that the AccessoryInformation Service always be instantiated BEFORE any other Services, which is why we created it first.

    // HAP also requires every Accessory (with the exception of those in Bridges, as we will see later) to implement the HAP Protocol Information Service.
    // This Service supports a single required Characteristic that defines the version number of HAP used by the device.
    // HAP Release R2 requires this version to be set to "1.1.0"

    new Service::HAPProtocolInformation(); // Create the HAP Protcol Information Service
    new Characteristic::Version("1.1.0");  // Set the Version Characteristicto "1.1.0" as required by HAP

    // Now that the required "informational" Services have been defined, we can finally create our Light Bulb Service

    new Service::LightBulb(); // Create the Light Bulb Service
    new Characteristic::On(); // This Service requires the "On" Characterstic to turn the light on and off

    // That's all that's needed to define a database from scratch, including all required HAP elements, to control a single lightbulb.
    // Of course this sketch does not yet contain any code to implement the actual operation of the light - there is nothing to
    // turn on and off.  But you'll still see a Light Bulb tile show up in your Home App with an ability to toggle it on and off.
}

void simple_led_loop()
{
    // The code in setup above implements the Accessory Attribute Database, but performs no operations.  HomeSpan itself must be
    // continuously polled to look for requests from Controllers, such as the Home App on your iPhone.  The poll() method below is all that
    // is needed to perform this continuously in each iteration of loop()

    homeSpan.poll(); // run HomeSpan!
}

#endif