
import { load, clear } from './storage';
import { empty, el } from './helpers';

/**
 * Reikna út stig fyrir svör út frá heildarfjölda svarað á tíma.
 * Ekki þarf að gera ráð fyrir hversu lengi seinasta spurning var sýnd. Þ.e.a.s.
 * stig verða alltaf reiknuð fyrir n-1 af n spurningum.
 *
 * @param {number} total Heildarfjöldi spurninga
 * @param {number} correct Fjöldi svarað rétt
 * @param {number} time Tími sem spurningum var svarað á í sekúndum
 *
 * @returns {number} Stig fyrir svör
 */
export function score(total, correct, time) {
  let points = (((correct / total) ** 2) + correct) * (total / time);
  points = Math.round(points) * 100;

  if (!points) points = 0;

  return points;
}

/**
 * Útbúa stigatöflu, sækir gögn í gegnum storage.js
 */
export default class Highscore {
  constructor() {
    this.scores = document.querySelector('.highscore__scores');
    this.button = document.querySelector('.highscore__button');

    this.button.addEventListener('click', this.clear.bind(this));
  }

  /**
   * Hlaða stigatöflu inn
   */
  load() {
    const data = load();
    if (data) this.highscore(data);
  }

  /**
   * Hreinsa allar færslur úr stigatöflu, tengt við takka .highscore__button
   */
  clear() {
    empty(this.scores);
    clear();
    this.scores.appendChild(el('p', 'Engin stig skráð'));
    this.button.classList.add('highscore__button--hidden');
  }

  /**
   * Hlaða inn stigatöflu fyrir gefin gögn.
   *
   * @param {array} data Fylki af færslum í stigatöflu
   */
  highscore(data) {
    const table = data;
    const list = [];

    table.sort((a, b) => b.points - a.points);

    table.forEach((item) => {
      const li = el('li');
      const points = el('div', `${item.points} stig`);
      const name = el('span', item.name);

      points.classList.add('highscore__number');
      name.classList.add('highscore__name');

      li.appendChild(points);
      li.appendChild(name);
      list.push(li);
    });

    empty(this.scores);

    this.scores.appendChild(el('ol', ...list));
    this.button.classList.remove('highscore__button--hidden');
  }
}
