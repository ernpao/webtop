import 'package:flutter/foundation.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'preset.dart';

abstract class Bank extends AbstractNode {
  String get name;
  set name(String name);
  List<Preset> get presets;
  Preset createNewPreset();
  void removePreset(covariant Preset preset);
}

class BankNode extends ParseableNode implements Bank {
  BankNode._() : super(childParser: _presetParser);

  @override
  String get name => identifier;

  @override
  set name(String name) => identifier = name;

  @override
  List<PresetNode> get presets => children.cast<PresetNode>();

  @override
  PresetNode createNewPreset() {
    final preset = PresetNode.createPreset("Preset ${presets.length + 1}");
    adoptChild(preset);
    return preset;
  }

  @override
  void removePreset(PresetNode preset) => dropChild(preset);

  static final _presetParser = PresetNodeParser();

  factory BankNode.createDefaultBank() => BankNode.createBank("Default");
  factory BankNode.createBank(String name) {
    final bank = BankNode._()..name = name;
    return bank;
  }
}

class BankNodeParser extends NodeParser<BankNode> {
  @override
  BankNode createModel() => BankNode._();

  @override
  Map<String, Type>? get nodeMap => null;
}
