'use strict'

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
var gMouseEvs = ['click', 'mousedown', 'mouseup', 'mouseover', 'mouseleave']
var gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gElCanvas;
var gToPress = false;
var gMeme;
var gMemes;
var gSavedMeme;
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gStage = null
var gIndex
var gIsAfterRemoveItem
var gTextChoosed
var gImageObj 
var gToDataUrl
var gTr
var gLayer
var gMytext

function init() {
  gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    numOfTexts: 0,
    lines: [],
    image: null,
    mousePressed: null
  }

  //gElCanvas = document.getElementById('my-canvas')
  // gCtx = gElCanvas.getContext('2d')


  //*********   a BUTTONs   listeners **/*

  closeModalMem()
  const elMems = document.querySelector('.mems');
  const elCloseMems = document.querySelector('.closeModalMem');
  const elAddBtn = document.querySelector('.add-txt');
  const elDeleteTxt = document.querySelector('.delete-txt');
  // const elDeleteMeme = document.querySelector('.delete-meme');
  // const elCanvas = document.getElementById('my-canvas');







  const elStrokeColor = document.querySelector('.strok-modal');
  const elFontColor = document.querySelector('.font-modal');
  const elSave = document.querySelector('.save-btn');
  const elAbout = document.querySelector('.about');



  // mouse events
  elMems.addEventListener('click', mems);
  elCloseMems.addEventListener('click', closeModalMem);
  // elCanvas.addEventListener('mousedown', doMousePressed,false);
  // elCanvas.addEventListener('click', canvasClicked);
  elAddBtn.addEventListener('click', addText);
  elDeleteTxt.addEventListener('click', deleteText);
  //elDeleteMeme.addEventListener('click', deleteMeme);
  elStrokeColor.addEventListener('click', strokeColor);
  elFontColor.addEventListener('click', fontColor);
  elSave.addEventListener('click', save);
  elAbout.addEventListener('click', openAbout);

  // touch events
  // elMems.addEventListener('touchstart', mems);
  // elCanvas.addEventListener('touchstart', doMousePressed,false);
  // elCanvas.addEventListener('touchstart', canvasClicked);
  // elAddBtn.addEventListener('touchstart', addText);
  // elDelete.addEventListener('touchstart', deleteText);




 


  // elStrokeColor.addEventListener('touchstart', strokeColor);
  // elFontColor.addEventListener('touchstart', fontColor);
  // elSave.addEventListener('touchstart', save);

  /************************ konva eventListener */
  document.getElementById('download').addEventListener(
    'click',
    function () {
      //removes rectangle from text
      gMeme.lines.forEach((txt)=>{  
        txt.konvaTr.nodes([]);
      })  
      var dataURL = stage.toDataURL();
      gToDataUrl = dataURL
      downloadURI(dataURL, 'my-image.png');
    },
    false
  );
  /************************************************** */
  loadImages()
}

// mem.img = mem.img.toDataURL("image/png").replace("image/png", "image/octet-stream");   

function loadImages() {
  const images = getImages()

  const val = localStorage.getItem('memObject')
  var memObj
  if (!val) {
    // memObj = images.map((mem)=>{
    //   return mem
    // })
    memObj = images
    saveToStorage('memObject', memObj)
    console.log('save mems to storage;', memObj)
  } else {
    memObj = JSON.parse(val)
    images.forEach(mem => {
      var isContain = memObj.some((element) => {
        return (element.id === mem.id)
      })
      if (!isContain) {
        memObj.push(mem)
      }
    });
    saveToStorage('memObject', memObj)
  }
  gMemes = memObj
  var i = 1
  const strHtmls = memObj.map((meme) => {
    return `
    <div class="img images img-mems${i}">
        <img  id="${i}" class="card-image image${i++}" src="${meme.img}"  data ="${meme.id}" alt=""> 
    </div>`
  })
    var arrimg = `<div class="upload-img"> 
    <label  for="imgUploader"  @drop.prevent="handleFile" @dragover.prevent="dragOver"  @dragleave="isDragOver = false"  >
        <img  class="browse-img"  src="https://res.cloudinary.com/omerphoto/image/upload/v1629707256/44517597_l_nsv2ct.jpg">
    </label>
    <input class="browse file-btn"  id="imgUploader"  src="/media/examples/login-button.png" type="file" accept="image/*" placeholder="BROWSE" onchange="uploadImage(event)" id="file-input">
  </div>`;
  strHtmls.push(arrimg)
  document.querySelector('.grid-container').innerHTML = strHtmls.join('')
  
  for (i = 1; i < memObj.length + 1; i++) {
    const elImg = document.querySelector(`.image${i}`);
    elImg.addEventListener('click', function (num) {
      return function () {
        openEditModal(num, false);
      };
    }(i));

  }

   

}

