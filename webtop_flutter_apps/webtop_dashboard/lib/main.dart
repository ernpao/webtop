import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

void main() {
  runApp(WebtopDashboard());
}

class WebtopDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Application(
      useMaterialAppWidget: true,
      providers: [],
      theme: ThemeData.dark(),
      child: Scaffold(
        backgroundColor: Colors.black,
        body: Center(
          child: BufferSourceLiveImage(
            interface: WebtopWebAPI(
              host: "192.168.100.191",
              port: 6767,
              socketPort: 6868,
            ),
            width: 320,
            height: 240,
          ),
        ),
      ),
    );
  }
}
