'use strict'

var gMouseEvs = ['click', 'mousedown', 'mouseup', 'mouseover', 'mouseleave']
var gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gElCanvas;
var gCtx;
var gToPress=false;
var gMeme;
var gMemes;
var gSavedMeme;
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gStage = null


function init() {
  gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    numOfTexts: 0,
    lines: [],
    image: null,
    mousePressed : null
  }

 //gElCanvas = document.getElementById('my-canvas')
 // gCtx = gElCanvas.getContext('2d')


  //*********   a BUTTONs   listeners **/*

  closeModalMem()
  const elMems = document.querySelector('.mems');
  const elCloseMems = document.querySelector('.closeModalMem');
  const elAddBtn = document.querySelector('.add');
  const elDeleteTxt = document.querySelector('.delete-txt');
 // const elDeleteMeme = document.querySelector('.delete-meme');
 // const elCanvas = document.getElementById('my-canvas');

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
  // elMems.addEventListener('touchstart', mems);
 // elCanvas.addEventListener('touchstart', doMousePressed,false);
  // elCanvas.addEventListener('touchstart', canvasClicked);
  // elAddBtn.addEventListener('touchstart', addText);
  // elDelete.addEventListener('touchstart', deleteText);

  // elUp.addEventListener('touchstart', up);
  // elDown.addEventListener('touchstart', Down);
  // elUpDown.addEventListener('touchstart', upDown);
  // elApluse.addEventListener('touchstart', aPluse);
  // elAminus.addEventListener('touchstart', aMinus);
  // elAlignToLeft.addEventListener('touchstart', alignToLeft);
  // elAlignCenter.addEventListener('touchstart', alignCenter);
  // elAlignToRigth.addEventListener('touchstart', alignToRigth);
  // elStrokeColor.addEventListener('touchstart', strokeColor);
  // elFontColor.addEventListener('touchstart', fontColor);
  // elSave.addEventListener('touchstart', save);

  /************************ konva eventListener */
  document.getElementById('download').addEventListener(
    'click',
    function () {
      var dataURL = stage.toDataURL();
      downloadURI(dataURL, 'stage.png');
    },
    false
  );
  /************************************************** */
  loadImages()
}

// mem.img = mem.img.toDataURL("image/png").replace("image/png", "image/octet-stream");   

function loadImages(){
  const images =  getImages()

  const val = localStorage.getItem('memObject')
  var memObj
  if (!val){ 
      // memObj = images.map((mem)=>{
      //   return mem
      // })
    memObj = images
    saveToStorage('memObject',memObj)
    console.log('save mems to storage;',memObj)
  }else{  
    memObj= JSON.parse(val)
    images.forEach(mem => {
      var isContain = memObj.some((element)=>{
        return ( element.id === mem.id )
      })
      if(!isContain){
        memObj.push(mem)
      }
    });
    saveToStorage('memObject',memObj)
  }    
  gMemes = memObj
  var i = 1 
  const strHtmls = memObj.map( (meme)=> {
    return `
    <div class="img images img-mems${i}">
        <img  id="${i}" class="card-image image${i++}" src="${meme.img}"  data ="${meme.id}" alt=""> 
    </div>`
  })
  document.querySelector('.grid-container').innerHTML = strHtmls.join('')
  for ( i = 1; i < memObj.length + 1; i++) {
    const elImg = document.querySelector(`.image${i}`);
    elImg.addEventListener('click', function (num) {
      return function () {
        openEditModal(num,false);
      };
    }(i));

  }


}




/**************** konva's Text Code ****************************** */
var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
vw = vw*0.30
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
var width = window.innerWidth;
width = width*0.3
var height = window.innerHeight;

var sceneWidth =  window.innerWidth*0.3;
var sceneHeight = window.innerWidth*0.3;

var stage = new Konva.Stage({
    container: 'container',
    width: sceneWidth,
    height: sceneWidth,
});

gStage = stage
var layer = new Konva.Layer();
//  var back = new Konva.Image({
//   imageFromURL: 'https://res.cloudinary.com/omerphoto/image/upload/v1620832660/4_y3g2ul.jpg'
//  });
// layer.add(back);

stage.add(layer);

