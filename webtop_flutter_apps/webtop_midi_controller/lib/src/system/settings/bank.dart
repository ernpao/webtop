import 'preset.dart';

abstract class Bank {
  String get name;
  List<Preset> get presets;
  void addPreset(covariant Preset preset);
  void removePreset(String name);
}
