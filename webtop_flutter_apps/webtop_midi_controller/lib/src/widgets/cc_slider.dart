import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'cc_widget.dart';
import 'cc_widget_parameters.dart';
import 'custom_slider.dart';

class CCSlider extends CCWidget {
  CCSlider({
    Key? key,
    required CCWidgetParametersModel parameters,
    required MidiInterface interface,
    bool showChannelLabel = true,
    bool showControllerLabel = true,
    this.color,
    Function(CCWidgetParametersModel parameters)? onChanged,
    this.height = 350,
  }) : super(
          key: key,
          interface: interface,
          parameters: parameters,
          showChannelLabel: showChannelLabel,
          showControllerLabel: showControllerLabel,
          onChanged: onChanged,
          sendOnCreate: true,
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
