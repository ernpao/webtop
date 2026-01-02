
#ifndef DHT11_HUMIDITY_SENSOR_H
#define DHT11_HUMIDITY_SENSOR_H

#include <Arduino.h>
#include <HomeSpan.h>
#include <DHT.h>

struct DHT11HumiditySensor : Service::HumiditySensor
{
    SpanCharacteristic *currentRelativeHumidity;
    DHT *dht;

    DHT11HumiditySensor(int pin) : Service::HumiditySensor()
    {
        pinMode(pin, INPUT);
        dht = new DHT(pin, DHT11);
        dht->begin();
        delay(100);

        currentRelativeHumidity = new Characteristic::CurrentRelativeHumidity();
    }

    float readHumidity()
    {
        return dht->readHumidity();
    }

    void loop()
    {
        static unsigned long lastReadTime = 0;
        unsigned long currentTime = millis();

        if (currentTime - lastReadTime > 7000)
        {
            lastReadTime = currentTime;

            // Reading temperature or humidity takes about 250 milliseconds!
            // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
            float h = dht->readHumidity();
            // Check if any reads failed and exit early (to try again).
            if (isnan(h))
            {
                Serial.println(F("Humidity: Failed to read from DHT sensor!"));
                return;
            }

            Serial.print(F("Humidity: "));
            Serial.println(h);

            currentRelativeHumidity->setVal(int(h));
        }
    }
};

#endif