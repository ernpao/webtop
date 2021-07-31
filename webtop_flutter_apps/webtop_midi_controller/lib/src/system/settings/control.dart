import 'package:flutter/foundation.dart';
import 'package:glider_webtop/glider_webtop.dart';

abstract class Control extends AbstractNode {
  String get type;

  String get title;
  void rename(String title);

  static const List<String> types = [
    slider,
    button,
  ];
  static const String slider = "slider";
  static const String button = "button";

  static bool isValidType(String type, {bool? throwException}) {
    final isValid = types.contains(type);

    if (!isValid && (throwException ?? false)) {
      throw Exception("'$type' is not a valid control type.");
    }

    return isValid;
  }

  static const String gain = "Gain";
  static const String level = "Level";
  static const String tone = "Tone";
  static const String blend = "Blend";
  static const String attack = "Attack";
  static const String bypass = "Bypass";
}

abstract class ControlNode extends ParseableNode
    with ChangeNotifier
    implements Control {
  ControlNode() : super(childParser: null);

  @override
  String get type => super.get<String>("type") ?? "";

  void _setType(String type) {
    Control.isValidType(type, throwException: true);
    set("type", type);
  }

  @override
  String get title => identifier;

  void _setTitle(String title) => identifier = title;
}

class ControlChangeNode extends ControlNode implements ControlChange {
  ControlChangeNode._();

  factory ControlChangeNode._create(
    String type,
    String title,
    int channel,
    int controller,
    int value,
  ) {
    final node = ControlChangeNode._();
    node._setType(type);
    node._setTitle(title);
    node._setChannel(channel);
    node._setController(controller);
    node._setValue(value);
    return node;
  }

  factory ControlChangeNode.createSlider(
    String title,
    int channel,
    int controller,
    int value,
  ) =>
      ControlChangeNode._create(
        Control.slider,
        title,
        channel,
        controller,
        value,
      );

  factory ControlChangeNode.createButton(
    String title,
    int channel,
    int controller,
    int value,
  ) =>
      ControlChangeNode._create(
        Control.button,
        title,
        channel,
        controller,
        value,
      );

  @override
  int get channel => _getInt(Midi.kChannel);
  void _setChannel(int c) => _setInt(Midi.kChannel, c);

  @override
  int get controller => _getInt(Midi.kController);
  void _setController(int c) => _setInt(Midi.kController, c);

  @override
  int get value => _getInt(Midi.kValue);
  void _setValue(int v) => _setInt(Midi.kValue, v);

  int _getInt(String key) {
    final i = super.get<int>(key);
    if (i == null) {
      throw Exception("Control $title has no value set for '$key'.");
    }
    return i;
  }

  void _setInt(String key, int i) {
    if (!Midi.verifyProperty(key, i)) {
      throw Exception(
        "The value for '$key' cannot be set to $i since must be between ${Midi.getMin(key)} and ${Midi.getMax(key)}.",
      );
    }
    set(key, i);
  }

  ControlChange toCC() => ControlChange(
        channel: channel,
        value: value,
        controller: controller,
      );

  @override
  void rename(String title) {
    _setTitle(title);
    notifyListeners();
  }

  void updateValue(int value) {
    _setValue(value);
    notifyListeners();
  }
}

class ControlChangeNodeParser extends NodeParser<ControlChangeNode> {
  @override
  ControlChangeNode createModel() => ControlChangeNode._();

  @override
  Map<String, Type>? get nodeMap {
    return {
      "type": String,
      Midi.kChannel: int,
      Midi.kController: int,
      Midi.kValue: int,
    };
  }
}
