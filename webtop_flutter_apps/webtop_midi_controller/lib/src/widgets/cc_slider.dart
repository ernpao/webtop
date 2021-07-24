import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'cc_builder.dart';
import 'custom_slider.dart';

class CCSlider extends StatelessWidget {
  const CCSlider({
    Key? key,
    required this.deviceName,
    required this.channel,
    required this.controller,
    required this.interface,
    required this.value,
    this.min,
    this.max,
    this.color,
    this.showChannelLabel = true,
    this.showControllerLabel = true,
    this.title,
    this.onChanged,
    this.height = 350,
  }) : super(key: key);

  final String deviceName;
  final int channel;
  final int controller;
  final MidiInterface interface;
  final int value;
  final int? max;
  final int? min;
  final Color? color;
  final bool showControllerLabel;
  final bool showChannelLabel;
  final String? title;
  final Function(int value)? onChanged;
  final double height;

  @override
  Widget build(BuildContext context) {
    return CCBuilder(
      deviceName: deviceName,
      channel: channel,
      controller: controller,
      interface: interface,
      value: value,
      min: min,
      max: max,
      showChannelLabel: showChannelLabel,
      showControllerLabel: showControllerLabel,
      title: title,
      builder: (context, value, min, max, valueSetter) {
        return CustomSlider(
          color: color,
          height: height,
          value: value.toDouble(),
          max: max.toDouble(),
          min: min.toDouble(),
          onChanged: (value) {
            final intValue = value.toInt();
            debugPrint("MIDI CC Slider value changed: $value");
            valueSetter(intValue);
            onChanged?.call(intValue);
          },
        );
      },
    );
  }
}
