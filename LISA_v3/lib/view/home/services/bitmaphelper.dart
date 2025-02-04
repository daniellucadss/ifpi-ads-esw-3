import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'dart:ui' as ui;
import 'dart:math' as math;

class BitmapDescriptorHelper {
  static Future<BitmapDescriptor> getBitmapDescriptorFromSvgAsset(
    String assetName,
    BuildContext context, [
    Size size = const Size(48, 48),
    Color color = Colors.transparent,
    double? scale,
    AlignmentGeometry alignment = Alignment.center,
    bool matchTextDirection = false,
    Color? filterColor,
  ]) async {
    final pictureInfo = await vg.loadPicture(SvgAssetLoader(assetName), null);

    if (context.mounted) {
      double devicePixelRatio = View.of(context).devicePixelRatio;
      int width = (size.width * devicePixelRatio).toInt();
      int height = (size.height * devicePixelRatio).toInt();

      final scaleFactor = math.min(
        width / pictureInfo.size.width,
        height / pictureInfo.size.height,
      );

      final recorder = ui.PictureRecorder();

      ui.Canvas(recorder)
        ..scale(scaleFactor)
        ..drawPicture(pictureInfo.picture);

      final rasterPicture = recorder.endRecording();

      final image = rasterPicture.toImageSync(width, height);
      final bytes = (await image.toByteData(format: ui.ImageByteFormat.png))!;

      return BitmapDescriptor.bytes(bytes.buffer.asUint8List());
    }
    return BitmapDescriptor.defaultMarker;
  }

  static Future<BitmapDescriptor> getBitmapDescriptorFromAsset(
      String assetName, BuildContext context) async {
    final ImageConfiguration imageConfiguration =
        createLocalImageConfiguration(context, size: const Size(48, 48));
    AssetMapBitmap assetMapBitmap =
        await BitmapDescriptor.asset(imageConfiguration, assetName);
    // convertendo para BitmapDescriptor
    return assetMapBitmap;
  }
}
