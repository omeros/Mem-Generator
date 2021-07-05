'use strict'

var gMouseEvs = ['click', 'mousedown', 'mouseup', 'mouseover', 'mouseleave']
var gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gElCanvas;
var gCtx;
var gToPress=false;
var gMeme;
var gSavedMeme;
var gKeywords = { 'happy': 12, 'funny puk': 1 }

function init() {
  gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    numOfTexts: 0,
    lines: [],
    image: null,
  }

  gElCanvas = document.getElementById('my-canvas')
  gCtx = gElCanvas.getContext('2d')


  //*********   a BUTTONs   listeners **/*

  closeModalMem()
  const elMems = document.querySelector('.mems');
  const elCloseMems = document.querySelector('.closeModalMem');
  const elAddBtn = document.querySelector('.add');
  const elDelete = document.querySelector('.delete');
  const elCanvas = document.getElementById('my-canvas');

  const elUp = document.querySelector('.up');
  const elDown = document.querySelector('.down');
  const elUpDown = document.querySelector('.up-down');
  const elApluse = document.querySelector('.apluse');
  const elAminus = document.querySelector('.aminus');
  const elAlignToLeft = document.querySelector('.align-to-left');
  const elAlignCenter = document.querySelector('.align-center');
  const elAlignToRigth = document.querySelector('.align-to-right');
  const elStrokeColor = document.querySelector('.strok-modal');
  const elFontColor = document.querySelector('.font-modal');
  const elSave = document.querySelector('.save');
  const elAbout = document.querySelector('.about');



  // mouse events
  elMems.addEventListener('click', mems);
  elCloseMems.addEventListener('click', closeModalMem);
  elCanvas.addEventListener('click', canvasClicked);
  elAddBtn.addEventListener('click', addText);
  elDelete.addEventListener('click', deleteText);
  elUp.addEventListener('click', up);
  elDown.addEventListener('click', Down);
  elUpDown.addEventListener('click', upDown);
  elApluse.addEventListener('click', aPluse);
  elAminus.addEventListener('click', aMinus);
  elAlignToLeft.addEventListener('click', alignToLeft);
  elAlignCenter.addEventListener('click', alignCenter);
  elAlignToRigth.addEventListener('click', alignToRigth);
  elStrokeColor.addEventListener('click', strokeColor);
  elFontColor.addEventListener('click', fontColor);
  elSave.addEventListener('click', save);
  elAbout.addEventListener('click', openAbout);

  // touch events
  elMems.addEventListener('touchstart', mems);
  elCanvas.addEventListener('touchstart', canvasClicked);
  elAddBtn.addEventListener('touchstart', addText);
  elDelete.addEventListener('touchstart', deleteText);

  elUp.addEventListener('touchstart', up);
  elDown.addEventListener('touchstart', Down);
  elUpDown.addEventListener('touchstart', upDown);
  elApluse.addEventListener('touchstart', aPluse);
  elAminus.addEventListener('touchstart', aMinus);
  elAlignToLeft.addEventListener('touchstart', alignToLeft);
  elAlignCenter.addEventListener('touchstart', alignCenter);
  elAlignToRigth.addEventListener('touchstart', alignToRigth);
  elStrokeColor.addEventListener('touchstart', strokeColor);
  elFontColor.addEventListener('touchstart', fontColor);
  elSave.addEventListener('touchstart', save);
  loadImages()
}
 /***************************************************************************************** */
function loadImages(){
//  const elGrid = document.querySelector('.grid-container');
  const images =  getImages()
  var i = 1 
  const strHtmls = images.map( (img)=> {
    return `
    <div class="img images img-mems${i}">
        <img  id="${i}" class="card-image image${i++}" src="${img}" alt=""> 
    </div>`
  })
  document.querySelector('.grid-container').innerHTML = strHtmls.join('')
  for ( i = 1; i < images.length + 1; i++) {
    const elImg = document.querySelector(`.image${i}`);
    elImg.addEventListener('click', function (num) {
      return function () {
        openEditModal(num,false);
      };
    }(i));
    elImg.addEventListener('touchstart', function (num) {
      return function () {
        openEditModal(num,false);
      };
    }(i));
  }
}
    

