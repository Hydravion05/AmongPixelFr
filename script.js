const colorsChoice = document.querySelector('#colorsChoice');
const game = document.querySelector('#game');
const cursor = document.querySelector('#cursor');
game.width = 1600;
game.height = 650;
const gridCellSize = 5;
const scrollbar = document.body.style.overflow = 'hidden'

const ctx = game.getContext('2d');
const gridCtx = game.getContext('2d');

const colorList = [
    "#FF4500", "#FFA800", "#FFD635", "#00A368", "#BE0039", "#FF3881", "#6D001A", "#FFF8B8", 
    "#7EED56", "#2450A4", "#3690EA", "#51E9F4", "#00756F", "#009EAA", "#00CCC0", "#94B3FF",
    "#811E9F", "#B44AC0", "#FF99AA", "#9C6926", "#493AC1", "#6A5CFF", "#E4ABFF", "#DE107F",
    "#FFFFFF", "#D4D7D9", "#898D90", "#000000", "#00CC78", "#6D482F", "#FFB470", "#515252",
]
let currentColorChoice = colorList[9]

const firebaseConfig = {
    apiKey: "AIzaSyAWSpzuJz6BSZvXsdZ6tWQjPHpjujlYt7k",
    authDomain: "amongpixelfr.firebaseapp.com",
    projectId: "amongpixelfr",
    storageBucket: "amongpixelfr.appspot.com",
    messagingSenderId: "255842010841",
    appId: "1:255842010841:web:61986164262f549ce360c8",
    measurementId: "G-K6686K3LQ5"
  };
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

colorList.forEach(color => {
    const colorItem = document.createElement('div')
    colorItem.style.backgroundColor = color
    colorsChoice.appendChild(colorItem)

    colorItem.addEventListener('click', () => {
        currentColorChoice = color

        colorItem.innerHTML = '<i class="fa-solid fa-check"></i>'

        setTimeout(() => {
            colorItem.innerHTML = ""
        }, 1000)
    })
})

function createPixel(x, y, color){
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(x, y, gridCellSize, gridCellSize)
}

function addPixelIntoGame(){
    const x = cursor.offsetLeft - game.offsetLeft
    const y = cursor.offsetTop - game.offsetTop
    
    createPixel(x, y, currentColorChoice)

    const pixel = {
        x,
        y,
        color: currentColorChoice
    }

    const pixelRef = db.collection('pixel').doc(`${pixel.x}-${pixel.y}`)
    pixelRef.set(pixel, { merge: true })
}

cursor.addEventListener('click', function (event) {
    addPixelIntoGame()
})
game.addEventListener('click', function(){
    addPixelIntoGame()
})


function drawGrids(ctx, width, height, cellWidth, cellHeight){
    ctx.beginPath()
    ctx.strokeStyle = "transparent"

    for(let i = 0; i < width; i++){
        ctx.moveTo(i * cellWidth, 0)
        ctx.lineTo(i * cellWidth, height)
    }

    for(let i = 0; i < height; i++){
        ctx.moveTo(0, i * cellHeight)
        ctx.lineTo(width, i * cellHeight)
    }
    ctx.stroke()
}
drawGrids(gridCtx, game.width, game.height, gridCellSize, gridCellSize)

game.addEventListener('mousemove', function(event){
    const cursorLeft = event.clientX - (cursor.offsetWidth / 2)
    const cursorTop = event.clientY - (cursor.offsetHeight / 2)

    cursor.style.left = Math.floor(cursorLeft / gridCellSize) * gridCellSize + "px"
    cursor.style.top = Math.floor(cursorTop / gridCellSize) * gridCellSize + "px"

})

db.collection('pixel').onSnapshot(function(querySnapshot){
    querySnapshot.docChanges().forEach(function(change){
        const { x, y, color } = change.doc.data()

        createPixel(x, y, color)
    })
})