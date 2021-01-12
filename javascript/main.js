//All of the javascript code we write will go in this file
const showLoader = () =>{
  $('#loader').removeClass("hide")
  $('#loader').addClass("loader")
}

const hideLoader = () =>{
  $('#loader').removeClass("loader")
  $('#loader').addClass("hide")
}

const showFunctionality = () =>{
  $('#copy').removeClass("hide")
  $('#copy').addClass("copy")
  $('#pdf').removeClass("hide")
  $('#pdf').addClass("pdf")
}

const copyText = () =>{
  var txt = document.querySelector("#result");
  var range = document.createRange();
  range.selectNode(txt);
  window.getSelection().addRange(range);
  console.log(txt);
  try{
    document.execCommand("copy");
  } 
  catch(err){
    alert("Sorry. An issue occured and the text was unable to be copied.")
  }
  window.getSelection().removeAllRanges();
}

// const downloadPDF = () =>{
//   console.log("hjdsfksdjf");
//   var doc = new jsPDF();
//   doc.text(document.getElementById('result'));
//   doc.save('magicreader.pdf');
// }
const { createWorker } = Tesseract;
  const worker = createWorker({
    workerPath: chrome.runtime.getURL('javascript/worker.min.js'),
    //langPath: chrome.runtime.getURL('traineddata'),
    corePath: chrome.runtime.getURL('javascript/tesseract-core.wasm.js'),
  });
const uploader = document.getElementById('uploader');
const dlBtn = document.getElementById('pdf');
console.log('dl');

const recognize = async ({ target: { files }  }) => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(files[0]);
};

const downloadPDF = async () => {
  const filename = 'magic-reader.pdf';
  const { data } = await worker.getPDF('Tesseract OCR Result');
  const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("dsdff");
    }
  }
};

//async is the only type of function that allows await expressions
const doOCR = async ( evt ) => {
  showLoader()
  const files = evt.target.files
  const image = files[0]
  const result = document.getElementById('result');
  console.log("asdjashias");

  const { createWorker } = Tesseract;

  const worker = createWorker({
    workerPath: chrome.runtime.getURL('javascript/worker.min.js'),
    corePath: chrome.runtime.getURL('javascript/tesseract-core.wasm.js'),
  });

  await worker.load();
  await worker.loadLanguage('eng'); 
  await worker.initialize('eng');
  
  const { data: { text } } = await worker.recognize(image);
  hideLoader()
  result.innerHTML = `${text}`;
  await worker.terminate();
  showFunctionality();
}

const elm = document.getElementById('uploader');
uploader.addEventListener('change', recognize);
elm.addEventListener('change', doOCR);

document.getElementById("copy").onclick = copyText;
document.getElementById("pdf").onclick = downloadPDF;

