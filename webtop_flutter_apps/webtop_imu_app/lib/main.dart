import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';

void main() {
  runApp(const WebtopIMU());
}

class WebtopIMU extends StatelessWidget {
  const WebtopIMU({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Application(
      child: Scaffold(),
      useMaterialAppWidget: true,
    );
  }
}
