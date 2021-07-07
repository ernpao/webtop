#include "main.h"

WebtopClient webtop;

void setup()
{
  initLogging();
  webtop.begin();
}

void loop()
{
  webtop.test();
  delay(1000);
}