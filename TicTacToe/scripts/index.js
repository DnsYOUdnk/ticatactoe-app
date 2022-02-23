const areaGame = document.querySelector('#game__area');
const areaCells = document.querySelectorAll('.area__cell');
const restartBtn = document.querySelector('.pop_up__close__btn');
const popUpContent = document.querySelector('.pop_up__content');
const windowPopUp = document.querySelector('#pop__up');
const winConfetti = document.querySelector('.confetti');
const getStaticBtn = document.querySelector('.header__table-btn');
const getSettingBtn = document.querySelector('.header__setting-btn');

let editMove = 0;
let winner = '';
let staticArr = [];

let audio = new Audio();
let audioMusic = new Audio();

let playNowAudio = function(trackAudio) {
    audio.src = `./assets/audio/${trackAudio}.mp3`;
    audio.currentTime = 0;
    audio.play();
}

let playAudioMusic = function(trackAudio) {
    audioMusic.src = `./assets/audio/${trackAudio}.mp3`;
    audioMusic.currentTime = 0;
    audioMusic.play();
}

areaGame.addEventListener('mousedown', (event) => {
    if(event.target.className == 'area__cell' && event.target.innerText) {
        editMove%2 == 0 ? event.target.innerText = 'X' : event.target.innerText = '0';
        event.target.classList.add('lock');
        event.target.removeAttribute("style"); 
        editMove++;
    }
    playNowAudio('addX0');
    victoryCheck();
})

areaGame.addEventListener('mouseover', (event) => {
    if(event.target.className == 'area__cell' && !event.target.innerText) {
        editMove%2 == 0 ? event.target.innerText = 'X' : event.target.innerText = '0';
        event.target.style.color = 'rgba(0, 0, 0, 0.37)'; 
    }
})

areaGame.addEventListener('mouseout', (event) => {
    if(event.target.className == 'area__cell' && event.target.innerText) {
        editMove%2 == 0 ? event.target.innerText = '' : event.target.innerText = ''; 
        event.target.removeAttribute("style"); 
    }
})

const victoryCheck = function() {
    const arrResult = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    arrResult.forEach(item => {
        if(areaCells[item[0]].innerText == 'X' && areaCells[item[1]].innerText == 'X' && areaCells[item[2]].innerText == 'X') {
            winner = 'Игрок X';
            staticArr.push(winner)
            getResult(winner, item)
        } else if(areaCells[item[0]].innerText == '0' && areaCells[item[1]].innerText == '0' && areaCells[item[2]].innerText == '0') {
            winner = 'Игрок 0';
            staticArr.push(winner)
            getResult(winner, item)
        }
    })

    if(!winner && editMove == 9) {
        winner = 'случай под названием "ничья"';
        staticArr.push(0)
        getResult(winner,[0,1,2,3,4,5,6,7,8])
    }
}

const getResult = function(winner, arr) {
    arr.forEach((item) => {
        if(arr.length > 3) {
            areaCells[item].style.background = '#0e56a8c7';
            areaCells[item].classList.add('active');
            playNowAudio('gameover');
        } else {
            areaCells[item].classList.add('active');
            playNowAudio('congratulation');
        }
    })
    windowPopUp.classList.add('active__on__pop');
    winConfetti.classList.add('active');
    
    popUpContent.innerHTML = `<h3>В этой игре победил:</h3>
                                    <p>${winner}</p>
                            <p>Количество ходов в игре: ${editMove} </p>`;
    localStorage.setItem('resultStatic', JSON.stringify(staticArr));
    recNewData(staticArr);
    audioMusic.pause();
}

const recNewData = function(dataArr) {
    if(staticArr.length > 10) staticArr.shift();
    const staticList = document.querySelector('.menu__table__content');
    let list = '';
    
    for(let i=dataArr.length-1; i >= 0; i--) {
        list += `
                <div class="table__content__list">
                    <div class="list__item">${i+1}</div>
                    <div class="list__item">${dataArr[i] ? dataArr[i] : 'Результат игры'}</div>
                    <div class="list__item">${dataArr[i] ? 'Победитель' : 'Ничья'}</div>
                </div>
            `
    }
    staticList.innerHTML = list;
}


restartBtn.addEventListener('click', () => {
    windowPopUp.classList.remove('active__on__pop');
    winConfetti.classList.remove('active');
    editMove = 0;
    winner = '';
    areaCells.forEach(item => {
        item.innerText = '';
        item.classList.remove('lock'); 
        item.classList.remove('active'); 
        item.removeAttribute("style"); 
    })
    playNowAudio('addButton');
    playAudioMusic('audioTrack');
})

getStaticBtn.addEventListener('click', () => {
    windowPopUp.classList.add('active__on__table');
    playNowAudio('addButton');
})

getSettingBtn.addEventListener('click', () => {
    windowPopUp.classList.add('active__on__setting');
    playNowAudio('addButton');
})

windowPopUp.addEventListener('click', (event) => {
    if(event.target.id == 'menu__table__close' || event.target.id == 'popUp_wrap' || event.target.id == 'menu__setting__close') {
        windowPopUp.classList.remove('active__on__table','active__on__setting');
        playNowAudio('addButton');
    }
})

window.addEventListener('load', () => {
    if(!localStorage.getItem('resultStatic')) return
    staticArr = JSON.parse(localStorage.getItem('resultStatic'));
    recNewData(staticArr);
})
