import 'package:flutter/cupertino.dart';
import 'system/system.dart';

class MidiControllerSettings extends ChangeNotifier implements Settings {
  SettingsNode? get settings => _settings;
  SettingsNode? _settings;
  final bool useMockSettings;
  bool get isLoading => _settings == null;

  MidiControllerSettings({
    this.useMockSettings = false,
  }) {
    _loadSettings();
  }

  void _loadSettings() async {
    if (useMockSettings) {
      _settings = SettingsNode.createMockSettings();
    } else {
      _settings = await SettingsNode.getSettings();
    }
    notifyListeners();
  }

  @override
  BankNode? get activeBank => _settings?.activeBank;

  @override
  PresetNode? get activePreset => _settings?.activePreset;

  @override
  List<BankNode> get banks => _settings?.banks ?? [];

  @override
  BankNode createNewBank() {
    assert(settings != null);
    final bank = _settings!.createNewBank();
    notifyListeners();
    return bank;
  }

  @override
  void switchToBank(int index) {
    _settings?.switchToBank(index);
    notifyListeners();
  }

  @override
  void switchToPreset(int index) {
    _settings?.switchToPreset(index);
    notifyListeners();
  }

  @override
  void updateControl(ControlChangeNode node) {
    _settings?.updateControl(node);
    notifyListeners();
  }
}
