import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'custom_slider.dart';

class CCSlider extends StatelessWidget {
  const CCSlider({
    Key? key,
    required this.deviceName,
    required this.channel,
    required this.controller,
    required this.interface,
    required this.value,
    this.min = 0,
    this.max = 127,
    this.color,
    this.showChannelLabel = true,
    this.showControllerLabel = true,
    this.title,
    this.onChanged,
    this.height = 350,
  })  : assert(max <= 127),
        assert(min >= 0),
        super(key: key);

  final String deviceName;
  final int channel;
  final int controller;
  final MidiInterface interface;
  final int value;
  final int max;
  final int min;
  final Color? color;
  final bool showControllerLabel;
  final bool showChannelLabel;
  final String? title;
  final Function(int value)? onChanged;
  final double height;

  void _sendValue(int value) {
    interface.sendMidiCC(
      deviceName,
      ControlChange(
        channel: channel,
        value: value,
        controller: controller,
      ),
    );
  }

  Widget _buildLabel(BuildContext context, String text) {
    return Opacity(
      opacity: 0.5,
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Text(
          text,
          style: Theme.of(context).textTheme.caption,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    _sendValue(value);
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (title != null) Text(title!),
          if (showControllerLabel)
            _buildLabel(
              context,
              "CTRL: ${controller.toString().padLeft(2, '0')}",
            ),
          CustomSlider(
            color: color,
            height: height,
            value: value.toDouble(),
            max: max.toDouble(),
            min: min.toDouble(),
            onChanged: (value) {
              final intValue = value.toInt();
              debugPrint("MIDI CC Slider value changed: $value");
              _sendValue(intValue);
              onChanged?.call(intValue);
            },
          ),
          if (showChannelLabel)
            _buildLabel(
              context,
              "CHAN: ${channel.toString().padLeft(2, '0')}",
            ),
        ],
      ),
    );
  }
}
