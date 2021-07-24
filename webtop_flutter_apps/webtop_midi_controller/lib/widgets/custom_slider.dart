import 'package:flutter/cupertino.dart';

class CustomSlider extends StatefulWidget {
  const CustomSlider({
    Key? key,
    required this.onChanged,
    this.initialValue = 0.0,
    this.min = 0.0,
    this.max = 1.0,
    this.color,
  })  : assert(min < max),
        assert(initialValue >= min),
        assert(initialValue <= max),
        super(key: key);

  final Function(double value) onChanged;
  final double initialValue;
  final double max;
  final double min;
  final Color? color;

  @override
  State<CustomSlider> createState() => _CustomSliderState();
}

class _CustomSliderState extends State<CustomSlider> {
  /// Slider size

  static const double _height = 350;
  static const double _width = 50;

  /// Slider track constants

  static const double _trackWidth = 20;
  static const _trackLeft = (_width - _trackWidth) / 2;
  static const _trackRadius = Radius.circular(_trackWidth / 2);
  // static final _trackShadow = BoxShadow(
  //   blurRadius: 6,
  //   offset: const Offset(2, 2),
  //   color: CupertinoColors.black.withOpacity(0.15),
  // );

  /// Slider thumb constants

  static const double _thumbSize = 40;
  static const _thumbSizeHalf = _thumbSize / 2;
  static const _thumbLeft = (_width - _thumbSize) / 2;
  static const _thumbRadius = Radius.circular(_thumbSizeHalf);
  static final _thumbShadow = BoxShadow(
    blurRadius: 6,
    offset: const Offset(2, 2),
    color: CupertinoColors.black.withOpacity(0.15),
  );

  /// Slider position constants

  static const _maxSliderPosition = _height - _thumbSize;
  late final double _minSliderPosition = (min / max) * _maxSliderPosition;

  double get max => widget.max;
  double get min => widget.min;
  double get initialValue => widget.initialValue;

  late double _sliderPosition;

  late final Color _color = widget.color ?? CupertinoColors.systemBlue;

  @override
  void initState() {
    _sliderPosition = (initialValue / max) * _maxSliderPosition;
    super.initState();
  }

  void _updateSliderValue(Offset delta) {
    double newPosition = (_sliderPosition - delta.dy).roundToDouble();

    if (_valueWithinLimits(newPosition)) {
      _sliderPosition = newPosition;
      double val = _translateSliderPosition();
      widget.onChanged(val);
      setState(() {});
    }
  }

  double _translateSliderPosition() {
    return ((_sliderPosition / _maxSliderPosition) * (max));
  }

  bool _valueWithinLimits(double value) {
    return value <= _maxSliderPosition && value >= _minSliderPosition;
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
              bottom: 0,
              left: _trackLeft,
              child: Container(
                decoration: BoxDecoration(
                  color: CupertinoColors.black.withOpacity(0.05),
                  borderRadius: const BorderRadius.all(_trackRadius),
                ),
                width: _trackWidth,
                height: _height,
              ),
            ),
            Positioned(
              bottom: 0,
              left: _trackLeft,
              child: Container(
                decoration: BoxDecoration(
                  color: _color,
                  // boxShadow: [_trackShadow],
                  borderRadius: const BorderRadius.only(
                    bottomLeft: _trackRadius,
                    bottomRight: _trackRadius,
                  ),
                ),
                width: _trackWidth,
                height: _sliderPosition + _thumbSizeHalf,
              ),
            ),
            Positioned(
              left: _thumbLeft,
              bottom: _sliderPosition,
              child: GestureDetector(
                onVerticalDragUpdate: (details) {
                  _updateSliderValue(details.delta);
                },
                child: Container(
                  height: _thumbSize,
                  width: _thumbSize,
                  decoration: BoxDecoration(
                    color: _color,
                    boxShadow: [_thumbShadow],
                    borderRadius: const BorderRadius.all(_thumbRadius),
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
