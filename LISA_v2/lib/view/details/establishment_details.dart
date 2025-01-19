import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:trabalho_loc_ai/models/establishment_model.dart';
import 'package:trabalho_loc_ai/view/home/database/firebaseutils.dart';
import 'package:trabalho_loc_ai/view/home/services/fechdata.dart';
import '../../models/comments_model.dart';

class EstablishmentDetails extends StatefulWidget {
  final EstablishmentModel establishment;
  const EstablishmentDetails({super.key, required this.establishment});

  @override
  State<EstablishmentDetails> createState() => _EstablishmentDetailsState();
}

class _EstablishmentDetailsState extends State<EstablishmentDetails> {
  final FirebaseUtils _firebaseUtils = FirebaseUtils();
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final List<String> _imageUrls = [];

  final List<CommentModel> _comments = [];
  final TextEditingController _commentController = TextEditingController();

  bool commentIsNotEmpty() {
    return _commentController.text.isNotEmpty;
  }

  late bool _sendingComment = false;

  void getPhotos() async {
    List<String> photos = await getUrlPhotos(widget.establishment.placesId);
    setState(() {
      _imageUrls.addAll(photos);
    });
  }

  @override
  void initState() {
    if (_firebaseAuth.currentUser != null) {
      _firebaseUtils.getComments(widget.establishment.placesId).then((value) {
        setState(() {
          _comments.addAll(value);
        });
      });
    }
    Future.delayed(Duration.zero, () => getPhotos()); // para evitar erro
    super.initState();
  }

