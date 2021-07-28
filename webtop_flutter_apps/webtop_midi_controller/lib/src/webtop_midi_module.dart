import 'package:glider_webtop/glider_webtop.dart';

import 'system/system.dart';
import 'widgets/cc_widget_parameters.dart';

class WebtopMidiModule extends Parseable implements Module {
  @override
  String get name => super.get("name");

  @override
  Map<String, Type>? get parseMap => null;

  static WebtopMidiModule create({
    required String name,
    List<WebtopMidiControl>? controls,
  }) {
    final module = WebtopMidiModule();
    module.set("name", name);
    module.set("controls", controls ?? []);
    return module;
  }

  @override
  List<Control> getControlsByType(String type) {
    return controls.where((control) => control.type == type).toList();
  }

  @override
  List<WebtopMidiControl> get controls {
    return getListOf<WebtopMidiControl>("controls");
  }
}

class WebtopMidiModuleParser extends Parser<WebtopMidiModule> {
  @override
  WebtopMidiModule createModel() => WebtopMidiModule();
}

class WebtopMidiControl extends Parseable implements Control {
  static WebtopMidiControl create(
    CCWidgetParameters parameters,
    String type,
  ) {
    assert(Control.isValidType(type), "'$type' is not a valid control type");
    final control = WebtopMidiControl();
    control.set("parameters", parameters);
    control.set("type", type);
    return control;
  }

  CCWidgetParameters get parameters => super.get("parameters");

  @override
  Map<String, Type>? get parseMap => {
        "parameters": CCWidgetParameters,
        "type": String,
      };

  @override
  String get type => super.get("type");
}
