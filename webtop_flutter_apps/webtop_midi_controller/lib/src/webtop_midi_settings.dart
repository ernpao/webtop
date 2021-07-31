import 'package:flutter/foundation.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'system/system.dart';

abstract class Settings {
  List<Bank> get banks;

  Bank? get activeBank;
  Bank createNewBank();
  void switchToBank(int index);

  Preset? get activePreset;
  void switchToPreset(int index);
}

class WebtopMidiSettings extends ParseableNode
    with ChangeNotifier
    implements Settings {
  WebtopMidiSettings._() : super(childParser: _bankParser) {
    identifier = "Settings";
  }

  static final _bankParser = BankNodeParser();

  @override
  List<BankNode> get banks => children.cast<BankNode>();

  @override
  BankNode? get activeBank {
    if (banks.isNotEmpty && _activeBankIndex != null) {
      banks[_activeBankIndex!];
    }
  }

  int? get _activeBankIndex => super.get<int>(_kActiveBankIndex);

  @override
  PresetNode? get activePreset {
    if (activeBank != null && _activePresetIndex != null) {
      activeBank!.presets[_activePresetIndex!];
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
    notifyListeners();
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
    notifyListeners();
  }

  static WebtopMidiSettings? _instance;

  static Future<WebtopMidiSettings> getSettings() async {
    _instance ??= WebtopMidiSettings._();
    return _instance!;
  }

  static const _kActiveBankIndex = "activeBankIndex";
  static const _kActivePresetIndex = "activePresetIndex";

  @override
  BankNode createNewBank() {
    final bank = BankNode.createBank("Bank ${banks.length + 1}");
    adoptChild(bank);
    return bank;
  }
}

class SettingsManagerParser extends NodeParser<WebtopMidiSettings> {
  @override
  WebtopMidiSettings createModel() => WebtopMidiSettings._();

  @override
  Map<String, Type>? get nodeMap => {
        WebtopMidiSettings._kActiveBankIndex: int,
        WebtopMidiSettings._kActivePresetIndex: int,
      };
}