/**************** konva's Text Code ****************************** */
var vwLocal = vw * 0.30
var width = window.innerWidth;
width = width * 0.3
var height = window.innerHeight;


var sceneWidth = window.innerWidth;
var sceneHeight = window.innerWidth ;
console.log('sceneWidth before',sceneWidth)

if(sceneWidth>580){
  sceneWidth = sceneWidth * 0.3;
  sceneHeight = sceneHeight * 0.3;
}else{
  sceneWidth = sceneWidth * 0.6;
  sceneHeight = sceneHeight * 0.6;
}
// var sceneWidth = window.innerWidth * 0.3;
// var sceneHeight = window.innerWidth * 0.3;

console.log('sceneWidth after',sceneWidth)

var stage = new Konva.Stage({
  container: 'container',
  width: sceneWidth,
  height: sceneWidth,
});

gStage = stage
var layer = new Konva.Layer();
gLayer = layer

stage.add(layer);

var newText = new Konva.Text({
  x: window.vwLocal * 0.5,
  y: window.vwLocal * 0.5,
  fontSize: window.vwLocal * 0.1,
  text: 'Hello from omer.',
  draggable: true,
  fill: 'white'
});
stage.container().style.width = '30vw';
stage.container().style.height = '30vw';
stage.container().style.backgroundSize = '30vw 30vw';






/********************************* end Text Code ******************************************* */



/********************** responsive width ******************************************* */

function fitStageIntoParentContainer() {
 
  if((window.innerWidth<890)&&(window.innerWidth>670)){
    document.querySelector('.canvas-container').style.width = '270px';
    document.querySelector('.canvas-container').style.height = '270px';
    document.querySelector('#stage-parent').style.height = '270px'
    document.querySelector('#stage-parent').style.width = '270px'
    console.log('***********************************')
 
  }else    if((window.innerWidth<670)&&(window.innerWidth>480)){
    document.querySelector('.canvas-container').style.height = '40vw'
    document.querySelector('.canvas-container').style.width = '40vw'
    document.querySelector('#stage-parent').style.height = '40vw'
    document.querySelector('#stage-parent').style.width = '40vw'
  }else if(window.innerWidth<=480){
    document.querySelector('.canvas-container').style.height = '58vw'
    document.querySelector('.canvas-container').style.width = '58vw'
    document.querySelector('#stage-parent').style.height = '58vw'
    document.querySelector('#stage-parent').style.width = '58vw'
  }else if(window.innerWidth>=890) {
    document.querySelector('.canvas-container').style.height =  '30vw'
    document.querySelector('.canvas-container').style.width =  '30vw'
    document.querySelector('#stage-parent').style.height = '30vw'
    document.querySelector('#stage-parent').style.width = '30vw'
  }

  var container = document.querySelector('#stage-parent');
  // now we need to fit stage into parent container
  var containerWidth = container.offsetWidth;
 // console.log('containerWidth',containerWidth)
  console.log('window.innerWidth',window.innerWidth);
  // but we also make the full scene visible
  // so we need to scale all objects on canvas
  var scale = containerWidth / sceneWidth;

  // var test = (sceneWidth * scale)/4
  stage.width(sceneWidth * scale);
  // stage.width(test);
  stage.height(sceneHeight * scale);
  stage.scale({ x: scale, y: scale });
}

//fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);
/***************************** end  responsive width ******************************************* */

function openEditModalwithSavedMems(i) {
  const elModal = document.querySelector('.modal');
  elModal.style.display = 'block';
  const img = document.querySelector(`.saved-image${i}`);
}



