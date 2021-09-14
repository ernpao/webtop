import 'package:flutter/material.dart';
import 'package:glider_sensors/glider_sensors.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';

void main() {
  runApp(const WebtopIMU());
}

class WebtopIMU extends StatefulWidget {
  const WebtopIMU({Key? key}) : super(key: key);

  @override
  State<WebtopIMU> createState() => _WebtopIMUState();
}

class _WebtopIMUState extends State<WebtopIMU> with CreateUUID {
  final _api = IotWebAPI(
    host: "192.168.100.191",
    port: 6767,
    socketPort: 6868,
  );

  void _openSocket() {
    _api.openSocket();
    _api.listen(
      WebSocketJsonListener(),
      reopenOnDone: true,
    );
  }

  @override
  void initState() {
    _openSocket();
    super.initState();
  }

  /// Metadata of the data set for recording.
  bool _isRecording = false;
  late String _recordingId = createUuid();
  late DateTime _recordingCreated = DateTime.now();

  void _resetRecording() {
    setState(() {
      _isRecording = false;
      _recordingId = createUuid();
      _recordingCreated = DateTime.now();
    });
  }

  JSON _getDataSetInfo() {
    return JSON()
      ..setProperty("id", _recordingId)
      ..setProperty("created", _recordingCreated);
  }

  JSON _getSensorData(AccelerometerEvent? accelData, GyroscopeEvent? gyroData) {
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

    return sensorDataJson;
  }

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
                    if (_isRecording) {
                      _api.sendImuData(
                        "Realme 5 Pro",
                        _getDataSetInfo(),
                        accelerometerX: accelData?.x,
                        accelerometerY: accelData?.y,
                        accelerometerZ: accelData?.z,
                        gyroscopeX: gyroData?.x,
                        gyroscopeY: gyroData?.y,
                        gyroscopeZ: gyroData?.z,
                      );
                    }

                    return Column(
                      children: [
                        Text(_getSensorData(accelData, gyroData).prettify()),
                        HoverCallToActionButton(
                          text: "Toggle Monitoring",
                          onPressed: () {
                            if (_isRecording) {
                              accelControl?.stopMonitoring();
                              gyroControl?.stopMonitoring();
                              _resetRecording();
                            } else {
                              accelControl?.monitor();
                              gyroControl?.monitor();
                              setState(() {
                                _isRecording = true;
                              });
                            }
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
