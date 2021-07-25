import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'cc_widget_parameters.dart';

/// Base class for a widget that sends MIDI Continous Control
/// messages to the remote Webtop server.
abstract class CCWidget extends StatelessWidget {
  CCWidget({
    Key? key,
    required this.interface,
    required this.parameters,
    this.showChannelLabel = true,
    this.showControllerLabel = true,
  }) : super(key: key) {
    _sendMessage(parameters.value);
  }
  final CCWidgetParameters parameters;

  /// The interface that will be used to send CC messages.
  final MidiInterface interface;

  /// Indicates if the CC controller number should be displayed.
  final bool showControllerLabel;

  /// Indicates if the CC channel number should be displayed.
  final bool showChannelLabel;

  Widget renderControl(
    BuildContext context,
    int value,
    int min,
    int max,
    Function(int value) valueSetter,
  );

  late final int _min = parameters.min ?? 0;
  late final int _max = parameters.max ?? 127;

  void _sendMessage(int value) {
    interface.sendMidiCC(
      parameters.targetDevice,
      ControlChange(
        channel: parameters.channel,
        value: parameters.value,
        controller: parameters.controller,
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
    /// Clamp the value to ensure it does not go
    /// over the min and max values.
    final value = parameters.value.clamp(_min, _max);

    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (parameters.title != null) Text(parameters.title!),
          if (showControllerLabel)
            _buildLabel(
              context,
              "CTRL: ${parameters.controller.toString().padLeft(2, '0')}",
            ),
          renderControl(context, value, _min, _max, _sendMessage),
          if (showChannelLabel)
            _buildLabel(
              context,
              "CHAN: ${parameters.channel.toString().padLeft(2, '0')}",
            ),
        ],
      ),
    );
  }
}
