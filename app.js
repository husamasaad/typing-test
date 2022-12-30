const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const startTest = document.querySelector('.start-test');
const startBtn = document.getElementById('start');
const msg = document.getElementById('message');


let result = 0;



startBtn.addEventListener('click', () => {
  startTest.classList.add('started')
  renderNewQuote();
  startTimer();
  quoteInputElement.focus();
})

quoteInputElement.addEventListener("input", () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');
  let correct = true;
  arrayQuote.forEach((charSpan, index) => {
    const char = arrayValue[index];
    if (char == null) {
      charSpan.classList.remove('correct');
      charSpan.classList.remove('incorrect');
      correct = false;
    }
    else if (char === charSpan.innerText) {
      charSpan.classList.add('correct');
      charSpan.classList.remove('incorrect');
    } else {
      charSpan.classList.remove('correct');
      charSpan.classList.add('incorrect');
      correct = false;
    }
  })

  if (correct) {
    renderNewQuote();
    updateResult();
  }
})

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach(char => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = char.toLowerCase();
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
}

let startTime;

function startTimer() {
  timerElement.innerText = 60;
  startTime = new Date();
  const timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
    if (parseInt(getTimerTime()) <= 0) {
      clearInterval(timerInterval);
      updateResult();
      endGame((result / 5));
    }
  }, 1000);
}

function getTimerTime() {
  return 60 - Math.floor((new Date()  - startTime) / 1000)
}

function updateResult() {
  const Correctwords = quoteDisplayElement.querySelectorAll('.correct');
  result += Correctwords.length;
}

function endGame(avg) {
  quoteInputElement.disabled = true;
  msg.innerText = `You scored ${Math.ceil(avg)} WPM`;
  startBtn.innerText = 'click to test again';
  startTest.classList.remove('started')
}
