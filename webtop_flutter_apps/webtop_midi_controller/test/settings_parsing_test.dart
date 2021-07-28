import 'package:flutter_test/flutter_test.dart';
import 'package:webtop_midi_controller/src/widgets/cc_widget_parameters.dart';
import 'package:webtop_midi_controller/webtop_midi_controller.dart';

void main() {
  test("Webtop MIDI Module Parsing Test", () async {
    final module = WebtopMidiModule.create(
      name: "Distortion Module",
      controls: [
        WebtopMidiControl.create(
          CCWidgetParameters.create(
            targetDevice: targetDevice,
            channel: 1,
            controller: 1,
            value: 0,
          ),
          "slider",
        ),
      ],
    );

    final preset = WebtopMidiPreset.create(name: "Preset sample");
    preset.addModule(module);
    final encodedPreset = preset.encode();
    print(encodedPreset);

    final parsedPreset = WebtopMidiPresetParser().parse(encodedPreset);

    assert(parsedPreset.modules.length == 1);
  });
  test("Webtop MIDI Settings Parsing Test", () async {});
}
