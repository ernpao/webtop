
#ifndef DHT11_TEMPERATURE_SENSOR_H
#define DHT11_TEMPERATURE_SENSOR_H

#include <Arduino.h>
#include <HomeSpan.h>
#include <DHT.h>

struct DHT11TemperatureSensor : Service::TemperatureSensor
{
    SpanCharacteristic *currentTemperature;
    DHT *dht;

    DHT11TemperatureSensor(int pin) : Service::TemperatureSensor()
    {
        pinMode(pin, INPUT);
        dht = new DHT(pin, DHT11);
        dht->begin();
        delay(100);

        currentTemperature = new Characteristic::CurrentTemperature();
    }

    float readTemperature()
    {
        return dht->readTemperature();
    }

    float readTemperatureInFahrenheit()
    {
        return dht->readTemperature(true);
    }

    float readHumidity()
    {
        return dht->readHumidity();
    }

    float computeHeatIndexInFahrenheit()
    {
        float f = dht->readTemperature(true);
        float h = dht->readHumidity();
        return dht->computeHeatIndex(f, h);
    }

    float computeHeatIndex()
    {
        float t = dht->readTemperature();
        float h = dht->readHumidity();
        return dht->computeHeatIndex(t, h, false);
    }

    void loop()
    {
        static unsigned long lastReadTime = 0;
        unsigned long currentTime = millis();

        if (currentTime - lastReadTime > 5000)
        {
            lastReadTime = currentTime;

            // Read temperature as Celsius (the default)
            float t = dht->readTemperature();
            // Read temperature as Fahrenheit (isFahrenheit = true)
            float f = dht->readTemperature(true);

            // Check if any reads failed and exit early (to try again).
            if (isnan(t) || isnan(f))
            {
                Serial.println(F("Temp: Failed to read from DHT sensor!"));
                return;
            }
            
            Serial.print(F("Temperature: "));
            Serial.print(t);
            Serial.print(F("°C "));
            Serial.print(f);
            Serial.println(F("°F"));

            currentTemperature->setVal(int(t));
        }
    }
};

#endif