async function openEditModal(i, isFromLocalStorage) {
  const elModal = document.querySelector('.modal');
  const elDeleteMeme = document.querySelector('.delete-meme');
  elDeleteMeme.setAttribute("data-id", `${gMemes[i - 1].id}`);
  let vwInOpenEditModal = vw
  console.log('vwInOpenEditModal before',vwInOpenEditModal)

  if(vwInOpenEditModal>580){
    vwInOpenEditModal = vwInOpenEditModal * 0.3;
   
  }else{
    vwInOpenEditModal = vwInOpenEditModal * 0.6;
  }


  console.log('vwInOpenEditModal after',vwInOpenEditModal)
  console.log('vwInOpenEditModal after',vwInOpenEditModal)
  if (isFromLocalStorage) {
    const img = document.querySelector(`.saved-image${i}`);
    //gStage.container().style.backgroundImage = `url(${img.src.substring(22)})`;
    // gStage.container().style.backgroundImage = img
     const elModalImg =  await document.querySelector(`.image${i}`)
    gMeme.image = elModalImg;

    /******************** konve upload image to front ************************************* */
    // main API:
    var imageObj = new Image();
    imageObj.onload = function () {
      const myImage = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: vwInOpenEditModal,
        height: vwInOpenEditModal,
      });
      // add the shape to the layer
      layer.add(myImage);
    };
    imageObj.src = `${elModalImg.src}`;
    gImageObj = imageObj
    /****************************************************************************** */
  } else {
    const elModalImg = document.querySelector(`.image${i}`)
    gMeme.image = elModalImg;
    /******************** konve upload image to front ************************************* */
    //main API:
    var imageObj = new Image();
    imageObj.onload = function () {
      const myImage = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: vwInOpenEditModal,
        height: vwInOpenEditModal,
      });
      // add the shape to the layer
      layer.add(myImage);
    };
    imageObj.src = `${elModalImg.src}`;
    gImageObj = imageObj
  }
  /******************** END konve upload image to front ************************************* */
  await layer.draw()
  elModal.style.display = 'block';
  fitStageIntoParentContainer()
}
function closeModal() {
  for (let i = 0; i < gMeme.lines.length; i++) {
    gMeme.lines[i].konvaObj.remove()
    gMeme.lines[i].konvaTr.remove()
  }
  document.querySelector('.txt-mem').value = ""
  const elModal = document.querySelector('.modal');
  elModal.style.display = 'none';
  gMeme.lines=[]; 
  gTextChoosed = null
}
/************** konva download ***********************************/
function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
/********************* END download ********************************* */

