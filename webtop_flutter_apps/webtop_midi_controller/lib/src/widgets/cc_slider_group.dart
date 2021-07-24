import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'cc_slider.dart';

class CCSliderGroup extends StatelessWidget {
  const CCSliderGroup({
    Key? key,
    required this.deviceName,
    required this.interface,
    required this.sliderData,
    this.color,
    this.title,
    this.onChanged,
    this.sliderHeight = 350,
  }) : super(key: key);

  final String deviceName;
  final MidiInterface interface;
  final Color? color;
  final String? title;
  final List<CCSliderParameters> sliderData;
  final Function(List<CCSliderParameters> sliderData)? onChanged;
  final double sliderHeight;

  void _sendValue(int channel, int controller, int value) {
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
        deviceName: deviceName,
        channel: slider.channel,
        controller: slider.controller,
        interface: interface,
        color: color,
        value: slider.value,
        min: slider.min,
        max: slider.max,
        title: slider.title,
        height: sliderHeight,
        onChanged: (value) {
          _sendValue(slider.channel, slider.controller, value);

          final data = sliderData;
          int index = data.indexOf(slider);

          if (index != -1) {
            data.replaceRange(index, index + 1, [
              CCSliderParameters(
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

class CCSliderParameters {
  CCSliderParameters({
    required this.channel,
    required this.controller,
    required this.value,
    this.min = 0,
    this.max = 127,
    this.title,
  });

  final int channel;
  final int controller;
  final int value;
  final int min;
  final int max;
  final String? title;

  @override
  String toString() {
    return "Slider State Channel: $channel Controller: $controller Value: $value";
  }
}