function openEditModalwithSavedMems(i) {
  const elModal = document.querySelector('.modal');
  elModal.style.display = 'block';
  const img = document.querySelector(`.saved-image${i}`);
  const elCanvas = document.getElementById("my-canvas");
  gCtx.drawImage(img, 0, 0, 360, 360);

}
function openEditModal(i, isFromLocalStorage) {
  const elModal = document.querySelector('.modal');
  elModal.style.display = 'block';
if(isFromLocalStorage){
  const img = document.querySelector(`.saved-image${i}`);
  const elCanvas = document.getElementById("my-canvas");
  gCtx.drawImage(img, 0, 0, 360, 360);
  
}else{
  const elModalImg = document.querySelector(`.image${i}`)
  const elCanvas = document.getElementById("my-canvas");
  gMeme.image = elModalImg;
  gCtx.drawImage(elModalImg, 0, 0, 360, 360);

}

}

function closeModal() {
  const elModal = document.querySelector('.modal');
  elModal.style.display = 'none';

  //gMeme.numOfTexts=0;
  for( var i=0 ;i<= gMeme.numOfTexts+1;i++){
    console.log('delete')
    deleteText();
  }
  

}



function drawText(txt = 'abcde', currIndex, x = 210, y = 100) {
  console.log('drawtext clickrd')
  gElCanvas = document.getElementById('my-canvas')
  gCtx = gElCanvas.getContext('2d')
  gCtx.lineWidth = 2

  //console.log('gMeme.numOfTexts', gMeme.numOfTexts)
  //const numTexts=  gMeme.numOfTexts - 1 ;

  gCtx.strokeStyle = gMeme.lines[currIndex].strokeColor;
  gCtx.fillStyle = gMeme.lines[currIndex].fontColor;
  // gCtx.font = '40px Arial'
  const font = gMeme.lines[currIndex].fontSize + "px" + " " + gMeme.lines[currIndex].font;
  gCtx.font = font
  gCtx.textAlign = gMeme.lines[currIndex].textAlign;

  gCtx.fillText(txt, x, y)
  gCtx.strokeText(txt, x, y)
}

function downloadImg(elLink) {
  const elCanvas = document.getElementById('my-canvas')
  const imgContent = elCanvas.toDataURL('image/png')
  elLink.href = imgContent
}



function addText(ev) {
  const elAdd = document.querySelector('.txt-mem');
  const strTxt = elAdd.value;
  const objDetails = { txt: '', lineIdx: 0, minX: 0, maxX: 0, minY: 0, maxY: 0, fontLength: 0, fontSize: 55, font: 'impact', textAlign: 'center', strokeColor: 'white', fontColor: 'black', }
  objDetails.txt = strTxt
  var idx = 0;
  gMeme.numOfTexts++;
  const num = gMeme.numOfTexts;
  switch (num) {
    case 1:
      idx = 60;
      break;
    case 2:
      idx = 60 + 280;
      break;
    case 3:
      idx = 60 + 120;
      break;
    default:
      idx = 60 + 110;
      break;
  }

  const metrics = gCtx.measureText(strTxt)
  const testLength = metrics.width
  console.log('testLengthtttttt', testLength)
  const txtLength = strTxt.length * (objDetails.fontSize / 4);

  console.log('current txtLength', txtLength)
  objDetails.fontLength = txtLength;
  objDetails.lineIdx = idx;
  objDetails.maxY = objDetails.lineIdx;
  objDetails.minY = objDetails.maxY - objDetails.fontSize + 10;
  objDetails.maxX = 200 + (txtLength); 
  objDetails.minX = 200 - (txtLength);      

  gMeme.lines.push(objDetails);
  renderMemn()
}


