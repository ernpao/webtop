import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';
import 'widgets/cc_slider_group.dart';

final MidiClient client = MidiClient(
  host: "192.168.100.192",
  socketPort: 6868,
);

const String deviceName = "IAC Driver Webtop MIDI";

class WebtopMidiController extends StatefulWidget {
  WebtopMidiController({Key? key}) : super(key: key);
  final List<CCSliderParameters> initialData = [
    CCSliderParameters(
      channel: 1,
      controller: 1,
      value: 64,
      title: "GAIN",
      min: 20,
    ),
    CCSliderParameters(
      channel: 1,
      controller: 2,
      value: 0,
      title: "LEVEL",
    ),
    CCSliderParameters(
      channel: 1,
      controller: 3,
      value: 0,
      title: "TONE",
    ),
  ];
  @override
  State<WebtopMidiController> createState() => _WebtopMidiControllerState();
}

class _WebtopMidiControllerState extends State<WebtopMidiController> {
  late List<CCSliderParameters> _data;

  @override
  void initState() {
    _data = widget.initialData;
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    client.openSocket();
    return Application(
      theme: ThemeData.dark(),
      child: Builder(builder: (context) {
        final sliderHeight = Hover.getScreenHeightWithScale(0.4, context);
        return Scaffold(
          body: Center(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Flex(
                direction: Axis.horizontal,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // MidiControlChangeSlider(
                  //   title: "GAIN",
                  //   color: Colors.grey.shade900,
                  //   channel: 1,
                  //   controller: 1,
                  //   initialValue: 0,
                  //   deviceName: deviceName,
                  //   interface: client,
                  //   onChanged: print,
                  // ),
                  // MidiControlChangeSlider(
                  //   title: "LEVEL",
                  //   color: Colors.grey.shade900,
                  //   channel: 1,
                  //   controller: 2,
                  //   initialValue: 0,
                  //   deviceName: deviceName,
                  //   interface: client,
                  //   onChanged: print,
                  // ),
                  CCSliderGroup(
                    deviceName: deviceName,
                    interface: client,
                    color: Colors.grey.shade900,
                    title: "8080D Distortion",
                    sliderHeight: sliderHeight,
                    sliderData: _data,
                    onChanged: (data) {
                      setState(() {
                        _data = data;
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
