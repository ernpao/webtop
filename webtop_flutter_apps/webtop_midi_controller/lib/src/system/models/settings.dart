import 'package:flutter/foundation.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:webtop_midi_controller/lib.dart';
import 'bank.dart';
import 'preset.dart';

abstract class Settings {
  List<Bank> get banks;

  Bank? get activeBank;
  Bank createNewBank();
  void switchToBank(int index);

  Preset? get activePreset;
  void switchToPreset(int index);

  void updateControl(covariant Control node);
}

class SettingsNode extends ParseableNode implements Settings {
  SettingsNode._() : super(childParser: _bankParser) {
    identifier = "Settings";
  }

  static final _bankParser = BankNodeParser();

  @override
  List<BankNode> get banks => children.cast<BankNode>();

  @override
  BankNode? get activeBank {
    if (banks.isNotEmpty && _activeBankIndex != null) {
      return banks[_activeBankIndex!];
    }
  }

  int? get _activeBankIndex => super.get<int>(_kActiveBankIndex);

  @override
  PresetNode? get activePreset {
    if (activeBank != null && _activePresetIndex != null) {
      return activeBank!.presets[_activePresetIndex!];
    }
  }

  int? get _activePresetIndex => super.get<int>(_kActivePresetIndex);

  void _setBank(int i) {
    if (banks.isNotEmpty) {
      assert(0 <= i && i <= banks.length);
      set(_kActiveBankIndex, i);
    } else {
      throw Exception(
        "Can't switch to bank $i because there are currently no banks!",
      );
    }
  }

  @override
  void switchToBank(int i) {
    _setBank(i);
  }

  void _setPreset(int i) {
    if (activeBank != null) {
      assert(0 <= i && i <= activeBank!.presets.length);
      set(_kActivePresetIndex, i);
    } else {
      throw Exception(
        "Can't switch to preset $i since there is no active bank!",
      );
    }
  }

  @override
  void switchToPreset(int i) {
    _setPreset(i);
  }

  static SettingsNode? _instance;

  static Future<SettingsNode> getSettings() async {
    debugPrint("Fetching settings...");
    _instance ??= SettingsNode._();
    return _instance!;
  }

  static SettingsNode createMockSettings() {
    final mockSettings = SettingsNode._();

    final bank = mockSettings.createNewBank();
    final preset = bank.createNewPreset();
    preset.addModule(PredefinedModules.distortion);

    return mockSettings;
  }

  static const _kActiveBankIndex = "activeBankIndex";
  static const _kActivePresetIndex = "activePresetIndex";

  @override
  BankNode createNewBank() {
    final bank = BankNode.createBank("Bank ${banks.length + 1}");
    adoptChild(bank);
    return bank;
  }

  @override
  void updateControl(ControlNode node) {
    setNode(node.path, node);
  }
}

class SettingsNodeParser extends NodeParser<SettingsNode> {
  @override
  SettingsNode createModel() => SettingsNode._();

  @override
  Map<String, Type>? get nodeMap => {
        SettingsNode._kActiveBankIndex: int,
        SettingsNode._kActivePresetIndex: int,
      };
}
