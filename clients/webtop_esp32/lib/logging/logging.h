#ifndef LOGGING_H
#define LOGGING_H

#define LOGGER Serial
#define LOGGER_SEPARATOR_LENGTH 56

#include <Arduino.h>

void initLogging();
void println(const char *message);
void println(String message);
void print(const char *message);
void print(String message);
void printChar2Hex(unsigned char number);
void printChar2Bin(unsigned char number);
void printSeparator(int length = LOGGER_SEPARATOR_LENGTH, bool newline = true);
void printDoubleSpace();
void printTitle(String title);

#endif