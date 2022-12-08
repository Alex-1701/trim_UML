'use strict';

const convertToPNG = async () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext('2d')
  const Canvg = window.canvg.Canvg;
  const v = await Canvg.from(ctx, resultStringSVG);
  v.start();
  const img_b64 = canvas.toDataURL('image/png');
  const aDownloadLink = document.getElementById('lol');
  aDownloadLink.download = 'canvas_image.png';
  aDownloadLink.href = img_b64;

}