function deleteText() {
  console.log('delete from the function ')

  gMeme.lines.pop();
  gMeme.numOfTexts--;
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
  gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn()
}

function renderMemn() {

  for (var i = 0; i < gMeme.lines.length; i++) {

    const memTxt = gMeme.lines[i].txt;
    const idx = gMeme.lines[i].lineIdx;
    drawText(memTxt, i, 200, idx);


  }
}

function canvasClicked(ev) {
  if (gToPress) {
    const { offsetX, offsetY } = ev;
    const numTexts = gMeme.numOfTexts - 1;

    for (const i = 0; i < gMeme.lines.length; i++) {
      const memTxt = gMeme.lines[i].txt;
      const minx = gMeme.lines[i].minX;
      const maxx = gMeme.lines[i].maxX;
      const miny = gMeme.lines[i].minY;
      const maxy = gMeme.lines[i].maxY;

    if (((offsetX < maxx) && (minx < offsetX)) && ((offsetY < maxy) && (miny < offsetY))) {
        gMeme.lines[i].strokeColor = 'red'
        gMeme.selectedLineIdx = i;
        renderMemn()
      }
    }
  }else{
    const { offsetX, offsetY } = ev;
    const numTexts = gMeme.numOfTexts - 1;
    for (const i = 0; i < gMeme.lines.length; i++) {
      const memTxt = gMeme.lines[i].txt;
      const minx = gMeme.lines[i].minX;
      const maxx = gMeme.lines[i].maxX;
      const miny = gMeme.lines[i].minY;
      const maxy = gMeme.lines[i].maxY;
    if (((offsetX < maxx) && (minx < offsetX)) && ((offsetY < maxy) && (miny < offsetY))) {
        gMeme.lines[i].strokeColor = 'white'
        break;
      }
    }
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    const img = gMeme.image;
    gCtx.drawImage(img, 0, 0, 360, 360);
    renderMemn()
  }
}


function aPluse() {
  gMeme.lines[gMeme.selectedLineIdx].fontSize++;
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
  gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn()
}
function aMinus() {
  gMeme.lines[gMeme.selectedLineIdx].fontSize--;
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
  gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn()
}
function alignToLeft() {
  gMeme.lines[gMeme.selectedLineIdx].textAlign = 'right'
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
  gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn()
}
function alignCenter() {
  gMeme.lines[gMeme.selectedLineIdx].textAlign = 'center'
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
  gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn()
}
function alignToRigth() {
  gMeme.lines[gMeme.selectedLineIdx].textAlign = 'left'
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
  gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn()
}

function strokeColor(ev) {
  console.log('hjfcdbfwbjk')
  ev.preventDefault();
  const elTxtCol = document.querySelector(".txtcol");
  const txtColor = elTxtCol.value;
  gMeme.strokeColor = txtColor;
  renderMemn()
}
function fontColor() {
  gMeme.lines[gMeme.numOfTexts].fontColor = 'null'
  renderMemn()
}


function upDown(){
  if(!gToPress){
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = 'white'
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    const img = gMeme.image;
    gCtx.drawImage(img, 0, 0, 360, 360);
    renderMemn();
  }
  gToPress= !gToPress;
   
}

function up(){
  if (gToPress) {
    gMeme.lines[gMeme.selectedLineIdx].lineIdx -=60;
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    const img = gMeme.image;
    gCtx.drawImage(img, 0, 0, 360, 360);
    renderMemn();
  }
}

function Down(){
  if (gToPress) {
    gMeme.lines[gMeme.selectedLineIdx].lineIdx +=60;
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    const img = gMeme.image;
    gCtx.drawImage(img, 0, 0, 360, 360);
    renderMemn();
  }
}


function strokeColor(){
  const elCol = document.querySelector(".txtcol");
  let stColor = elCol.value      
  gMeme.lines[gMeme.selectedLineIdx].strokeColor=stColor;
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
  gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn();
}

