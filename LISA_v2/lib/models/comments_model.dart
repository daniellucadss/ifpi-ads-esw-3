import 'package:uuid/uuid.dart';

class CommentModel {
  String commentId = const Uuid().v4();
  final String placeId;
  final String comment;
  final String userId;
  final String? userName;

  CommentModel({
    required this.placeId,
    required this.comment,
    required this.userId,
    this.userName = 'Desconhecido',
  });

  Map<String, dynamic> toMap() {
    return {
      'placeId': placeId,
      'comment': comment,
      'userId': userId,
      'userName': userName
    };
  }

  factory CommentModel.fromMap(Map<String, dynamic> map) {
    return CommentModel(
      placeId: map['placeId'],
      comment: map['comment'],
      userId: map['userId'],
      userName: map['userName'],
    );
  }
}
