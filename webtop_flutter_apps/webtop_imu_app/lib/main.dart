import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';

void main() {
  runApp(const WebtopIMU());
}

class WebtopIMU extends StatelessWidget {
  const WebtopIMU({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Application(
      theme: HoverThemeData.dark.data,
      child: Scaffold(),
      useMaterialAppWidget: true,
    );
  }
}