function fontColor(){
  const elCol = document.querySelector(".font-col");
  let stColor = elCol.value      
  gMeme.lines[gMeme.selectedLineIdx].fontColor=stColor;
  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
  gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn();
}

function save(){
  const val = localStorage.getItem('memObject')
  if (!val){ 
    const memArr=[];
    const image = gElCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    memArr.push(image)
    saveToStorage('memObject',memArr)
    console.log('save mems to storage;')
  }else{  
    const memObj= JSON.parse(val)
    const image = gElCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    memObj.push(image)
    saveToStorage('memObject',memObj)
    //console.log('save mems to storage;')
    //console.log('image',image);
  }    
}
/**************************************************************************************** */
function mems(){
  const elModal = document.querySelector('.modal-mems');
  elModal.style.display = 'block';
  const elMainModal = document.querySelector('.saved-mems-modal-main');
  elMainModal.style.display = 'block';
  const val = localStorage.getItem('memObject')
  const memObj= JSON.parse(val)
  //console.log('mems from localstorage',memObj)
  gSavedMeme = memObj;
  var idx=0;
  var i = 1;
  const strHtmls = memObj.map( (img)=> {
  return `
  <img class="saved-mems-img saved-image${i++}" src="${img}"  alt="">`
})
document.querySelector('.saved-mems-grid-container').innerHTML = strHtmls.join('')
for ( i = 1; i < memObj.length + 1; i++) {
  const elImg = document.querySelector(`.saved-image${i}`);
  elImg.addEventListener('click', function (num) {
    return function () {
      openEditModal(num,true);
    };
  }(i));
  elImg.addEventListener('touchstart', function (num) {
    return function () {
      openEditModal(num,true);
    };
  }(i));
}
}

function closeModalMem(){
  const elModal = document.querySelector('.modal-mems');
  elModal.style.display = 'none';
  const elMainModal = document.querySelector('.saved-mems-modal-main');
  elMainModal.style.display = 'none';
}
  
function choosFonts(){
  const elChoosFonts = document.querySelector('select[name=choosFonts]');
  const fontchoosed = +elChoosFonts.value;
  const elTextMem= document.querySelector('.txt-mem');
  switch (fontchoosed) {
    case 1:
      console.log('fontchoosed',fontchoosed) 
      elTextMem.style.fontFamily='impact';
      gMeme.lines[gMeme.selectedLineIdx].font='impact';
      gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
      var img = gMeme.image;
      gCtx.drawImage(img, 0, 0, 360, 360);
      renderMemn();
      break;
      case 2:    
      console.log('fontchoosed',fontchoosed)
      gMeme.lines[gMeme.selectedLineIdx].font='lato';        
        elTextMem.style.fontFamily='latoRegular';
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        img = gMeme.image;
        gCtx.drawImage(img, 0, 0, 360, 360);
        renderMemn();
        break;
        case 3:
      console.log('fontchoosed',fontchoosed)
      gMeme.lines[gMeme.selectedLineIdx].font='euro'
      elTextMem.style.fontFamily='euro'
      gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
      img = gMeme.image;
      gCtx.drawImage(img, 0, 0, 360, 360);
      renderMemn();
      break;
      default: 
      gMeme.lines[gMeme.selectedLineIdx].font='euro';
      elTextMem.style.fontFamily='euro'
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
      img = gMeme.image;
        gCtx.drawImage(img, 0, 0, 360, 360);
        renderMemn();
      break;
  }
  console.log('fontchoosed out of the swich',fontchoosed)
}


function  uploadImage(file){
    var input = file.target;
    const reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
      var output = document.getElementById('img-loader');
      //output.src = dataURL;
      addToDB(dataURL)
      loadImages()

    };
    reader.readAsDataURL(input.files[0]);
}

function addToDB(img){
  gImages.push(img)
}

function openAbout(){
  const elModal = document.querySelector('.about-modal');
  elModal.style.display = 'block';
}
function closeAboutModal(){
  const elModal = document.querySelector('.about-modal');
  elModal.style.display = 'none';

}

