import 'package:flutter/foundation.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:webtop_midi_controller/lib.dart';

void main() {
  test("Webtop MIDI Settings Parsing Test", () async {
    final settings = await SettingsNode.getSettings();

    final parser = BankNodeParser();

    final bank = settings.createNewBank();
    final preset = bank.createNewPreset();

    final module = ModuleNode();
    module.name = "Test Module";

    final slider = ControlChangeNode.createSlider(Control.gain, 1, 1, 0);
    final button = ControlChangeNode.createButton(Control.bypass, 1, 2, 0);

    module.addControl(slider);
    module.addControl(button);
    preset.addModule(module);
    bank.createNewPreset();

    final parsedBank = parser.parse(bank.encode());
    final parsedPreset = parsedBank.presets.first;
    final parsedModule = parsedPreset.modules.first;
    final parsedSlider = parsedModule.getControlsByType(Control.slider).first;
    final parsedButton = parsedModule.getControlsByType(Control.button).first;

    assert(parsedBank.presets.first is PresetNode);
    assert(parsedBank.presets.first.parent != null);
    assert(parsedBank.presets.first.path == "Bank 1/Preset 1");

    final fetchedSlider =
        parsedBank.findDescendantByPath("/Preset 1/Test Module/Gain");
    final fetchedButton =
        parsedBank.findDescendantByPath("/Preset 1/Test Module/Bypass");
    assert(fetchedSlider != null);
    assert(fetchedSlider!.identifier == parsedSlider.title);
    assert(fetchedButton!.identifier == parsedButton.title);
    debugPrintSynchronously(parsedBank.prettify());
    debugPrintSynchronously(settings.prettify());
  });
}
