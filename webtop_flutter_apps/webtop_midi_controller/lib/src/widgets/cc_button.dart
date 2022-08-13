import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

class CCButton extends WebtopMidiWidget {
  CCButton({
    Key? key,
    required MidiWidgetParameters parameters,
    required MidiInterface interface,
    bool showChannelLabel = true,
    bool showControllerLabel = true,
    this.color,
  }) : super(
          key: key,
          interface: interface,
          parameters: parameters,
          showChannelLabel: showChannelLabel,
          showControllerLabel: showControllerLabel,
          sendValueOnCreate: false,
        );

  final Color? color;

  @override
  Widget renderControl(BuildContext context, int value, int min, int max) {
    const double _size = 80;

    return MaterialButton(
      color: color,
      shape: const CircleBorder(),
      onPressed: sendValue,
      child: const SizedBox(width: _size, height: _size),
    );
  }
}
