import 'package:flutter_test/flutter_test.dart';
import 'package:webtop_midi_controller/webtop_midi_controller.dart';

void main() {
  test("Webtop MIDI Settings Parsing Test", () async {
    final parser = BankNodeParser();
    final bank = BankNode();
    bank.name = "Test Bank";

    final preset = PresetNode();
    preset.name = "Test Preset";

    final module = ModuleNode();
    module.name = "Test Module";

    final slider = ControlNode();
    slider.type = Control.slider;
    slider.title = Control.gain;

    module.addControl(slider);
    preset.addModule(module);
    bank.addPreset(preset);

    final parsedBank = parser.parse(bank.encode());
    final parsedPreset = parsedBank.presets.first;
    final parsedModule = parsedPreset.modules.first;
    final parsedSlider = parsedModule.controls.first;

    assert(parsedBank.presets.first is PresetNode);
    assert(parsedBank.presets.first.parent != null);
    assert(parsedBank.presets.first.path == "Test Bank/Test Preset");

    final fetchedSlider = parsedBank.getNode("/Test Preset/Test Module/Gain");
    assert(fetchedSlider != null);
    assert(fetchedSlider!.identifier == parsedSlider.identifier);
  });
}
