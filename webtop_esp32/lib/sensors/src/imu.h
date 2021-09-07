#ifndef IMU_H
#define IMU_H

#include <Arduino.h>
#include <Wire.h>
#include <MPU6050_light.h>

struct IMU
{
    MPU6050 *mpu = new MPU6050(Wire);

    unsigned long lastSampleTime = 0;
    unsigned long sampleInterval = 1000;

    void begin()
    {
        Serial.begin(9600);
        Wire.begin();

        byte status = mpu->begin();
        Serial.print(F("MPU6050 status: "));
        Serial.println(status);
        while (status != 0)
        {
        } // stop everything if could not connect to MPU6050

        Serial.println(F("Calculating offsets, do not move MPU6050"));
        delay(1000);
        mpu->calcOffsets(); // gyro and accelero
        delay(1000);
        Serial.println("Done!\n");
    }

    void loop()
    {
        mpu->update();

        long currentTime = millis();
        if (currentTime - lastSampleTime > sampleInterval)
        {
            log();
            lastSampleTime = currentTime;
        }
    }

    void log()
    {
        Serial.print("Accel X : ");
        Serial.print(mpu->getAccX());
        Serial.print("\tAccel Y : ");
        Serial.print(mpu->getAccY());
        Serial.print("\tAccel Z : ");
        Serial.println(mpu->getAccZ());

        Serial.print("X : ");
        Serial.print(mpu->getAngleX());
        Serial.print("\tY : ");
        Serial.print(mpu->getAngleY());
        Serial.print("\tZ : ");
        Serial.println(mpu->getAngleZ());
    }
};

#endif