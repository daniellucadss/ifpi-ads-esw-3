import 'package:flutter/material.dart';
import 'package:trabalho_loc_ai/controller/controller.dart';

import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
// import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_config/flutter_config.dart';

Future<void> initializeFirebase() async {
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  return;
}

void main() {
  WidgetsFlutterBinding.ensureInitialized(); // Required by FlutterConfig
  Future.wait<void>([FlutterConfig.loadEnvVariables(), initializeFirebase()])
      .then((value) {
    runApp(const MyApp());
  });
}

// Widgets de carregamento e erro
class LoadingScreen extends StatelessWidget {
  const LoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}

class ErrorScreen extends StatelessWidget {
  final String error;

  const ErrorScreen({super.key, required this.error});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text('Erro: $error'),
      ),
    );
  }
}
