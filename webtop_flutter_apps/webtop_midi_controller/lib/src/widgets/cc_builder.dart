import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

class CCBuilder extends StatelessWidget {
  CCBuilder({
    Key? key,
    required this.deviceName,
    required this.channel,
    required this.controller,
    required this.interface,
    required this.value,
    required this.builder,
    this.min,
    this.max,
    this.showChannelLabel = true,
    this.showControllerLabel = true,
    this.title,
  }) : super(key: key) {
    _sendValue(value);
  }

  final String deviceName;
  final int channel;
  final int controller;
  final MidiInterface interface;
  final int value;
  final int? max;
  final int? min;
  final bool showControllerLabel;
  final bool showChannelLabel;
  final String? title;
  final Widget Function(
    BuildContext context,
    int value,
    int min,
    int max,
    Function(int value) valueSetter,
  ) builder;

  late final int _min = min ?? 0;
  late final int _max = max ?? 127;

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
          builder(context, value.clamp(_min, _max), _min, _max, _sendValue),
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
