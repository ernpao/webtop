import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'widgets/continuous_control_slider.dart';

final MidiClient client = MidiClient(
  host: "192.168.100.192",
  socketPort: 6868,
);

class WebtopMidiController extends StatelessWidget {
  const WebtopMidiController({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    client.openSocket();
    return Application(
      theme: ThemeData.dark(),
      child: Builder(builder: (context) {
        return Scaffold(
          body: SingleChildScrollView(
            child: Row(
              children: [
                ContinuousControlSlider(
                  color: Colors.black,
                  channel: 1,
                  controller: 1,
                  initialValue: 0,
                  deviceName: "IAC Driver Webtop MIDI",
                  interface: client,
                ),
                ContinuousControlSlider(
                  color: Colors.black,
                  channel: 1,
                  controller: 2,
                  initialValue: 0,
                  deviceName: "IAC Driver Webtop MIDI",
                  interface: client,
                ),
              ],
            ),
          ),
        );
      }),
    );
  }
}
