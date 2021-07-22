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
        body: Container(
          child: WebSocketMonitor(
            webSocket: WebtopAPI(
              host: "192.168.100.191",
              port: 6767,
              socketPort: 6868,
            ),
            builder: (context, event) {
              print("WebSocket rebuild triggered.");
              if (event != null) {
                print(event.runtimeType);
                if (event.isMessageEvent) {
                  final e = event.asMessageEvent();
                  final message = e.message;
                  if (message.hasBody) {
                    if (message.sender == "Buffer Source") {
                      final json = JSON.parse(message.body!);
                      final bytes = json.get("data").toString().toUint8List();
                      return Center(
                        child: Image.memory(
                          bytes,
                          errorBuilder: (_, __, ___) => SizedBox.shrink(),
                        ),
                      );
                    }
                  }
                }
              }
              return const Center(child: Text("No Data"));
            },
          ),
        ),
      ),
    );
  }
}
