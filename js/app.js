document.addEventListener('DOMContentLoaded', init);


const eles = {};

var myWords = ['cat','dog']
// const myWords = ['cat','dog','mouse','bird','horse','donkey','frog','snake','rabbit'];
const game = {r:5,c:5,w:100,x:'',y:'',arr:[], placedWords:[], boardArray:[]};
const userInput = document.getElementsByClassName('input1');
let startTime, endTime;

function init()
{
    eles.gameArea = document.querySelector('.gameArea');
    eles.gridContainer = document.createElement('div');

    eles.gridContainer.style.margin='auto'
    eles.message = document.createElement('div');
    
    // user data creation
    eles.userBtn = document.createElement('button');
    eles.userInput = document.createElement('input');
    eles.userArea = document.createElement('div');

    // User Words Store Here
    eles.userWordsArea = document.createElement('div');
    

    eles.gridContainer.classList.add('gridContainer');
    eles.myList = document.createElement('div');
    eles.btn = document.createElement('button');
    eles.gridSize = document.createElement('input');
    eles.myList.classList.add('myList');
 // eles.gameArea.textContent = "Game Ready";
    eles.gameArea.append(eles.message);

    // user Data Append;
    eles.gameArea.append(eles.userArea)
    eles.userArea.append(eles.userInput);
    eles.userArea.append(eles.userBtn);  
    eles.gameArea.append(eles.userWordsArea)
    eles.input = document.querySelector("input");


    eles.gameArea.append(eles.gridSize);
    eles.gameArea.append(eles.btn);
    eles.gameArea.append(eles.gridContainer);
    eles.gameArea.append(eles.myList);

    // user input setAttribute
    eles.userInput.setAttribute('class','col-sm-6 form-control m-2')
    eles.userInput.setAttribute('type','text');
    eles.userInput.setAttribute('value','')
    eles.userArea.setAttribute('class','row justify-content-center bg-dark p-2')
    eles.userWordsArea.setAttribute('id','userWordsArea');
    // user button
    eles.userBtn.textContent = 'Add Word';
    eles.userBtn.setAttribute('class','btn btn-danger m-2');
    eles.userBtn.setAttribute('onclick','newElement()');
    
    
    eles.gridSize.setAttribute('class','d-inline mr-2 form-control')
    eles.gridSize.setAttribute('type','number');
    eles.gridSize.setAttribute('max','20')
    eles.gridSize.setAttribute('min','2')
    log('Click Start to Start the Game. Select the number of the grid');

    
    
    eles.btn.textContent = 'Click to Start';
    eles.gridSize.value = 5;
    eles.btn.addEventListener('click',startGame);
    //console.log(eles)
}


function newElement() {
    var inputValue = document.querySelector("input").value;
    var div = document.getElementById("userWordsArea")
    console.log(div)
    myWords.push(inputValue.toLowerCase())
    div.innerHTML=`<h4 class="mt-2">Are you Ready to Help me to Find these Words</h4> <hr> <h3 class="mb-3">${myWords}</h3>`
    document.querySelector("input").value ='';
    console.log(myWords)

  }


function startGame()
{
    log("Select the Grid Letters");
    let date = new Date();
    startTime = date.getTime()
    console.log(startTime)
    
    eles.gridSize.setAttribute('class','')
    eles.gridContainer.style.display=''
    eles.myList.style.display=''
    eles.userArea.style.display='none';
    eles.userWordsArea.style.display='none'

    eles.gridSize.style.display='none';
    eles.btn.style.display='none';
    game.r = Number(eles.gridSize.value); //rows
    game.c = Number(eles.gridSize.value); //cols
    eles.gridContainer.style.width= (game.c * game.w +50+'px');
    game.x ='';
    game.y ='';
    game.boardArray.length=0;
    game.arr.length = 0;
    game.arr.length = game.r * game.c;
    game.placedWords.length = 0;

    for(let i=0; i<game.arr.length;i++){
        game.arr[i]='-';
    }
    for(let xx=0;xx<game.r;xx++) { game.x += ' auto '}
    for(let yy=0;yy<game.r;yy++) { game.y += ' auto '}
    //console.log(game);
    eles.gridContainer.style.gridTemplateColumns = game.x;
    eles.gridContainer.style.gridTemplateRows = game.y;

    myWords.forEach((val,index)=>{
        let temp = placeWord(val);
        if(temp){
            game.placedWords.push({
                word:val,pos:temp
            });
        }
       
    })
    // console.log(game);
    addLetters();
    builBoard();
    eles.myList.innerHTML='';
    game.placedWords.forEach((w)=>{
        w.ele = document.createElement('div');
        w.ele.textContent = w.word;
        w.ele.arr = w.pos;
        eles.myList.append(w.ele);
    })
    // console.log(game)
}


