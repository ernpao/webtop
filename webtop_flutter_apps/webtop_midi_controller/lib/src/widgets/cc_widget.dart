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
    this.onChanged,
    this.showChannelLabel = true,
    this.showControllerLabel = true,
    bool sendOnCreate = false,
  }) : super(key: key) {
    if (sendOnCreate) sendValue();
  }
  final CCWidgetParametersModel parameters;

  /// The interface that will be used to send MIDI CC messages.
  final MidiInterface interface;

  /// Indicates if the controller number assignment should be displayed.
  final bool showControllerLabel;

  /// Indicates if the channel number assignment should be displayed.
  final bool showChannelLabel;

  final Function(CCWidgetParametersModel parameters)? onChanged;

  Widget renderControl(BuildContext context, int value, int min, int max);

  /// Copies the parameters of this widget with the exception
  /// of the [value] field set to [newValue].
  CCWidgetParameters copyParametersWithNewValue(int newValue) {
    return CCWidgetParameters.create(
      channel: parameters.channel,
      controller: parameters.controller,
      targetDevice: parameters.targetDevice,
      value: newValue,
      max: parameters.max,
      min: parameters.min,
      title: parameters.title,
    );
  }

  late final int _min = parameters.min;
  late final int _max = parameters.max;

  /// Send a MIDI CC message to the remote host
  /// with the [parameters] provided.
  void sendValue() => parameters.sendWithInterface(interface);

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
          renderControl(context, value, _min, _max),
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
