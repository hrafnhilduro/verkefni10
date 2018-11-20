import { empty, el } from './helpers';
import { save } from './storage';
import question from './question';
import Highscore, { score } from './highscore';


// allar breytur hér eru aðeins sýnilegar innan þessa módúl

let startButton; // takki sem byrjar leik
let problem; // element sem heldur utan um verkefni, sjá index.html
let result; // element sem heldur utan um niðurstöðu, sjá index.html

let playTime; // hversu lengi á að spila? Sent inn gegnum init()
let total = 0; // fjöldi spurninga í núverandi leik
let correct = 0; // fjöldi réttra svara í núverandi leik
let currentProblem; // spurning sem er verið að sýna

/**
 * Klárar leik. Birtir result og felur problem. Reiknar stig og birtir í result.
 */
function finish() {
  problem.classList.add('problem--hidden');
  result.classList.remove('result--hidden');

  const rs = result.querySelector('.result__text');

  points = score(total, correct, playTime);

  const text = `Þú svaraðir ${correct} rétt af ${total} spurningum og fékkst ${points} stig fyrir. Skráðu þig á stigatöfluna!`;

  empty(rs);
  rs.appendChild(el('p', text));

}

/**
 * Keyrir áfram leikinn. Telur niður eftir því hve langur leikur er og þegar
 * tími er búinn kallar í finish().
 *
 * Í staðinn fyrir að nota setInterval köllum við í setTimeout á sekúndu fresti.
 * Þurfum þá ekki að halda utan um id á intervali og skilum falli sem lokar
 * yfir fjölda sekúnda sem eftir er.
 *
 * @param {number} current Sekúndur eftir
 */
function tick(current) {
  // todo uppfæra tíma á síðu

  if (current <= 0) {
    return finish();
  }

  const time = problem.querySelector('.problem__timer');
  empty(time);
  time.appendChild(el('p', `${current}`));

  return () => {
    setTimeout(tick(current - 1), 1000);
  };
}

/**
 * Býr til nýja spurningu og sýnir undir .problem__question
 */
function showQuestion() {
  currentProblem = question();

  const formula = problem.querySelector('.problem__question');

  empty(formula);
  formula.appendChild(el('p', currentProblem.problem));
}

/**
 * Byrjar leik
 *
 * - Felur startButton og sýnir problem
 * - Núllstillir total og correct
 * - Kallar í fyrsta sinn í tick()
 * - Sýnir fyrstu spurningu
 */
function start() {
  startButton.classList.add('button--hidden');
  problem.classList.remove('problem--hidden');
  total = 0;
  correct = 0;
  problem.querySelector('input').value = '';

  setTimeout(tick(playTime), 1000);

  showQuestion();
}

/**
 * Event handler fyrir það þegar spurningu er svarað. Athugar hvort svar sé
 * rétt, hreinsar input og birtir nýja spurningu.
 *
 * @param {object} e Event þegar spurningu svarað
 */
function onSubmit(e) {
  e.preventDefault();

  const ans = problem.querySelector('input');

  if (parseInt(ans.value, 10) === currentProblem.answer) correct += 1;
  total += 1;
  ans.value = '';

  showQuestion();
}

/**
 * Event handler fyrir þegar stig eru skráð eftir leik.
 *
 * @param {*} e Event þegar stig eru skráð
 */
function onSubmitScore(e) {
  e.preventDefault();

  const { value } = result.querySelector('input');
  save(value, points);

  result.classList.add('result--hidden');
  startButton.classList.remove('button--hidden');

  const highscore = new Highscore();
  highscore.load();

}

/**
 * Finnur öll element DOM og setur upp event handlers.
 *
 * @param {number} _playTime Fjöldi sekúnda sem hver leikur er
 */
export default function init(_playTime) {
  playTime = _playTime;

  startButton = document.querySelector('.start');
  problem = document.querySelector('.problem');
  result = document.querySelector('.result');

  startButton.addEventListener('click', start);
  problem.addEventListener('submit', onSubmit);
  result.addEventListener('submit', onSubmitScore);
}
