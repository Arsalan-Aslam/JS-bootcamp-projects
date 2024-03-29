// Get the DOM Elements

const word = document.getElementById('word');
const incorrectLetters = document.getElementById('incorrect-letters');
const popup = document.getElementById('popup-container');
const finalMessage = document.getElementById('final-message');
const playBtn = document.getElementById('play-btn');
const notification = document.getElementById('notification-container');

// Get DOM Elements for Hangman

const figureParts = document.querySelectorAll('.figure-part');

// This is the pool of words which will be used to select a random word
const words = ["pictured","moving","yard","for","trace","lovely","about","result","plenty","properly","attack","word","team","member","develop","wind","greater","movie","sand","daughter","write","related","fought","dull","brother","jack","appropriate","replace","serve","within","wind","production","base","snake","health","clock","cattle","desert","bear","helpful","vertical","progress"];


// Select the word at random from words array
let selectedWord = words[Math.floor(Math.random() * words.length)];

// Tracking arays for correct and incorrect guesses

const correctLettersArray = [];
const incorrectLettersArray = [];

// Function to display the selectedWord in the DOM

function displayWord() {
    // Display the selected word
    word.innerHTML = `
    ${selectedWord
        .split('')
        .map(letter => `
             <span class="letter">
                ${correctLettersArray.includes(letter) ? letter: ''}
            </span>
        `
        )
        .join('')
    }`

    // Replace new line character and form inner word
    const innerWord = word.innerText.replace(/\n/g,'')

    // Compare inner word to selected word, if it's the same then game over and user won
    if(innerWord === selectedWord) {
        finalMessage.innerText = 'Congratulations! You won!';
        popup.style.display = 'flex';
    }


};

// Function to show the notification
function showNotification () {
    // Add class show to the notification container
    notification.classList.add('show');
    // After 2 seconds, hide the notification
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}
// Function to update incorrect letters
function updateIncorrectLetters() {
    // Display the incorrect letters
    incorrectLetters.innerHTML = `
    ${incorrectLettersArray.length > 0 ? '<p>Incorrect letters</p>': ''}
    ${incorrectLettersArray.map(letter =>`<span>${letter}</span>`)}
    `;

    // Display the hangman part
    figureParts.forEach((part, index) => {
        // How many incorrect letters has the user guessed?
        const errors = incorrectLettersArray.length;
        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    // Check if user lost
    if (incorrectLettersArray.length === figureParts.length) {
        finalMessage.innerText = 'You lost!';
        popup.style.display = 'flex';
    }

}

// Event Handlers
// 1. Listen for keyboard key press
window.addEventListener('keydown', e => {
    // Check if key pressed is a letter, a = 65 & z = 90
    if(e.keyCode >=65 && e.keyCode <= 90) {
        const letter = e.key;
        // Check if the letter is in the selected word
        if(selectedWord.includes(letter)) {
            // Check if letter is already in correctLettersArray
            if(!correctLettersArray.includes(letter)){
                // Add letter into the correctLettersArray
                correctLettersArray.push(letter);
                // Run the displayWord function again to display new letter
                displayWord();
            } else {
                showNotification();
            }
        }else {
            // Check is letter is already in incorrectLettersArray
            if(!incorrectLettersArray.includes(letter)){
                // Add letter into the incorrectLettersArray
                incorrectLettersArray.push(letter);
                // Update the incorrect letters UI
                updateIncorrectLetters();
            }
        }
    }
})

// 2. Listen for click on Play Again
playBtn.addEventListener('click', () => {
    // Empty correctLettersArray & incorrectLettersArray
    correctLettersArray.splice(0);
    incorrectLettersArray.splice(0);
    // Select a new random word
    selectedWord = words[Math.floor(Math.random() * words.length)];
    // Clear incorrect letters display
    updateIncorrectLetters();
    // Hide the popup
    popup.style.display = 'none';
    // refresh display word
    displayWord();
})


// Execute displayWord on page load
displayWord();