function addText(ev) {
  const objDetails = { konvaObj: null, konvaTr: null, txt: '', lineIdx: 0, minX: 0, maxX: 0, minY: 0, maxY: 0, fontLength: 0, fontSize: 55, font: 'impact', textAlign: 'center', strokeColor: 'black', fontColor: 'white', }
  var myvw = window.innerWidth 
  var mytest =  window.vwLocal
  var mytestX = 1
  console.log('myvw',myvw)
  if(myvw<580){
    mytest = mytest*2
    mytestX += 400
  }else{
    mytestX += 700
  }
  const elAdd = document.querySelector('.txt-mem');
  const strTxt = elAdd.value;
  if(!strTxt){
    return
  }
  objDetails.txt = strTxt
  const num = gMeme.lines.length
  console.log('gMeme.lines', gMeme.lines)
  var idy = null
  switch (num) {
    case 0:
      idy =mytest * 0.42;
      break;
    case 1:
      idy = mytest * 0.8;
      break;
    case 2:
      idy = mytest * 0.1;
      break;
    default:
      idy = mytest* 0.32;
      break;
  }
  let size = 0
  if(strTxt.length>5){
    size=0.1
  }else{
    size=0.18
  }
  var myText = new Konva.Text({
    x: mytestX * size,
    y: idy,
    fontSize:  mytest * 0.15,
    text: strTxt,
    draggable: true,
    fill: objDetails.fontColor,
    name: 'txt',
    fontFamily :  objDetails.font,
    stroke: objDetails.strokeColor,
    strokeWidth:2,
  });

  myText.on('click', function (event) {
    console.log('event',event.target.index)
    gTextChoosed = this
  });
  myText.on('touchstart', function (event) {
    console.log('event',event.target.index)
    gTextChoosed = this
  });

    gMytext = myText 
    layer.add(myText);
    var tr = new Konva.Transformer();
    gTr = tr
    layer.add(tr);
    objDetails.konvaObj = myText
    objDetails.konvaTr = tr
    gMeme.lines.push(objDetails);
    console.log('gMeme.lines', gMeme.lines)

  /******************* select shape ************************* */
  var selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
    visible: false,
  });
  layer.add(selectionRectangle);
  var x1, y1, x2, y2;
  stage.on('mousedown touchstart', (e) => {
    // do nothing if we mousedown on any shape
    if (e.target !== stage) {
      return;
    }
    x1 = stage.getPointerPosition().x;
    y1 = stage.getPointerPosition().y;
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.visible(true);
    selectionRectangle.width(0);
    selectionRectangle.height(0);
  });

  stage.on('mousemove touchmove', () => {
    // no nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
  });

  stage.on('mouseup touchend', () => {
    console.log(',tr.nodes',tr.nodes())
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      console.log('!selectionRectangle.visible() in mouseup touchend')
      return;
    }
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      selectionRectangle.visible(false);
      console.log('setTimeout')
    });

    var shapes = stage.find('.txt');
    var box = selectionRectangle.getClientRect();
    var selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    tr.nodes(selected);
  });

  // clicks should select/deselect shapes
  stage.on('click tap', function (e) {
    // if we are selecting with rect, do nothing
    console.log('select text')
    if (selectionRectangle.visible()) {
      console.log('do unselect text')
      return;
    }

    // if click on empty area - remove all selections
    if (e.target === stage) {
      tr.nodes([]);
      console.log('empty area')
      return;
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName('txt')) {
      console.log('do nothing if clicked NOT on our rectangles')
      const nodes = tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
      return;
    }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      console.log('!metaPressed && !isSelected ')
      tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      console.log('metaPressed && isSelected')
      const nodes = tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      console.log('metaPressed && !isSelected')
      const nodes = tr.nodes().concat([e.target]);
      tr.nodes(nodes);
    }
  });

  /****************** END selected shap ********************************** */

}


function deleteText() {
  if (((gMeme.lines.length) > 0)&&(gTextChoosed)) {
    var indexToRemove =  gMeme.lines.findIndex((objDetails)=>{
      return (objDetails.konvaObj===gTextChoosed)
    })
    gTextChoosed.remove()
    gMeme.lines.splice(indexToRemove,1)
  }else if ((gMeme.lines.length) > 0){
      gMeme.lines[gMeme.lines.length - 1].konvaObj.remove()
    gMeme.lines[gMeme.lines.length - 1].konvaTr.remove()
    gMeme.lines.pop();
  }
  gTextChoosed = null
}

function renderMemn() {

}

function canvasClicked(ev) {

}

function doMousePressed(ev) {
  //console.log(' mouse presed event : ',ev)
  const mousePressed = {
    x: ev.layerX,
    y: ev.layerY
  }
  gMeme.mousePressed = mousePressed
  //gMeme.lines[i].strokeColor = 'blue'
}


function choosFonts() {
  console.log('gTextChoosed ',gTextChoosed)
  const elChoosFonts = document.querySelector('select[name=choosFonts]');
  const fontchoosed = +elChoosFonts.value;

  switch (fontchoosed) {
    case 1:
      gTextChoosed.fontFamily('impact')
      break;
    case 2:
      gTextChoosed.fontFamily('lato')
      break;
    case 3:
      gTextChoosed.fontFamily('euro')
      break;
    default:
      gTextChoosed.fontFamily('euro')
      break;
  }
    console.log('fontchoosed',fontchoosed)
          // force update manually
    // gTr.forceUpdate();
    // layer.add(gTr);
   // window.alert(`fontchoosed : ${fontchoosed}`)
  //  mytext.draw()
 // gTextChoosed.fontFamily('lato')
}



function strokeColor(ev) {
  ev.preventDefault();
  const elTxtCol = document.querySelector(".txtcol");
  const txtColor = elTxtCol.value;
  gTextChoosed.stroke(txtColor)
  console.log('strokeColor ',txtColor)
}

