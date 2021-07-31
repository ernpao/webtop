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
}

class ControlNode extends ParseableNode implements Control {
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

class ControlNodeParser extends NodeParser<ControlNode> {
  @override
  ControlNode createModel() => ControlNode();

  @override
  Map<String, Type>? get nodeMap {
    return {
      "type": String,
    };
  }
}
