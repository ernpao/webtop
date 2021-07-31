import 'package:flutter/foundation.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'module.dart';

abstract class Preset extends AbstractNode {
  String get name;
  set name(String presetName);
  List<Module> get modules;
  void addModule(covariant Module module);
  void removeModule(covariant Module module);
}

class PresetNode extends ParseableNode implements Preset {
  PresetNode() : super(childParser: _moduleNodeParser);

  @override
  String get name => identifier;

  @override
  set name(String presetName) => identifier = presetName;

  @override
  List<ModuleNode> get modules => children.cast<ModuleNode>();

  @override
  void addModule(ModuleNode module) => adoptChild(module);

  @override
  void removeModule(ModuleNode module) => dropChild(module);

  static final _moduleNodeParser = ModuleNodeParser();
}

class PresetNodeParser extends NodeParser<PresetNode> {
  @override
  PresetNode createModel() => PresetNode();

  @override
  Map<String, Type>? get nodeMap => null;
}
