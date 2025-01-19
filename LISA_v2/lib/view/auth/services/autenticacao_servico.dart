import 'package:firebase_auth/firebase_auth.dart';

class AutenticacaoServico {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  Future<String?> cadastrarUsuario({
    required String nome,
    required String email,
    required String senha,
  }) async {
    try {
      UserCredential userCredential =
          await _firebaseAuth.createUserWithEmailAndPassword(
        email: email,
        password: senha,
      );
      await userCredential.user!.updateDisplayName(nome);

      return null;
    } on FirebaseAuthException catch (e) {
      // print('Erro: ${e.code}');
      if (e.code == 'email-already-in-use') {
        return 'Este e-mail já está cadastrado.';
      }

      return 'Erro inesperado. Tente novamente.';
    }
  }

  Future<String?> logarUsuario(
      {required String email, required String senha}) async {
    try {
      await _firebaseAuth.signInWithEmailAndPassword(
          email: email, password: senha);

      await FirebaseAuth.instance.currentUser!.reload();

      return null;
    } on FirebaseAuthException catch (e) {
      // print('Erro: ${e.code}');

      if (e.code == 'invalid-credential') {
        return 'Credenciais inválidas. Tente novamente.';
      } else if (e.code == 'too-many-requests') {
        return 'Muitas tentativas. Tente novamente mais tarde.';
      }

      return 'Erro inesperado. Tente novamente.';
    }
  }

  Future<void> deslogarUsuario() async {
    return await _firebaseAuth.signOut();
  }
}
