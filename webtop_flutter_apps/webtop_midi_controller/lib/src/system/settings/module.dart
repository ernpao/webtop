abstract class Module {
  String get name;
  List<Control> get controls;

  List<Control> getControlsByType(String type);
}

abstract class Control {
  String get type;

  static const List<String> types = [
    slider,
    button,
  ];
  static const String slider = "slider";
  static const String button = "button";

  static bool isValidType(String type) {
    return types.contains(type);
  }

  static const String gain = "Gain";
  static const String level = "Level";
  static const String tone = "Tone";
  static const String blend = "Blend";
  static const String attack = "Attack";
}
