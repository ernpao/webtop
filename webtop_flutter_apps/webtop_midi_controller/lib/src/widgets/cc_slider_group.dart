import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

import 'cc_slider.dart';
import 'cc_widget_parameters.dart';

class CCSliderGroup extends StatelessWidget {
  const CCSliderGroup({
    Key? key,
    required this.interface,
    required this.sliderData,
    this.color,
    this.title,
    this.onChanged,
    this.sliderHeight = 350,
  }) : super(key: key);

  final MidiInterface interface;
  final Color? color;
  final String? title;
  final List<CCWidgetParameters> sliderData;
  final Function(List<CCWidgetParameters> sliderData)? onChanged;
  final double sliderHeight;

  void _sendValue(String deviceName, int channel, int controller, int value) {
    interface.sendMidiCC(
      deviceName,
      ControlChange(
        channel: channel,
        value: value,
        controller: controller,
      ),
    );
  }

  List<Widget> _buildSliders() {
    final sliders = <Widget>[];
    for (final slider in sliderData) {
      sliders.add(CCSlider(
        parameters: slider,
        interface: interface,
        color: color,
        height: sliderHeight,
        onChanged: (value) {
          _sendValue(
            slider.targetDevice,
            slider.channel,
            slider.controller,
            value,
          );

          final data = sliderData;
          int index = data.indexOf(slider);

          if (index != -1) {
            data.replaceRange(index, index + 1, [
              CCWidgetParameters(
                targetDevice: slider.targetDevice,
                title: slider.title,
                channel: slider.channel,
                controller: slider.controller,
                max: slider.max,
                min: slider.min,
                value: value,
              ),
            ]);

            onChanged?.call(data);
          }
        },
      ));
    }
    return sliders;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (title != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                title!,
                style: Theme.of(context).textTheme.headline5,
              ),
            ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: _buildSliders(),
          ),
        ],
      ),
    );
  }
}
