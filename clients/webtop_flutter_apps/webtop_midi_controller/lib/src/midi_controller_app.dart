import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';
import 'package:webtop_midi_controller/src/midi_controller_pedal.dart';

import 'midi_controller_settings.dart';

final MidiWebAPI midiInterface = MidiWebAPI(
  host: "192.168.100.192",
  socketPort: 6868,
);

const String targetDevice = "IAC Driver Webtop MIDI";

class MidiControllerApp extends StatelessWidget {
  MidiControllerApp({Key? key}) : super(key: key) {
    midiInterface.openSocket();
  }

  @override
  Widget build(BuildContext context) {
    return Application(
      providers: [
        ChangeNotifierProvider<MidiControllerSettings>.value(
          value: MidiControllerSettings(useMockSettings: true),
        )
      ],
      theme: ThemeData.dark(),
      child: Builder(builder: (context) {
        Provider.of<MidiControllerSettings>(context);
        return Scaffold(
          backgroundColor: Colors.grey.shade900,
          drawer: _buildSideNavigation(context),
          body: Column(
            children: [
              // _buildTopBar(context),
              Expanded(
                child: Row(
                  children: [
                    _buildSideNavigation(context),
                    Expanded(
                      child: _buildPresetModules(context),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildSideNavigation(BuildContext context) {
    final settings = Provider.of<MidiControllerSettings>(context);
    if (settings.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    return SizedBox(
      width: Hover.getScreenWidthWithScale(0.25, context),
      child: HoverBaseCard(
        color: Colors.grey.shade800,
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                itemBuilder: (context, index) {
                  final bank = settings.banks[index];
                  return InkWell(
                    onTap: () => settings.switchToBank(index),
                    child: Text(bank.name),
                  );
                },
                itemCount: settings.banks.length,
              ),
            ),
            Expanded(
              child: settings.activeBank == null
                  ? const Center(child: Text("Select a bank"))
                  : ListView.builder(
                      itemCount: settings.activeBank!.presets.length,
                      itemBuilder: (context, index) {
                        final preset = settings.activeBank!.presets[index];
                        return InkWell(
                          onTap: () => settings.switchToPreset(index),
                          child: Text(preset.name),
                        );
                      },
                    ),
            ),
            HoverCallToActionButton(
              color: Colors.grey.shade900,
              text: "Create New Bank",
              onPressed: settings.createNewBank,
            )
          ],
        ),
      ),
    );
  }

  // Widget _buildTopBar(BuildContext context) {
  //   return SizedBox(
  //     height: 150,
  //     child: HoverBaseCard(
  //       color: Colors.grey.shade700,
  //       child: const Center(child: Text("This is the header")),
  //     ),
  //   );
  // }

  Widget _buildPresetModules(BuildContext context) {
    final settings = Provider.of<MidiControllerSettings>(context);
    if (settings.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    final activePreset = settings.activePreset;

    return Center(
      child: activePreset == null
          ? const Center(child: Text("Select a preset"))
          : Builder(builder: (context) {
              final modules = activePreset.modules;
              final pedals = <MidiControllerPedal>[];
              for (var module in modules) {
                pedals.add(MidiControllerPedal(
                  module: module,
                  targetDevice: targetDevice,
                  interface: midiInterface,
                ));
              }
              return pedals.isEmpty
                  ? const SizedBox.shrink()
                  : SingleChildScrollView(
                      scrollDirection: Axis.horizontal,

                      // child: ListView.builder(
                      //   scrollDirection: Axis.horizontal,
                      //   itemBuilder: (context, index) {
                      //     final module = modules[index];
                      //     return MidiControllerPedal(
                      //       module: module,
                      //       targetDevice: targetDevice,
                      //       interface: midiInterface,
                      //     );
                      //   },
                      //   itemCount: modules.length,
                      // ),
                      child: Flex(
                        direction: Axis.horizontal,
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: pedals,
                      ),
                    );
            }),
    );
  }
}
