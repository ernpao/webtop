import 'package:flutter/cupertino.dart';
import 'package:flutter/widgets.dart';

class CustomSlider extends StatelessWidget {
  const CustomSlider({
    required this.onChanged,
    Key? key,
  }) : super(key: key);

  final Function(int value) onChanged;

  @override
  Widget build(BuildContext context) {
    return _CustomSliderPainter(
      onChanged: onChanged,
    );
  }
}

class _CustomSliderPainter extends StatefulWidget {
  const _CustomSliderPainter({
    required this.onChanged,
    Key? key,
  }) : super(key: key);
  final Function(int value) onChanged;

  @override
  _CustomSliderPainterState createState() => _CustomSliderPainterState();
}

class _CustomSliderPainterState extends State<_CustomSliderPainter> {
  static const double _height = 500;
  static const double _width = 35;
  static const double _trackWidth = 20;

  static const double _sliderHeight = 50;
  double _sliderPosition = 0;

  late final double _maxSliderPosition = _height - _sliderHeight;

  static const int _maxValue = 127;

  void _updateSliderValue(Offset delta) {
    final newPosition = _sliderPosition - delta.dy;

    if (newPosition < _maxSliderPosition && newPosition > 0) {
      _sliderPosition = newPosition.roundToDouble();
      int val = ((_sliderPosition / _maxSliderPosition) * (_maxValue)).toInt();
      widget.onChanged(val);
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: SizedBox(
        width: _width,
        height: _height,
        child: Stack(
          children: [
            Positioned(
              left: (_width - _trackWidth) / 2,
              child: Container(
                color: CupertinoColors.systemRed,
                width: _trackWidth,
                height: _height,
              ),
            ),
            Positioned(
              left: 0,
              bottom: _sliderPosition,
              child: GestureDetector(
                onVerticalDragUpdate: (details) {
                  _updateSliderValue(details.delta);
                },
                child: Container(
                  color: CupertinoColors.systemBlue,
                  height: _sliderHeight,
                  width: _width,
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
