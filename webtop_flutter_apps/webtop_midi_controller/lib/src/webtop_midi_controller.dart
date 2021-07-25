import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';

import 'widgets/cc_group.dart';
import 'widgets/cc_widget_parameters.dart';

final MidiClient midiInterface = MidiClient(
  host: "192.168.100.192",
  socketPort: 6868,
);

const String targetDevice = "IAC Driver Webtop MIDI";

class WebtopMidiController extends StatefulWidget {
  WebtopMidiController({Key? key}) : super(key: key);
  final List<CCWidgetParameters> sliderParameters = [
    CCWidgetParameters(
      targetDevice: targetDevice,
      channel: 1,
      controller: 1,
      value: 0,
      title: "GAIN",
    ),
    CCWidgetParameters(
      targetDevice: targetDevice,
      channel: 1,
      controller: 2,
      value: 0,
      title: "LEVEL",
    ),
    CCWidgetParameters(
      targetDevice: targetDevice,
      channel: 1,
      controller: 3,
      value: 0,
      title: "TONE",
    ),
  ];

  final List<CCWidgetParameters> switchParameters = [
    CCWidgetParameters(
      targetDevice: targetDevice,
      channel: 1,
      controller: 4,
      value: 0,
      title: "TOGGLE",
    )
  ];

  @override
  State<WebtopMidiController> createState() => _WebtopMidiControllerState();
}

class _WebtopMidiControllerState extends State<WebtopMidiController> {
  late List<CCWidgetParameters> _sliderGroupParameters;

  @override
  void initState() {
    midiInterface.openSocket();
    _sliderGroupParameters = widget.sliderParameters;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    // print(_sliderGroupParameters);
    return Application(
      theme: ThemeData.dark(),
      child: Builder(builder: (context) {
        final sliderHeight = Hover.getScreenHeightWithScale(0.4, context);
        return Scaffold(
          backgroundColor: Colors.grey.shade900,
          body: Center(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Flex(
                direction: Axis.horizontal,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  CCWidgetGroup(
                    interface: midiInterface,
                    color: Colors.white,
                    title: "8080D Distortion",
                    sliderHeight: sliderHeight,
                    sliders: _sliderGroupParameters,
                    buttons: widget.switchParameters,
                    onSlidersChanged: (data) {
                      setState(() {
                        _sliderGroupParameters = data;
                      });
                    },
                  ),
                ],
              ),
            ),
          ),
        );
      }),
    );
  }
}
