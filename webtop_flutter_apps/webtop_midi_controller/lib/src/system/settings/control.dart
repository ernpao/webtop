import 'package:flutter/foundation.dart';
import 'package:glider_webtop/glider_webtop.dart';

abstract class Control extends AbstractNode {
  String get type;
  set type(String type);

  String get title;
  set title(String title);

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

abstract class ControlNode extends ParseableNode implements Control {
  ControlNode() : super(childParser: null);

  @override
  String get type => super.get<String>("type") ?? "";

  @override
  set type(String type) {
    Control.isValidType(type, throwException: true);
    set("type", type);
  }

  @override
  String get title => identifier;

  @override
  set title(String title) => identifier = title;
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
    node.type = type;
    node.title = title;
    node.channel = channel;
    node.controller = controller;
    node.value = value;
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
  set channel(int c) {
    _setInt(Midi.kChannel, c);
  }

  @override
  int get controller => _getInt(Midi.kController);
  set controller(int c) => _setInt(Midi.kController, c);

  @override
  int get value => _getInt(Midi.kValue);
  set value(int v) => _setInt(Midi.kValue, v);

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
