class CCWidgetParameters {
  CCWidgetParameters({
    required this.targetDevice,
    required this.channel,
    required this.controller,
    required this.value,
    this.min,
    this.max,
    this.title,
  });

  /// The name of the target MIDI device that
  /// the widget will be sending CC commands to.
  final String targetDevice;

  /// The sets the target MIDI channel number of the widget.
  final int channel;

  /// The sets the target MIDI controller number of the widget.
  final int controller;

  /// Sets the CC value of the widget.
  final int value;

  /// Minimum CC value of the widget. Defaults to 0.
  final int? min;

  /// Maximum CC value of the widget. Defaults to 127.
  final int? max;

  /// An optional title for the widget to display
  /// when it is rendered.
  final String? title;

  @override
  String toString() {
    return "Slider State Channel: $channel Controller: $controller Value: $value";
  }
}
