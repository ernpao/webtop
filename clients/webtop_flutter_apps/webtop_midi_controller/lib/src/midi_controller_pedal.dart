import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';
import 'package:webtop_midi_controller/src/midi_controller_settings.dart';
import 'package:webtop_midi_controller/src/widgets/cc_widget_group.dart';

import 'system/system.dart';

class MidiControllerPedal extends StatelessWidget {
  const MidiControllerPedal({
    Key? key,
    required this.module,
    required this.targetDevice,
    required this.interface,
  }) : super(key: key);

  final ModuleNode module;
  final String targetDevice;
  final MidiInterface interface;

  @override
  Widget build(BuildContext context) {
    final settings = context.read<MidiControllerSettings>();
    return CCWidgetGroup(
      color: Colors.white,
      title: module.name,
      interface: interface,
      onSlidersChanged: (sliderData) {
        for (var slider in sliderData) {
          final node = module.getChildById(slider.title);
          if (node != null) {
            (node as ControlChangeNode).updateValue(slider.value);
            settings.updateControl(node);
          }
        }
      },
      buttons: _getButtons(),
      sliders: _getSliders(),
      sliderHeight: Hover.getScreenHeightWithScale(0.4, context),
    );
  }

  List<MidiWidgetParameters> _getButtons() =>
      _convertNodes(module.getButtons());

  List<MidiWidgetParameters> _getSliders() =>
      _convertNodes(module.getSliders());

  List<MidiWidgetParameters> _convertNodes(
    List<ControlChangeNode> nodes,
  ) {
    final parameters = <MidiWidgetParameters>[];

    for (var node in nodes) {
      parameters.add(MidiWidgetParameters.create(
        title: node.title,
        targetDevice: targetDevice,
        channel: node.channel,
        controller: node.controller,
        value: node.value,
        min: node.min,
        max: node.max,
      ));
    }

    return parameters;
  }
}
