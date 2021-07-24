import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'custom_slider.dart';

class MidiControlChangeSlider extends StatelessWidget {
  const MidiControlChangeSlider({
    Key? key,
    required this.deviceName,
    required this.channel,
    required this.controller,
    required this.interface,
    this.initialValue = 0,
    this.min = 0,
    this.max = 127,
    this.color,
    this.showChannelLabel = true,
    this.showControllerLabel = true,
    this.title,
    this.onChanged,
  })  : assert(max <= 127),
        assert(min >= 0),
        super(key: key);

  final String deviceName;
  final int channel;
  final int controller;
  final MidiInterface interface;
  final int initialValue;
  final int max;
  final int min;
  final Color? color;
  final bool showControllerLabel;
  final bool showChannelLabel;
  final String? title;
  final Function(int value)? onChanged;

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
    _sendValue(initialValue);
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        children: [
          if (title != null) Text(title!),
          if (showControllerLabel)
            _buildLabel(
              context,
              "CTRL: ${controller.toString().padLeft(2, '0')}",
            ),
          CustomSlider(
            color: color,
            initialValue: initialValue.toDouble(),
            max: max.toDouble(),
            min: min.toDouble(),
            onChanged: (value) {
              final intValue = value.toInt();
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
