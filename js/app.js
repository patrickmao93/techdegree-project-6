const phrases = [
    {phrase: 'what is on your mind', winSubtitle: "What's on your mind was what's on your mind!", loseSubtitle: "What's on your mind was not what's on your mind :("}, 
    {phrase: 'you are a murloc', winSubtitle: "\"MmmRRRRRRGGL\"", loseTitle: "\"MmmRRRRRRGGL?\""}, 
    {phrase: 'javascript for the win', winSubtitle: "ES6 makes it better", loseTitle: "...or this game wouldn't exist"}, 
    {phrase: 'php is the best', winSubtitle: "...language to not use", loseSubtitle: "...language to not use"}, 
    {phrase: 'magikarp used splash', winSubtitle: "\"It was super effective!\"", loseTitle: "\"But nothing happened\""}
];

let misses = 0;
let currentPhrase = '';

function getRandomPhraseAsArray(phrases) {
    currentPhrase = Math.floor(Math.random() * 5);
    const phrase = phrases[currentPhrase];
    return phrase.phrase.split('');
}

//given letter array (i.e. ['p', 'h', 'r', 'a', 's', 'e']), display it to '#phrase ul' as li elements
function addPhraseToDisplay(letterArr) {
    const ul = document.querySelector('#phrase ul');
    for (let i = 0; i < letterArr.length; i++) {
        let li = document.createElement('li');
        li.textContent = letterArr[i];
        if (li.textContent === ' ') {
            li.className = 'space';
        } else {
            li.className = 'letter';
        }
        ul.append(li);
    }
}

function displayEndOverlay(winStatus) {
    if (!winStatus) {
        console.error("parameter 'winStatus' required");
        return;
    }

    const ul = document.querySelector('#phrase ul');
    const overlay = document.querySelector('#overlay');
    const header = document.querySelector('h2.title');
    const subtitle = document.querySelector('h2.subtitle');
    const button = document.querySelector('.btn__reset');
    let subtitleContent = '';

    subtitle.style.display = 'block';

    if (winStatus === 'win') {
        header.textContent = 'You win!';
        subtitle.textContent = phrases[currentPhrase].winSubtitle;
    } else if (winStatus === 'lose') {
        header.textContent = 'Try another game...?'
        subtitle.textContent = phrases[currentPhrase].loseSubtitle;
    }

    overlay.style.bottom = 0;
    const lis = ul.children;
    for (let li of lis) {
        if (!li.classList.contains('show')) {
            li.classList.add('show_wrong');
        }
    }
    overlay.insertBefore(ul, subtitle);
}

function hpMinusOne() {
    misses++;
    //selects the last heart img
    const imgsToChange = document.querySelectorAll('img[src$="liveHeart.png"]');
    const imgToChange = imgsToChange[imgsToChange.length - 1];
    //replace url with greyed out heart
    const url = "images/lostHeart.png";
    imgToChange.setAttribute('src', url);
}

//checks if the letter string passed in matches any letter displayed. returns the letter if found; 
//returns null if no match found
function checkLetter(letter) {
    let found = false;
    const letters = document.querySelectorAll('.letter');
    for (let i = 0; i < letters.length; i++) {
        if (letters[i].textContent === letter) {
            letters[i].classList.add('show');
            found = true;
        }
    }
    if (found) {
        return letter;
    } else {
        hpMinusOne();
        return null;
    }
}

//checks if the player has won or lost. display overlay accordingly
function checkWin(misses) {
    const overlay = document.querySelector('#overlay');
    const title = document.querySelector('h2.title');
    const numCorrects = document.querySelectorAll('.show').length;
    const numLetters = document.querySelectorAll('.letter').length;
    if (misses >= 5) { //lose
        displayEndOverlay('lose')
    } else if (numCorrects === numLetters) { //win
        displayEndOverlay('win');
    }
}


//add click event listener to start button
const resetBtn = document.querySelector('.btn__reset');
const overlay = document.querySelector('#overlay');
resetBtn.addEventListener('click', e => {
    //generate phrase
    const phrase = getRandomPhraseAsArray(phrases);
    addPhraseToDisplay(phrase);
    //remove overlay
    overlay.style.bottom = '100vh';
});

//add click event listener to keyboard
const keyboard = document.querySelector('#qwerty');
keyboard.addEventListener('click', e => {
    let letter = e.target.textContent;
    const match = checkLetter(letter);
    if (match) {
        //if found a match, add class .chosen
        e.target.classList.add('chosen');
    } else {
        //else, disabe the button
        e.target.disabled = true;
    }

    //check win status
    checkWin(misses);
});


