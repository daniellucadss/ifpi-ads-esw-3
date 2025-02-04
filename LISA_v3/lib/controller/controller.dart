import 'package:flutter/material.dart';
import 'package:trabalho_loc_ai/main.dart';
import 'package:trabalho_loc_ai/view/auth/auth_screen/view.dart';
import 'package:trabalho_loc_ai/view/home/view.dart';
import 'package:firebase_auth/firebase_auth.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nearby Restaurants',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: const RoteadorTela(),
    );
  }
}

class RoteadorTela extends StatelessWidget {
  const RoteadorTela({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.userChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const LoadingScreen();
        }

        if (snapshot.hasError) {
          return ErrorScreen(error: snapshot.error.toString());
        }

        if (snapshot.hasData) {
          return const LocationMap();
        }
        return const LoginPage();
      },
    );
  }
}
