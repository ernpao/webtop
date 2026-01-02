import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';

void main() {
  runApp(WebtopDashboard());
}

class WebtopDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Application(
      useMaterialAppWidget: true,
      providers: [],
      theme: HoverThemeData.light.data,
      child: Scaffold(
        body: Center(
          // child: WebtopLiveImage(
          //   interface: WebtopWebAPI(
          //     host: "192.168.100.191",
          //     port: 6767,
          //     socketPort: 6868,
          //   ),
          //   width: 320,
          //   height: 240,
          // ),
          child: Text('Test'),
        ),
      ),
    );
  }
}
