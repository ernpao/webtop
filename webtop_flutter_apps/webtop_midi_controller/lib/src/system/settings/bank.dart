import 'package:flutter/foundation.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'preset.dart';

abstract class Bank extends AbstractNode {
  String get name;
  set name(String name);
  List<Preset> get presets;
  void addPreset(covariant Preset preset);
  void removePreset(covariant Preset preset);
}

class BankNode extends ParseableNode implements Bank {
  BankNode() : super(childParser: _presetParser);

  @override
  String get name => identifier;

  @override
  set name(String name) => identifier = name;

  @override
  List<PresetNode> get presets => children.cast<PresetNode>();

  @override
  void addPreset(PresetNode preset) => adoptChild(preset);

  @override
  void removePreset(PresetNode preset) => dropChild(preset);

  static final _presetParser = PresetNodeParser();
}

class BankNodeParser extends NodeParser<BankNode> {
  @override
  BankNode createModel() => BankNode();

  @override
  Map<String, Type>? get nodeMap => null;
}
