import 'package:flutter/material.dart';
import 'package:glider_sensors/glider_sensors.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';

void main() {
  runApp(WebtopIMU());
}

class WebtopIMU extends StatelessWidget {
  WebtopIMU({Key? key}) : super(key: key);

  final _api = IotWebAPI(
    host: "192.168.100.191",
    port: 6767,
    socketPort: 6868,
  )
    ..openSocket()
    ..listen(
      WebSocketJsonListener(),
      reopenOnDone: true,
    );

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
                    final accelDataJson = JSON()
                      ..setProperty("x", accelData?.x)
                      ..setProperty("y", accelData?.y)
                      ..setProperty("z", accelData?.z);

                    final gyroDataJson = JSON()
                      ..setProperty("x", accelData?.x)
                      ..setProperty("y", accelData?.y)
                      ..setProperty("z", accelData?.z);

                    final sensorDataJson = JSON()
                      ..setProperty("accelerometer", accelDataJson)
                      ..setProperty("gyroscope", gyroDataJson);

                    if (_api.isClosed) {
                      _api.openSocket();
                      _api.listen(
                        WebSocketJsonListener(),
                        reopenOnDone: true,
                      );
                    }

                    _api.sendImuData(
                      "Realme 5 Pro",
                      accelerometerX: accelData?.x,
                      accelerometerY: accelData?.y,
                      accelerometerZ: accelData?.z,
                      gyroscopeX: gyroData?.x,
                      gyroscopeY: gyroData?.y,
                      gyroscopeZ: gyroData?.z,
                    );

                    return Column(
                      children: [
                        Text(
                          // "Gyroscope Event X: ${gyroData?.x} Y: ${gyroData?.y} Z: ${gyroData?.z}",
                          sensorDataJson.prettify(),
                        ),
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
