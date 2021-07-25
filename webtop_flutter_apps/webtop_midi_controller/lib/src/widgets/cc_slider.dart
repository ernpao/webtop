import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'cc_widget.dart';
import 'cc_widget_parameters.dart';
import 'custom_slider.dart';

class CCSlider extends CCWidget {
  CCSlider({
    Key? key,
    required CCWidgetParameters parameters,
    required MidiInterface interface,
    bool showChannelLabel = true,
    bool showControllerLabel = true,
    this.color,
    this.onChanged,
    this.height = 350,
  }) : super(
          key: key,
          interface: interface,
          parameters: parameters,
          showChannelLabel: showChannelLabel,
          showControllerLabel: showControllerLabel,
        );

  final Color? color;
  final Function(int value)? onChanged;
  final double height;

  @override
  Widget renderControl(
    BuildContext context,
    int value,
    int min,
    int max,
    Function(int value) valueSetter,
  ) {
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
  }
}
