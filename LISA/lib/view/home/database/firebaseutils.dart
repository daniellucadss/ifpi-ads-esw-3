import 'package:firebase_auth/firebase_auth.dart';
import 'package:trabalho_loc_ai/models/comments_model.dart';
import 'package:trabalho_loc_ai/models/establishment_model.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:logger/logger.dart';

class FirebaseUtils {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth auth = FirebaseAuth.instance;
  final Logger _logger = Logger();

  // Obtém todos os estabelecimentos favoritos do usuário
  Future<List<EstablishmentModel>> getAllFavorites() async {
    _logger.i('getAllFavorites');

    // Verifique se o usuário está autenticado
    var user = auth.currentUser;
    if (user == null) {
      _logger.e('Usuário não está autenticado.');
      throw Exception('Usuário não autenticado');
    }

    var userId = user.uid;

    try {
      var querySnapshot = await _firestore
          .collection(userId)
          .doc('favorites')
          .collection('establishment')
          .orderBy('name', descending: false)
          .get();

      // Mapeia os dados dos documentos para uma lista de EstablishmentModel
      return querySnapshot.docs
          .map((doc) => EstablishmentModel.fromMap(doc.data(), isFavorite: true))
          .toList();
    } catch (e) {
      _logger.e('Erro ao obter favoritos: $e');
      rethrow; // Propaga o erro para quem chamar o método
    }
  }

  // Adiciona um novo estabelecimento aos favoritos
  Future<void> addFavorite(EstablishmentModel favPlace) async {
    _logger.i('addFavorite');

    var userId = auth.currentUser!.uid;
    try {
      await _firestore
          .collection(userId)
          .doc('favorites')
          .collection('establishment')
          .doc(favPlace.placesId)
          .set(favPlace.toMap());
    } on FirebaseException catch (e) {
      _logger.e('Erro ao adicionar favorito: $e');
    }
  }

  // Remove um estabelecimento dos favoritos
  Future<void> removeFavorite(EstablishmentModel establishment) async {
    _logger.i('removeFavorite');

    var userId = auth.currentUser!.uid;

    try {
      await _firestore
          .collection(userId)
          .doc('favorites')
          .collection('establishment')
          .doc(establishment.placesId)
          .delete();
    } on FirebaseException catch (e) {
      _logger.e('Erro ao remover favorito: $e');
    }
  }

  // Adiciona um comentário a um estabelecimento
  Future<void> addComment(CommentModel comment) async {
    _logger.i('addComment');

    try {
      await _firestore
          .collection('establishment')
          .doc(comment.placeId)
          .collection('comments')
          .doc(comment.commentId)
          .set(comment.toMap()); // set => adiciona (se não existir)
    } on FirebaseException catch (e) {
      _logger.e('Erro ao adicionar comentário: $e');
    }
  }

  // Obtém os comentários de um estabelecimento
  Future<List<CommentModel>> getComments(String placeId) async {
    _logger.i('getComments');

    try {
      var querySnapshot = await _firestore
          .collection('establishment')
          .doc(placeId)
          .collection('comments')
          .orderBy('comment', descending: false)
          .get();

      // Mapeia os dados dos documentos para uma lista de CommentModel
      return querySnapshot.docs
          .map((doc) => CommentModel.fromMap(doc.data()))
          .toList();
    } catch (e) {
      _logger.e('Erro ao obter comentários: $e');
      return [];
    }
  }

  // Remove um comentário de um estabelecimento
  Future<void> removeComment(CommentModel comment) async {
    _logger.i('removeComment');

    try {
      await _firestore
          .collection('establishment')
          .doc(comment.placeId)
          .collection('comments')
          .doc(comment.commentId)
          .delete();
    } on FirebaseException catch (e) {
      _logger.e('Erro ao remover comentário: $e');
    }
  }
}