var newText = new Konva.Text({
    x:  window.vw*0.5,
    y:  window.vw*0.5,  
    fontSize: window.vw*0.1,  
    text: 'Hello from omer.' ,
    draggable: true,
    fill: 'white'
});
// stage.container().style.backgroundImage = "url('https://res.cloudinary.com/omerphoto/image/upload/v1621970935/123_mjub6w.jpg')"
stage.container().style.width = '30vw';
stage.container().style.height = '30vw';
stage.container().style.backgroundSize = '30vw 30vw';
// layer.add(text);
// var MIN_WIDTH = 20;
// var tr = new Konva.Transformer({
//     nodes: [text],
//     padding: 5,
//     // enable only side anchors
//     enabledAnchors: ['middle-left', 'middle-right'],
//     // limit transformer size
//     boundBoxFunc: (oldBox, newBox) => {
//         if (newBox.width < MIN_WIDTH) {
//             return oldBox;
//         }
//         return newBox;
//     },
// });
// layer.add(tr);
// text.on('transform', () => {
//     // with enabled anchors we can only change scaleX
//     // so we don't need to reset height
//     // just width
//     text.setAttrs({
//         width: Math.max(text.width() * text.scaleX(), MIN_WIDTH),
//         scaleX: 1,
//         scaleY: 1,
//     });
// });





/********************************* end ******************************************* */
    


/********************** responsive width ******************************************* */


// var sceneWidth = window.innerWidth*0.3;
// var sceneHeight = window.innerWidth*0.3;

// var stage = new Konva.Stage({
//   container: 'container',
//   // first just set set as is
//   width: sceneWidth,
//   height: sceneWidth,
// });





function fitStageIntoParentContainer() {
  var container = document.querySelector('#stage-parent');

  // now we need to fit stage into parent container
  var containerWidth = container.offsetWidth;

  // but we also make the full scene visible
  // so we need to scale all objects on canvas
  var scale = containerWidth / sceneWidth;

  stage.width(sceneWidth * scale);
  stage.height(sceneHeight * scale);
  stage.scale({ x: scale, y: scale });
}

//fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);



/***************************** end ******************************************* */








function openEditModalwithSavedMems(i) {
  const elModal = document.querySelector('.modal');
  elModal.style.display = 'block';
  const img = document.querySelector(`.saved-image${i}`);
 // const elCanvas = document.getElementById("my-canvas");
//  gCtx.drawImage(img, 0, 0, 360, 360);
}



async function openEditModal(i, isFromLocalStorage) {
  const elModal = document.querySelector('.modal');
  const elDeleteMeme = document.querySelector('.delete-meme');
  elDeleteMeme.setAttribute("data-id", `${gMemes[i-1].id}`);

if(isFromLocalStorage){
  const img = document.querySelector(`.saved-image${i}`);

 //gStage.container().style.backgroundImage = `url(${img.src.substring(22)})`;
 // gStage.container().style.backgroundImage = img

   /******************** konve upload image to front ************************************* */
//  Konva.Image.fromURL(`${elModalImg.src.substring(22)}`, function (darthNode) {
//   darthNode.setAttrs({
//     x: 0,
//     y: 0,
//     scaleX: 0.99,
//     scaleY: 0.99,
//     width: vw*0.3,
//     height: vw*0.3,

//   });
//   layer.add(darthNode);
// });


     // main API:
     var imageObj = new Image();
     imageObj.onload = function () {
       var yoda = new Konva.Image({
         x: 50,
         y: 50,
         image: imageObj,
         width: vw,
         //     height: vw,
       });
     // add the shape to the layer
     layer.add(yoda);
    };
   imageObj.src =`${elModalImg.src.substring(22)}`;



/****************************************************************************** */
  // gCtx.drawImage(img, 0, 0, 360, 360);
  
}else{
  const elModalImg = document.querySelector(`.image${i}`)
  gMeme.image = elModalImg;
console.log('elModalImg','./' + elModalImg.src.substring(22))
  // var back = new Konva.Image({
  //     imageFromURL: `url(${elModalImg.src.substring(22)})`,
  //     x: 0,
  //     y: 0,
  //     scaleX: 0.99,
  //     scaleY: 0.99,
  //     width: vw,
  //     height: vw,
  // });
  //   layer.add(back)

     // main API:
     var imageObj = new Image();
     imageObj.onload = function () {
       var myImage = new Konva.Image({
         x: 0,
         y: 0,
         image: imageObj,
         width: vw,
         //     height: vw,
       });
     // add the shape to the layer
     layer.add(myImage);
    };
    imageObj.src =`${elModalImg.src.substring(22)}`;


  /******************** konve upload image to front ************************************* */
  // Konva.Image.fromURL(`${elModalImg.src.substring(22)}`, function (darthNode) {
  //   darthNode.setAttrs({
  //     x: 0,
  //     y: 0,
  //     scaleX: 0.99,
  //     scaleY: 0.99,
  //     width: vw,
  //     height: vw,

  //   });
  //  layer.add(darthNode);
  // });
 /*********************************************************************************** */
 // gStage.container().style.backgroundImage = `url(${elModalImg.src.substring(22)})`;
 // console.log('fdfdsfsdf  :  ',elModalImg.src.substring(22))
  // gCtx.drawImage(elModalImg, 0, 0, 360, 360);

}

elModal.style.display = 'block';
}

