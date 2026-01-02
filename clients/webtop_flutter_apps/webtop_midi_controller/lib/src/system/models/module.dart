import 'package:flutter/foundation.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'control.dart';

abstract class Module extends AbstractNode {
  String get name;
  set name(String name);

  List<Control> get controls;
  void addControl(covariant Control control);
  void addControls(covariant List<Control> controls);
  void removeControl(covariant Control control);
  List<Control> getControlsByType(String type);
  List<Control> getSliders() => getControlsByType(Control.slider);
  List<Control> getButtons() => getControlsByType(Control.button);
}

class ModuleNode extends ParseableNode with ChangeNotifier implements Module {
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
  List<ControlChangeNode> getControlsByType(String type) {
    Control.isValidType(type, throwException: true);
    return controls.where((c) => c.type == type).toList();
  }

  static final _ccNodeParser = ControlChangeNodeParser();

  @override
  List<ControlChangeNode> getSliders() => getControlsByType(Control.slider);

  @override
  List<ControlChangeNode> getButtons() => getControlsByType(Control.button);

  @override
  void addControls(List<ControlChangeNode> controls) =>
      controls.forEach(addControl);
}

class ModuleNodeParser extends NodeParser<ModuleNode> {
  @override
  ModuleNode createModel() => ModuleNode();

  @override
  Map<String, Type>? get nodeMap => null;
}

class PredefinedModules {
  static ModuleNode get distortion {
    return _createModule("Distortion", [
      ControlChangeNode.createSlider(Control.gain, 1, 1, 64),
      ControlChangeNode.createSlider(Control.tone, 1, 2, 64),
      ControlChangeNode.createSlider(Control.level, 1, 3, 64),
      ControlChangeNode.createButton(Control.bypass, 1, 4, 64),
    ]);
  }

  static ModuleNode _createModule(
    String name,
    List<ControlChangeNode> controls,
  ) {
    final module = ModuleNode();
    module.name = name;
    module.addControls(controls);
    return module;
  }
}
