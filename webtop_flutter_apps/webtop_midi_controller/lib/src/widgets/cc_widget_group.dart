import 'package:flutter/material.dart';
import 'package:glider_webtop/glider_webtop.dart';
import 'package:hover/hover.dart';
import 'cc_button.dart';

import 'cc_slider.dart';
import 'cc_widget_parameters.dart';

class CCWidgetGroup extends StatelessWidget {
  const CCWidgetGroup({
    Key? key,
    required this.interface,
    this.sliders,
    this.buttons,
    this.color,
    this.title,
    this.onSlidersChanged,
    this.sliderHeight = 350,
  }) : super(key: key);

  final MidiInterface interface;
  final Color? color;
  final String? title;
  final List<CCWidgetParametersModel>? sliders;
  final List<CCWidgetParametersModel>? buttons;
  final Function(List<CCWidgetParametersModel> sliderData)? onSlidersChanged;
  final double sliderHeight;

  List<CCSlider> _buildSliders() {
    final sliderWidgets = <CCSlider>[];
    if (sliders != null) {
      for (final slider in sliders!) {
        sliderWidgets.add(CCSlider(
          parameters: slider,
          interface: interface,
          color: color,
          height: sliderHeight,
          onChanged: (parameters) {
            final data = sliders!;
            int index = data.indexOf(slider);
            if (index != -1) {
              data.replaceRange(index, index + 1, [parameters]);
              onSlidersChanged?.call(data);
            }
          },
        ));
      }
    }
    return sliderWidgets;
  }

  List<CCButton> _buildButtons() {
    final buttonWidgets = <CCButton>[];
    if (buttons != null) {
      for (final button in buttons!) {
        buttonWidgets.add(
          CCButton(
            parameters: button,
            interface: interface,
            color: color,
          ),
        );
      }
    }

    return buttonWidgets;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (title != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                title!,
                style: Theme.of(context).textTheme.headline5,
              ),
            ),
          HoverResponsiveBuilder(
            builder: (context, state, _) {
              var widgets = [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: _buildSliders(),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: _buildButtons(),
                ),
              ];

              var direction = Axis.horizontal;
              if (state == HoverResponsiveState.phone) {
                direction = Axis.vertical;
              }

              return Flex(
                direction: direction,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: widgets,
              );
            },
          )
        ],
      ),
    );
  }
}
