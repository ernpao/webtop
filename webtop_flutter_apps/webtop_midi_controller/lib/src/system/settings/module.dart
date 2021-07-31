import 'package:flutter/foundation.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'control.dart';

abstract class Module extends AbstractNode {
  String get name;
  set name(String name);

  List<Control> get controls;
  void addControl(covariant Control control);
  void removeControl(covariant Control control);
  List<Control> getControlsByType(String type);
}

class ModuleNode extends ParseableNode implements Module {
  ModuleNode() : super(childParser: _ccNodeParser);

  @override
  String get name => identifier;

  @override
  set name(String name) => identifier = name;

  @override
  List<ControlChangeNode> get controls => children.cast<ControlChangeNode>();

  @override
  void addControl(ControlChangeNode control) => adoptChild(control);

  @override
  void removeControl(ControlChangeNode control) => dropChild(control);

  @override
  List<Control> getControlsByType(String type) {
    Control.isValidType(type, throwException: true);
    return controls.where((c) => c.type == type).toList();
  }

  static final _ccNodeParser = ControlChangeNodeParser();
}

class ModuleNodeParser extends NodeParser<ModuleNode> {
  @override
  ModuleNode createModel() => ModuleNode();

  @override
  Map<String, Type>? get nodeMap => null;
}
