
#ifndef SWITCH_ARRAY_H
#define SWITCH_ARRAY_H

#include <Arduino.h>
#include <HomeSpan.h>

struct VirtualSwitch : Service ::Switch
{
    SpanCharacteristic *onState;
    VirtualSwitch(const char *name) : Service ::Switch()
    {
        onState = new Characteristic::On();
        new Characteristic::Name(name);
    }
};

struct VirtualSwitchArray
{
    VirtualSwitchArray()
    {
        new VirtualSwitch("Switch A");
        new VirtualSwitch("Switch B");
        new VirtualSwitch("Switch C");
    }
};

#endif