function fontColor() {
  const elCol = document.querySelector(".font-col");
  let stColor = elCol.value
 // gMeme.lines[0].konvaObj.fill(stColor)
 console.log('gTextChoosed ',gTextChoosed)
  gTextChoosed.fill(stColor)
}


function save(e) { 
  e.preventDefault()  
  gMeme.lines.forEach((txt)=>{
    txt.konvaTr.nodes([]);
  })  
  const val = localStorage.getItem('memObject')
  gToDataUrl = stage.toDataURL();
  if (!val) {
    const memArr = [];
    //const image = gElCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var copyImageObj =JSON.parse(JSON.stringify(gImageObj)) 
    const newMeme = {
      id: makeId(),
      img:gToDataUrl
    }
    memArr.push(newMeme)
    saveToStorage('memObject', memArr)
    closeModal()
    loadImages()
    //console.log('save mems to storage;',memArr)

  } else {
    const memObj = JSON.parse(val)
   // const image = gElCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var copyImageObj =JSON.parse(JSON.stringify(gImageObj)) 
    const newMeme = {
      id: makeId(),
      img: gToDataUrl
    }
    memObj.push(newMeme)
    // console.log('save mems to storage;gToDataUrl',gToDataUrl)
    saveToStorage('memObject', memObj)
    closeModal()
    loadImages()
  }
  
}
/**************************************************************************************** */
function mems() {
  const elModal = document.querySelector('.modal-mems');
  elModal.style.display = 'block';
  const elMainModal = document.querySelector('.saved-mems-modal-main');
  elMainModal.style.display = 'block';
  const val = localStorage.getItem('memObject')
  const memObj = JSON.parse(val)
  //console.log('mems from localstorage',memObj)
  gSavedMeme = memObj;
  var i = 1;
  if (memObj) {
    const strHtmls = memObj.map((meme) => {
      return `
    <img class="saved-mems-img saved-image${i++}" src="${meme.img}"  alt="">`
    })
    document.querySelector('.saved-mems-grid-container').innerHTML = strHtmls.join('')
    for (i = 1; i < memObj.length + 1; i++) {
      const elImg = document.querySelector(`.saved-image${i}`);
      elImg.addEventListener('click', function (num) {
        return function () {
          openEditModal(num, true);
        };
      }(i));
      elImg.addEventListener('touchstart', function (num) {
        return function () {
          openEditModal(num, true);
        };
      }(i));
    }
  }
}

function closeModalMem() {
  const elModal = document.querySelector('.modal-mems');
  elModal.style.display = 'none';
  const elMainModal = document.querySelector('.saved-mems-modal-main');
  elMainModal.style.display = 'none';
}

function uploadImage(file) {
  var input = file.target;
  const reader = new FileReader();
  reader.onload = function () {
    var dataURL = reader.result;
    var output = document.getElementById('img-loader');
    //output.src = dataURL;
    addToDB(dataURL)
    loadImages()

  };
  reader.readAsDataURL(input.files[0]);
}

function addToDB(memeImg) {
  // gImages.push(memeImg)
  var newMeme = {
    img: memeImg,
    id: makeId()
  }
  gImages.push(newMeme)
}

function openAbout() {
  const elModal = document.querySelector('.about-modal');
  elModal.style.display = 'block';
}
function closeAboutModal() {
  const elModal = document.querySelector('.about-modal');
  elModal.style.display = 'none';
}

function deleteMeme(ev,element) {
  ev.preventDefault();
  // console.log('elementtttttttttttttt',element.dataset.id)
  let idxToRemove = gMemes.findIndex((meme) => {
    return (meme.id == element.dataset.id)
  })

  gMemes.splice(idxToRemove, 1)
  // console.log('gMemes after splice' ,gMemes)
  saveToStorage('memObject', gMemes)
  idxToRemove = gImages.findIndex((meme) => {
    return (meme.id == element.dataset.id)
  })
  //console.log('idxToRemove in gImages ',idxToRemove)
  gImages.splice(idxToRemove, 1)

  // console.log('gImages',gImages)
  closeModal()
  loadImages()
}

