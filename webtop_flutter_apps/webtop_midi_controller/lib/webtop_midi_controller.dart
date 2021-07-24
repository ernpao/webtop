import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'widgets/custom_slider.dart';

class WebtopMidiController extends StatefulWidget {
  WebtopMidiController({
    Key? key,
  }) : super(key: key);

  final MidiClient client = MidiClient(
    host: "192.168.100.192",
    socketPort: 6868,
  );

  @override
  State<WebtopMidiController> createState() => _WebtopMidiControllerState();
}

class _WebtopMidiControllerState extends State<WebtopMidiController> {
  int sliderVal = 0;

  @override
  void initState() {
    widget.client.openSocket();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Application(
      theme: ThemeData.dark(),
      child: Scaffold(
        body: SingleChildScrollView(
          child: Column(
            children: [
              CustomSlider(
                onChanged: (val) {
                  print('Slider value: $val');
                  setState(() {
                    sliderVal = val;
                  });
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
