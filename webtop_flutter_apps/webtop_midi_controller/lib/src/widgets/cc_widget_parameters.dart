import 'package:glider_webtop/glider_webtop.dart';

abstract class CCWidgetParametersModel {
  /// The name of the target MIDI device that
  /// the widget will be sending CC commands to.
  String get targetDevice;

  /// The sets the target MIDI channel number of the widget.
  int get channel;

  /// The sets the target MIDI controller number of the widget.
  int get controller;

  /// Sets the CC value of the widget.
  int get value;

  /// Minimum CC value of the widget. Defaults to 0.
  int get min;

  /// Maximum CC value of the widget. Defaults to 127.
  int get max;

  /// An optional title for the widget to display
  /// when it is rendered.
  String? get title;

  ControlChange toCC();

  void sendWithInterface(MidiInterface interface);
}

class CCWidgetParameters extends Parseable implements CCWidgetParametersModel {
  @override
  String toString() {
    return "Slider State Channel: $channel Controller: $controller Value: $value";
  }

  @override
  int get channel => this.get("channel");

  @override
  int get controller => this.get("controller");

  @override
  int get max => this.get("max");

  @override
  int get min => this.get("min");

  @override
  String get targetDevice => this.get("targetDevice");

  @override
  String? get title => this.get("title");

  @override
  int get value => this.get("value");

  static CCWidgetParameters create({
    required String targetDevice,
    required int channel,
    required int controller,
    required int value,
    int? min,
    int? max,
    String? title,
  }) {
    final params = CCWidgetParameters();
    params.set("targetDevice", targetDevice);
    params.set("channel", channel);
    params.set("controller", controller);
    params.set("value", value);
    params.set("min", min ?? 0);
    params.set("max", max ?? 127);
    params.set("title", title);
    return params;
  }

  @override
  ControlChange toCC() => ControlChange(
        channel: channel,
        value: value,
        controller: controller,
      );

  @override
  void sendWithInterface(MidiInterface interface) {
    interface.sendMidiCC(targetDevice, toCC());
  }
}

class CCWidgetParametersParser extends Parser<CCWidgetParameters> {
  @override
  CCWidgetParameters createModel() => CCWidgetParameters();

  @override
  Map<String, Type>? get typeMap {
    return {
      "targetDevice": String,
      "channel": int,
      "value": int,
      "min": int,
      "max": int,
      "title": String,
    };
  }
}