function addLetters(){
    for(let i=0;i<game.arr.length;i++){
        if(game.arr[i]=='-'){
            game.arr[i]=randomLetter();
        }
    }
}

function randomLetter(){
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.toLowerCase().split('')[Math.floor(Math.random()*26)];
}

function placeWord(word){
    //console.log(word)
    let placedOkay = false;
    let cnt = 300;
    word = (Math.random() > 0.5) ? word : word.split('');
    //console.log(word)
    while(!placedOkay && cnt > 0) {
        cnt--;
        let pos = {col:0,row:0}
        let dir = (Math.random() > 0.5) ? true : false;
        if (dir && word.length<= game.c){
            pos.col = findStartPos(word.length,game.c);
            pos.row = Math.floor(Math.random() * game.r);
            placedOkay = xPlace(pos,word);
        } else if(!dir && word.length<= game.c){
            pos.row = findStartPos(word.length,game.r);
            pos.col = Math.floor(Math.random() * game.c);
            placedOkay = yPlace(pos,word);
        }
    }
    return placedOkay;
}

function yPlace(cor,word){
    let start = (cor.row * game.c) + cor.col;
    let okayCounter = 0;
    let indexPlaced = [];
    for(let i=0;i<word.length;i++){
        if(game.arr[start+(i*game.c)]=='-'){
            okayCounter++;
        }
    }
    if(okayCounter == word.length){
        for(let i=0;i<word.length;i++){
            if(game.arr[start+(i*game.c)]=='-'){
                game.arr[start+(i*game.c)] = word[i];
                indexPlaced.push(start+(i*game.c));
            }
        }
        return indexPlaced;
    }
    return false
}

function xPlace(cor,word){
    let start = (cor.row * game.c) + cor.col;
    let okayCounter = 0;
    let indexPlaced = [];
    for(let i=0;i<word.length;i++){
        if(game.arr[start+i]=='-'){
            okayCounter++;
        }
    }
    if(okayCounter == word.length){
        for(let i=0;i<word.length;i++){
            if(game.arr[start+i]=='-'){
                game.arr[start+i]=word[i];
                indexPlaced.push(start+i);
            }
        }
        return indexPlaced;
    }
    return false
}

function  findStartPos(wordVal,totalVal){
    return Math.floor(Math.random()*(totalVal - wordVal + 1));
}

function builBoard(){
    eles.gridContainer.innerHTML ='';
    game.arr.forEach((ele,index)=>{
        let div = document.createElement('div');
        div.textContent= ele;
        div.classList.add('grid-item')
        eles.gridContainer.append(div);
        div.addEventListener('click',(e)=>{
            // console.log(index);
            // console.log(game.arr[index])
            game.boardArray[index]=true;
            let checker = {found:0,word:''};
            game.placedWords.forEach((w)=>{
                if(w.pos.includes(index)){
                    checker.found++;
                    checker.word = w.word;
                }
            })
            if(checker.found>0){
                div.style.backgroundColor='#73a767';
            } else{
                div.style.backgroundColor='#ee1234';
            }
            foundChecker();
        })
    })
}

function foundChecker(){
    game.placedWords.forEach((w,ind)=>{
        // console.log(w.pos);
        let checker=0;
        game.boardArray.forEach((val,index)=>{
            // console.log(val);
            if(w.pos.includes(index)){
                checker++;
            }
        })
        if(checker == w.word.length){
            w.ele.style.color='red';
            w.ele.style.textDecoration='line-through';
        }

    })
    checkWinner();
}
function log(mes){
    eles.message.innerHTML=`<h3 class="bg-warning py-3 mb-2">${mes}</h3>`;
}
function checkWinner(){
    let counter = 0;
    game.placedWords.forEach((w,ind)=>{
        if(w.ele.style.textDecoration=='line-through'){
            counter++;
        }
    })
    log(game.placedWords.length -counter + ' Word left ')
    if((game.placedWords.length -counter)==0 || game.placedWords==0 ){
        let date = new Date();
        endTime = date.getTime()
        let totalTime = ((endTime-startTime)/1000)
        console.log(totalTime)
        log(`<hr>🏆🥇 ✔✔ You Won in ${totalTime.toFixed(0)} sec ✔✔ 🥇🏆<hr>Click button to start again`);
        
        eles.gridSize.setAttribute('class','mb-2 mr-2');
        eles.gridSize.style.display='inline-block';
        eles.btn.style.display='inline-block';
        eles.userArea.style.display="";
        eles.userWordsArea.style.display='block'
        eles.gridContainer.style.display='none'
        eles.myList.style.display='none'
        myWords=['cat','dog'];
        var div = document.getElementById("userWordsArea")
        div.innerHTML=`<h4 class="mt-2">Are you Ready to Help me to Find these Words</h4> <hr> <h3 class="mb-3">${myWords}</h3>`
    }
}