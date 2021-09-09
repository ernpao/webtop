import 'package:flutter/material.dart';
import 'package:glider_sensors/glider_sensors.dart';
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
      child: Scaffold(
        body: Column(
          children: [
            AccelerometerWidget(
              builder: (context, accelData, accelControl) {
                return GyroscopeWidget(
                  builder: (context, gyroData, gyroControl) {
                    return Column(
                      children: [
                        Text(
                          "Accelerometer Event X: ${accelData?.x} Y: ${accelData?.y} Z: ${accelData?.z}",
                        ),
                        Text(
                            "Gyroscope Event X: ${gyroData?.x} Y: ${gyroData?.y} Z: ${gyroData?.z}"),
                        HoverCallToActionButton(
                          text: "Toggle Monitoring",
                          onPressed: () {
                            accelControl?.toggleMonitoring();
                            gyroControl?.toggleMonitoring();
                          },
                        )
                      ],
                    );
                  },
                );
              },
            )
          ],
        ),
      ),
      useMaterialAppWidget: true,
    );
  }
}
