import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';

import 'widgets/widgets.dart';

final MidiWebAPI midiInterface = MidiWebAPI(
  host: "192.168.100.192",
  socketPort: 6868,
);

const String targetDevice = "IAC Driver Webtop MIDI";

class WebtopMidiControllerApp extends StatefulWidget {
  WebtopMidiControllerApp({Key? key}) : super(key: key);
  final List<CCWidgetParametersModel> sliderParameters = [
    CCWidgetParameters.create(
      targetDevice: targetDevice,
      channel: 1,
      controller: 1,
      value: 0,
      title: "GAIN",
    ),
    CCWidgetParameters.create(
      targetDevice: targetDevice,
      channel: 1,
      controller: 2,
      value: 0,
      title: "LEVEL",
    ),
    CCWidgetParameters.create(
      targetDevice: targetDevice,
      channel: 1,
      controller: 3,
      value: 0,
      title: "TONE",
    ),
  ];

  final List<CCWidgetParametersModel> switchParameters = [
    CCWidgetParameters.create(
      targetDevice: targetDevice,
      channel: 1,
      controller: 4,
      value: 0,
      title: "TOGGLE",
    )
  ];

  @override
  State<WebtopMidiControllerApp> createState() =>
      _WebtopMidiControllerAppState();
}

class _WebtopMidiControllerAppState extends State<WebtopMidiControllerApp> {
  late List<CCWidgetParametersModel> _sliderGroupParameters;

  @override
  void initState() {
    midiInterface.openSocket();
    _sliderGroupParameters = widget.sliderParameters;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
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
