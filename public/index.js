'use strict';

let originalString = null;
let resultStringSVG = null;
let fileToLoad = null;

window.onload = () => {
  fileToLoad = document.getElementById("fileToLoad");
  fileToLoad.addEventListener("change", () => {
    loadFileAsText();
  })
}

function loadFileAsText() {
  const fileToLoad = document.getElementById("fileToLoad").files[0];

  const fileReader = new FileReader();

  fileReader.onload = function (fileLoadedEvent) {
    originalString = fileLoadedEvent.target.result;
    const regex = /<\s*text[^>]*>UNREGISTERED<\s*\/\s*text>/gm;
    const subst = ``;
    resultStringSVG = originalString.replace(regex, subst);
    drawInSVG()
    convertToPNG()
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
}

function drawInSVG() {
  document.getElementById("original_svg_placeholder").innerHTML = originalString;
  document.getElementById("result_svg_placeholder").innerHTML = resultStringSVG;
  drawInImg();
}

function drawInImg() {
  const original_svg_box = document.getElementById("original_svg_placeholder");
  const original_svgElement = original_svg_box.children[0];
  const original_imgElement = document.getElementById("original_image_placeholder");
  const original_xml = (new XMLSerializer()).serializeToString(original_svgElement);
  original_imgElement.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(original_xml)));

  const result_svg_box = document.getElementById("result_svg_placeholder");
  const result_svgElement = result_svg_box.children[0];
  const result_imgElement = document.getElementById("result_image_placeholder");
  const result_xml = (new XMLSerializer()).serializeToString(result_svgElement);
  result_imgElement.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(result_xml)));

  document.getElementById("result_save_SVG_button").style.display = "block";
  document.getElementById("result_save_PNG_button").style.display = "block";
  document.getElementById("images").style.display = "flex";
}

const save = (option) => {
  if (option === "SVG") {
    if ('showSaveFilePicker' in window) {
      return downloadAs(resultStringSVG);
    }
    return download(resultStringSVG);
  } else if (option === "PNG") {

    document.getElementById("lol").click();

  }
};

function download(text) {
  const file = new File([text], 'name.svg', {
    type: 'image/svg+xml',
  })

  const link = document.createElement('a')
  const url = URL.createObjectURL(file)

  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

async function downloadAs(text) {
  const handle = await window.showSaveFilePicker({
    suggestedName: 'name.svg',
    types: [{
      description: 'Text file',
      accept: {'image/svg+xml': ['.svg']},
    }],
  });

  const blob = new Blob([text]);

  const writableStream = await handle.createWritable();
  await writableStream.write(blob);
  await writableStream.close();
}

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
