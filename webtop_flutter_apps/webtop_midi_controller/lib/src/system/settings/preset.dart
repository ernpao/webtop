import 'module.dart';

abstract class Preset {
  String get name;
  List<Module> get modules;
  void addModule(covariant Module module);
  void removeModule(String name);
}