  List<Image> getImagesList() {
    List<Image> imagesList = [];

    for (var url in _imageUrls) {
      imagesList.add(
        Image.network(
          url,
          fit: BoxFit.fill,
          errorBuilder: (context, error, stackTrace) {
            return const Icon(Icons.error);
          },
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) {
              return child;
            }
            return const Center(child: CircularProgressIndicator());
          },
        ),
      );
    }

    return imagesList;
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        extendBody: true,
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black),
          ),
        ),
        backgroundColor: Colors.white,
        body: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus(
              disposition: UnfocusDisposition.previouslyFocusedChild,
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                SizedBox(
                  height: 250.0,
                  width: double.infinity,
                  child: CarouselView(
                    itemExtent: 200.0,
                    scrollDirection: Axis.horizontal,
                    itemSnapping: true,
                    onTap: (value) => showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                              content: Image.network(
                                _imageUrls[value],
                                fit: BoxFit.fill,
                                errorBuilder: (context, error, stackTrace) {
                                  return const Icon(Icons.error);
                                },
                                height: 250,
                                width: 300,
                                alignment: Alignment.center,
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('Fechar'),
                                ),
                              ],
                            )),
                    backgroundColor: Colors.grey.shade400,
                    children: getImagesList(),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  widget.establishment.name,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Text(
                  widget.establishment.address,
                  style: const TextStyle(
                    fontSize: 18,
                    fontStyle: FontStyle.italic,
                    fontWeight: FontWeight.bold,
                  ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 2,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Column(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8.0),
                            border: Border.all(
                              color: Colors.grey.shade300,
                              width: 1.0,
                            ),
                            color: Colors.grey.shade100,
                            boxShadow: const [
                              BoxShadow(
                                color: Colors.black,
                                offset: Offset(0.0, 1.0),
                                blurRadius: 2.0,
                              ),
                            ],
                          ),
                          constraints: const BoxConstraints(maxHeight: 150),
                          child: _comments.isEmpty
                              ? const Padding(
                                  padding: EdgeInsets.all(16.0),
                                  child: Text(
                                    'Nenhum comentário foi adicionado ainda.',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                )
                              : ListView.builder(
                                  shrinkWrap: true,
                                  itemCount: _comments.length,
                                  padding: const EdgeInsets.all(8.0),
                                  itemBuilder: (context, index) {
                                    if (_comments.isEmpty) {
                                      return const Text('');
                                    }
                                    // print(_comments[index].comment);
                                    return ListTile(
                                      leading: const Icon(Icons.comment),
                                      title: Text(_comments[index].comment),
                                      subtitle: Text(
                                          'por ${_comments[index].userName}'),
                                    );
                                  },
                                ),
                        ),
                        const SizedBox(height: 16),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _commentController,
                                  // autofocus: true, // para focar o teclado
                                  decoration: const InputDecoration(
                                    border: OutlineInputBorder(),
                                    labelText: 'Adicione um comentário',
                                    labelStyle: TextStyle(
                                      color: Colors.grey,
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  keyboardType: TextInputType.multiline,
                                  maxLines: 3,
                                  minLines: 1,
                                  onChanged: (value) {
                                    setState(() {});
                                  },
                                  onSubmitted: (value) {
                                    if (value.isEmpty) {
                                      setState(() {
                                        _sendingComment = true;
                                      });
                                      Future.delayed(
                                        const Duration(seconds: 2),
                                        () {
                                          setState(() {
                                            _sendingComment = false;
                                          });
                                        },
                                      );
                                      return;
                                    }
                                    _firebaseUtils.addComment(
                                      CommentModel(
                                        placeId: widget.establishment.placesId,
                                        comment: _commentController.text,
                                        userId: _firebaseAuth.currentUser!.uid,
                                        userName: _firebaseAuth
                                            .currentUser!.displayName,
                                      ),
                                    );
                                    _commentController.clear();
                                  },
                                ),
                              ),
                              const SizedBox(width: 8),
                              SizedBox(
                                width: 90,
                                child: ElevatedButton(
                                  onPressed: () {
                                    if (_commentController.text.isEmpty) {
                                      Future.delayed(
                                        const Duration(seconds: 2),
                                        () {
                                          if (mounted) {
                                            ScaffoldMessenger.of(context)
                                                .showSnackBar(const SnackBar(
                                                    content: Text(
                                              'Por favor, adicione um comentário antes de enviar.',
                                            )));
                                          }
                                        },
                                      );
                                      return;
                                    }
                                    _firebaseUtils.addComment(
                                      CommentModel(
                                        placeId: widget.establishment.placesId,
                                        comment: _commentController.text,
                                        userId: _firebaseAuth.currentUser!.uid,
                                        userName: _firebaseAuth
                                            .currentUser!.displayName,
                                      ),
                                    );
                                    _commentController.clear();
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.yellow.shade900,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 9,
                                    ),
                                    textStyle: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    minimumSize: const Size.fromHeight(50),
                                  ),
                                  child: const Icon(Icons.send),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
        floatingActionButton: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          mainAxisSize: MainAxisSize.max,
          children: [
            Visibility(
              visible: !(_commentController.text.isNotEmpty),
              child: FloatingActionButton(
                heroTag: 'Back to home - ${widget.establishment.name}',
                onPressed: () {
                  Navigator.of(context).pop();
                },
                backgroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                  side: const BorderSide(color: Colors.black),
                ),
                child: const Icon(Icons.arrow_back),
              ),
            ),
            Visibility(
              visible: !(_commentController.text.isNotEmpty),
              child: FloatingActionButton(
                heroTag: 'Favorite - ${widget.establishment.name}',
                onPressed: () {
                  widget.establishment.isFavorite
                      ? _firebaseUtils
                          .removeFavorite(widget.establishment)
                          .then((_) {})
                      : _firebaseUtils
                          .addFavorite(widget.establishment)
                          .then((_) {});
                  widget.establishment.toggleFavorite();
                },
                backgroundColor: widget.establishment.isFavorite
                    ? Colors.white
                    : Colors.yellow.shade900,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                  side: widget.establishment.isFavorite
                      ? const BorderSide(color: Colors.black)
                      : const BorderSide(color: Colors.white),
                ),
                child: Icon(
                  widget.establishment.isFavorite
                      ? Icons.favorite
                      : Icons.favorite_border,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
