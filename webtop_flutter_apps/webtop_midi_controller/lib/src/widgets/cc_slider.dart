import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

class CCSlider extends MidiWidget {
  CCSlider({
    Key? key,
    required MidiWidgetParameters parameters,
    required MidiInterface interface,
    bool showChannelLabel = true,
    bool showControllerLabel = true,
    this.color,
    Function(MidiWidgetParameters parameters)? onChanged,
    this.height = 350,
  }) : super(
          key: key,
          interface: interface,
          parameters: parameters,
          showChannelLabel: showChannelLabel,
          showControllerLabel: showControllerLabel,
          onChanged: onChanged,
        );

  final Color? color;
  final double height;

  @override
  Widget renderControl(BuildContext context, int value, int min, int max) {
    return CustomSlider(
      color: color,
      height: height,
      value: value.toDouble(),
      max: max.toDouble(),
      min: min.toDouble(),
      onChanged: (value) {
        final val = value.toInt();
        onChanged?.call(copyParametersWithNewValue(val));
      },
    );
  }
}
