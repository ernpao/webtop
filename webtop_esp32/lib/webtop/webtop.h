#ifndef WEBTOP_H
#define WEBTOP_H

#include <Arduino.h>
#include <logging.h>

class WebtopClient
{
public:
    void begin()
    {
        printTitle("ESP32 Webtop client initialized!");
        println("This is a test");
    }

    void test()
    {
        println("asd");
    }
};

#endif