function closeModal() {
   for( let i=0 ;i< gMeme.lines.length;i++){
    gMeme.lines[i].konvaObj.remove()
    gMeme.lines[i].konvaTr.remove()
  }


  document.querySelector('.txt-mem').value = ""
  const elModal = document.querySelector('.modal');
  elModal.style.display = 'none';

}



function drawText(txt = 'abcde', currIndex, x, y ) {
//  console.log('drawtext clickrd')
  //gElCanvas = document.getElementById('my-canvas')
 // gCtx = gElCanvas.getContext('2d')
 // gCtx.lineWidth = 2

  //console.log('gMeme.numOfTexts', gMeme.numOfTexts)
  //const numTexts=  gMeme.numOfTexts - 1 ;

 // gCtx.strokeStyle = gMeme.lines[currIndex].strokeColor;
 // gCtx.fillStyle = gMeme.lines[currIndex].fontColor;
  // gCtx.font = '40px Arial'
  const font = gMeme.lines[currIndex].fontSize + "px" + " " + gMeme.lines[currIndex].font;
 // gCtx.font = font
 // gCtx.textAlign = gMeme.lines[currIndex].textAlign;

  console.log(' print text in y :',y)
 // gCtx.fillText(txt, x, y)
 // gCtx.strokeText(txt, x, y)
}

