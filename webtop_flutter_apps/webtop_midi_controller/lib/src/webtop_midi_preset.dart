import 'package:glider_webtop/glider_webtop.dart';

import 'system/system.dart';
import 'webtop_midi_module.dart';

class WebtopMidiPreset extends Parseable implements Preset {
  final moduleParser = WebtopMidiModuleParser();

  @override
  String get name => super.get("name");

  @override
  void addModule(WebtopMidiModule module) {
    final _modules = modules;
    _modules.add(module);
    super.set("modules", _modules);
  }

  @override
  List<WebtopMidiModule> get modules => getListOf<WebtopMidiModule>("modules");

  @override
  void removeModule(String name) {
    final _modules = modules;
    _modules.removeWhere((m) => m.name == name);
    super.set("modules", _modules);
  }

  @override
  Map<String, Type>? get parseMap => {
        "name": String,
        "modules": List,
      };

  static WebtopMidiPreset create({
    required String name,
    List<WebtopMidiModule>? modules,
  }) {
    final preset = WebtopMidiPreset();
    preset.set("name", name);
    preset.set("modules", modules ?? []);
    return preset;
  }
}

class WebtopMidiPresetParser extends Parser<WebtopMidiPreset> {
  @override
  WebtopMidiPreset createModel() => WebtopMidiPreset();
}
