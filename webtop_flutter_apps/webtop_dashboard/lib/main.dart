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
        body: Container(
          child: WebSocketMonitor(
            webSocket: WebtopClient(
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
                    final bytes = message.bodyAsUint8List();
                    print(bytes.runtimeType);
                    if (bytes != null) {
                      return Center(child: Image.memory(bytes));
                    }
                  }
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(e.message.created.formattedDateTime),
                        // Text(e.message.body ?? ""),
                      ],
                    ),
                  );
                }
              } else {
                print("Null WebSocket event on rebuild.");
              }
              return const Center(child: Text("No Data"));
            },
          ),
        ),
      ),
    );
  }
}
