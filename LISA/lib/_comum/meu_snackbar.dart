import 'package:flutter/material.dart';

mostrarSnackBar(
    {required BuildContext context,
    required String texto,
    bool isError = true}) {
  SnackBar snackbar = SnackBar(
    content: Text(texto),
    backgroundColor: (isError) ? Colors.red : Colors.green,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
    duration: const Duration(seconds: 4),
    action: SnackBarAction(label: 'OK', textColor: Colors.white, onPressed: (){
      //Navigator.of(context).pop();
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
    }),
  );

  ScaffoldMessenger.of(context).showSnackBar(snackbar);
}
