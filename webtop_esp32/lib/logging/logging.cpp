#include "logging.h"

void initLogging()
{
  LOGGER.begin(9600);
  delay(1000);
  printTitle("Logger initialized.");
}

void println(const char *message)
{
  LOGGER.println(message);
}

void println(String message)
{
  LOGGER.println(message);
}

void print(const char *message)
{
  LOGGER.print(message);
}

void print(String message)
{
  LOGGER.print(message);
}

void printChar2Hex(unsigned char number)
{
  LOGGER.print(number, HEX);
}

void printChar2Bin(unsigned char number)
{
  LOGGER.print(number, BIN);
}

void printSeparator(int length, bool newline)
{
  for (int i = 0; i < length; i++)
  {
    LOGGER.print("-");
  }
  if (newline)
  {
    LOGGER.println();
  }
}

void printDoubleSpace()
{
  println("\n");
}

void printTitle(String title)
{
  String _title = " " + title + " ";
  int separatorLength = (LOGGER_SEPARATOR_LENGTH - _title.length()) / 2;
  printDoubleSpace();
  printSeparator(separatorLength, false);
  print(_title);
  printSeparator(separatorLength, true);
  printDoubleSpace();
}