function downloadImg(elLink) {
  const elCanvas = document.getElementById('container')
  const imgContent = elCanvas.toDataURL('image/png')
  elLink.href = imgContent

  
  
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
/****************************************************** */


function addText(ev) {
  const objDetails = { konvaObj : null, konvaTr : null, txt: '', lineIdx: 0, minX: 0, maxX: 0, minY: 0, maxY: 0, fontLength: 0, fontSize: 55, font: 'impact', textAlign: 'center', strokeColor: 'white', fontColor: 'black', }
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  const elAdd = document.querySelector('.txt-mem');
  const strTxt = elAdd.value;
  objDetails.txt = strTxt
  
  const num = gMeme.lines.length
  console.log('num',num)
  var idy  = null
  switch (num) {
    case 0:
      idy =  window.vw*0.42;
    break;
    case 1:
      idy = window.vw*0.8;
    break;
    case 2:
      idy = window.vw*0.1 ;
    break;
    default:
      idy =  window.vw*0.32;
    break;
  }
  var myText = new Konva.Text({
            x:  window.vw*0.27,
            y:  idy,  
            fontSize: window.vw*0.1,  
            text: strTxt ,
            draggable: true,
            fill: 'black',
            name  : 'txt',
            
  });         
  layer.add(myText); 

  var MIN_WIDTH = 20;
  // var tr = new Konva.Transformer({
  //           nodes: [myText],
  //           padding: 5,
  //   // enable only side anchors
  //   enabledAnchors: ['middle-left', 'middle-right'],
  //   // limit transformer size
  //   boundBoxFunc: (oldBox, newBox) => {
  //       if (newBox.width < MIN_WIDTH) {
  //           return oldBox;
  //       }
  //       return newBox;
  //   },
  // });
  var tr = new Konva.Transformer();
  layer.add(tr);
//   myText.on('transform', () => {
//     // with enabled anchors we can only change scaleX
//     // so we don't need to reset height
//     // just width
//     myText.setAttrs({
//         width: Math.max(myText.width() * myText.scaleX(), MIN_WIDTH),
//         scaleX: 1,
//         scaleY: 1,
//     });
// });
objDetails.konvaObj = myText
objDetails.konvaTr = tr

gMeme.lines.push(objDetails);
console.log('gMeme.lines',gMeme.lines)



/******************* select shap ************************* */
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
    console.log('!metaPressed && !isSelected')
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
  if((gMeme.lines.length)>0){
    gMeme.lines[gMeme.lines.length-1].konvaObj.remove()
    gMeme.lines[gMeme.lines.length-1].konvaTr.remove()
    gMeme.lines.pop();
  }
}

function renderMemn() {

  for (var i = 0; i < gMeme.lines.length; i++) {

    const memTxt = gMeme.lines[i].txt;
    const idy = gMeme.lines[i].lineIdy;
    const idx = gMeme.lines[i].lineIdx;
    drawText(memTxt, i, 200 + idx, idy);


  }
}

function canvasClicked(ev) {  
    const dx = ev.offsetX - gMeme.mousePressed.x 
    const dy = ev.offsetY - gMeme.mousePressed.y   

   // console.log('mousePressed.x ',gMeme.mousePressed.x )
    console.log('mousePressed.y ',gMeme.mousePressed.y )

    for (let i = 0; i < gMeme.lines.length; i++) {     
        const minx = gMeme.lines[i].minX;
        const maxx = gMeme.lines[i].maxX;
        const miny = gMeme.lines[i].minY;
        const maxy = gMeme.lines[i].maxY;
        const { offsetX, offsetY } = ev;
        if (((gMeme.mousePressed.x< maxx) && (minx < gMeme.mousePressed.x)) && ((gMeme.mousePressed.y < maxy) && (miny < gMeme.mousePressed.y))) {
            if(gMeme.lines[i].strokeColor!='blue'){
                gMeme.lines[i].strokeColor = 'blue'
            }else{
                gMeme.lines[i].strokeColor = 'white'
            }
            gMeme.selectedLineIdx = i;
            gMeme.lines[i].lineIdx += dx
            gMeme.lines[i].lineIdy += dy
            gMeme.lines[i].maxX += dx
            gMeme.lines[i].minX += dx
            gMeme.lines[i].maxY += dy
            gMeme.lines[i].minY += dy
            // console.log('dx in canvasclicked ',dx)
            // console.log('dy in canvasclicked ',dy)
  //          gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
            const img = gMeme.image;
            //gCtx.drawImage(img, 0, 0, 360, 360);
            renderMemn()
        }
    }


}

function doMousePressed(ev){
  //console.log(' mouse presed event : ',ev)
    const  mousePressed = {
        x : ev.layerX,
        y : ev.layerY
    }
    gMeme.mousePressed = mousePressed
    //gMeme.lines[i].strokeColor = 'blue'
}


function aPluse() {
  //gMeme.lines[gMeme.selectedLineIdx].fontSize++;
 // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
 // const img = gMeme.image;
 // gCtx.drawImage(img, 0, 0, 360, 360);
 // renderMemn()
 var fontSize = gMeme.lines[0].konvaObj.fontSize()
 fontSize +=2
 gMeme.lines[0].konvaObj.fontSize(fontSize)
 gMeme.lines[0].konvaObj.remove()
 layer.add( gMeme.lines[0].konvaObj)
}

function aMinus() {
  //gMeme.lines[gMeme.selectedLineIdx].fontSize--;
 // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
 // const img = gMeme.image;
 // gCtx.drawImage(img, 0, 0, 360, 360);
  //renderMemn()

  var fontSize = gMeme.lines[0].konvaObj.fontSize()
  fontSize -=2
  gMeme.lines[0].konvaObj.fontSize(fontSize)
  gMeme.lines[0].konvaObj.remove()
  layer.add( gMeme.lines[0].konvaObj)
}
function alignToLeft() {
  gMeme.lines[gMeme.selectedLineIdx].textAlign = 'right'
 // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
 // gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn()
}
function alignCenter() {
  gMeme.lines[gMeme.selectedLineIdx].textAlign = 'center'
  //gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
 // gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn()
}
function alignToRigth() {
  gMeme.lines[gMeme.selectedLineIdx].textAlign = 'left'
 // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  const img = gMeme.image;
  //gCtx.drawImage(img, 0, 0, 360, 360);
  renderMemn()
}

function strokeColor(ev) {
  ev.preventDefault();
  const elTxtCol = document.querySelector(".txtcol");
  const txtColor = elTxtCol.value;
  //gMeme.strokeColor = txtColor;
  console.log('txtColor',txtColor)
  renderMemn()
}
function fontColor() {
  gMeme.lines[gMeme.numOfTexts].fontColor = 'null'
  renderMemn()
}


function upDown(){
  if(!gToPress){
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = 'white'
 //   gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    const img = gMeme.image;
   // gCtx.drawImage(img, 0, 0, 360, 360);
    renderMemn();
  }
  gToPress= !gToPress;
   
}

function up(){
  if (gToPress) {
    gMeme.lines[gMeme.selectedLineIdx].lineIdx -=60;
  //  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    const img = gMeme.image;
   // gCtx.drawImage(img, 0, 0, 360, 360);
    renderMemn();
  }
}

function Down(){
  if (gToPress) {
    gMeme.lines[gMeme.selectedLineIdx].lineIdx +=60;
  //  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    const img = gMeme.image;
   // gCtx.drawImage(img, 0, 0, 360, 360);
    renderMemn();
  }
}


function strokeColor(){
  const elCol = document.querySelector(".txtcol");
  let stColor = elCol.value  
  console.log('stColor',stColor)    
  //gMeme.lines[gMeme.selectedLineIdx].strokeColor=stColor;
//  gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
 // const img = gMeme.image;
//  gCtx.drawImage(img, 0, 0, 360, 360);
//  renderMemn();
}

function fontColor(){
  const elCol = document.querySelector(".font-col");
  let stColor = elCol.value      
  console.log('stColor',stColor)
  //gMeme.lines[gMeme.selectedLineIdx].fontColor=stColor;
  //gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
  //const img = gMeme.image;
 // gCtx.drawImage(img, 0, 0, 360, 360);
  //renderMemn();
}

function save(){
  const val = localStorage.getItem('memObject')
  if (!val){ 
    const memArr=[];
    const image = gElCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const newMeme = {
      id : makeId(),
      img : image
    }
    memArr.push(newMeme)
    saveToStorage('memObject',memArr)
    closeModal()
    loadImages()
    //console.log('save mems to storage;')

  }else{  
    const memObj= JSON.parse(val)
    const image = gElCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const newMeme = {
      id : makeId(),
      img : image
    }
    memObj.push(newMeme)
    saveToStorage('memObject',memObj)
    closeModal()
    loadImages()
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
  var i = 1;
  if(memObj){
    const strHtmls = memObj.map( (meme)=> {
    return `
    <img class="saved-mems-img saved-image${i++}" src="${meme.img}"  alt="">`
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
     // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
      var img = gMeme.image;
   //   gCtx.drawImage(img, 0, 0, 360, 360);
      renderMemn();
      break;
      case 2:    
      console.log('fontchoosed',fontchoosed)
      gMeme.lines[gMeme.selectedLineIdx].font='lato';        
        elTextMem.style.fontFamily='latoRegular';
     //   gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        img = gMeme.image;
    //    gCtx.drawImage(img, 0, 0, 360, 360);
        renderMemn();
        break;
        case 3:
      console.log('fontchoosed',fontchoosed)
      gMeme.lines[gMeme.selectedLineIdx].font='euro'
      elTextMem.style.fontFamily='euro'
     // gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
      img = gMeme.image;
     // gCtx.drawImage(img, 0, 0, 360, 360);
      renderMemn();
      break;
      default: 
      gMeme.lines[gMeme.selectedLineIdx].font='euro';
      elTextMem.style.fontFamily='euro'
     //   gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
      img = gMeme.image;
     //   gCtx.drawImage(img, 0, 0, 360, 360);
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

function addToDB(memeImg){
  // gImages.push(memeImg)
  var newMeme = {
    img : memeImg,
    id : makeId()
  }
  gImages.push(newMeme)
}

function openAbout(){
  const elModal = document.querySelector('.about-modal');
  elModal.style.display = 'block';
}
function closeAboutModal(){
  const elModal = document.querySelector('.about-modal');
  elModal.style.display = 'none';
}

function deleteMeme(element){
 // console.log('elementtttttttttttttt',element.dataset.id)
  let idxToRemove = gMemes.findIndex((meme)=>{
      return (meme.id == element.dataset.id)
  })

  gMemes.splice(idxToRemove,1)
 // console.log('gMemes after splice' ,gMemes)
  saveToStorage('memObject',gMemes)
  idxToRemove = gImages.findIndex((meme)=>{
    return (meme.id == element.dataset.id)
  })
  //console.log('idxToRemove in gImages ',idxToRemove)
  gImages.splice(idxToRemove,1)

 // console.log('gImages',gImages)
  closeModal()
  loadImages()
}

