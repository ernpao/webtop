import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';
import 'widgets/midi_control_change_slider_group.dart';

final MidiClient client = MidiClient(
  host: "192.168.100.192",
  socketPort: 6868,
);

const String deviceName = "IAC Driver Webtop MIDI";

class WebtopMidiController extends StatelessWidget {
  const WebtopMidiController({Key? key}) : super(key: key);

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
                  MidiControlChangeSliderGroup(
                    deviceName: deviceName,
                    interface: client,
                    color: Colors.grey.shade900,
                    title: "8080D Distortion",
                    sliderHeight: sliderHeight,
                    sliderData: [
                      MidiControlChangeSliderState(
                        channel: 1,
                        controller: 1,
                        value: 0,
                        title: "GAIN",
                      ),
                      MidiControlChangeSliderState(
                        channel: 1,
                        controller: 2,
                        value: 0,
                        title: "LEVEL",
                      ),
                      MidiControlChangeSliderState(
                        channel: 1,
                        controller: 3,
                        value: 0,
                        title: "TONE",
                      ),
                    ],
                    onChanged: (state) {
                      debugPrint(
                          "MIDI CC slider changed: Controller: ${state.controller} Channel: ${state.channel} Value: ${state.value}");
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
