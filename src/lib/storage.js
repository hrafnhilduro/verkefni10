/**
 * Sækir og vistar í localStorage
 */

// Fast sem skilgreinir heiti á lykli sem vistað er undir í localStorage
const LOCALSTORAGE_KEY = 'calc_game_scores';

/**
 * Sækir gögn úr localStorage. Skilað sem röðuðum lista á forminu:
 * { points: <stig>, name: <nafn> }
 *
 * @returns {array} Raðað fylki af svörum eða tóma fylkið ef ekkert vistað.
 */
export function load() {
  const savedData = localStorage.getItem(LOCALSTORAGE_KEY);

  return JSON.parse(savedData);
}

/**
 * Vista stig
 *
 * @param {string} name Nafn þess sem á að vista
 * @param {number} points Stig sem á að vista
 */
export function save(name, points) {
  const data = { points, name };
  let savedData = load();

  if (!savedData) savedData = [];

  savedData.push(data);
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(savedData));
}

/**
 * Hreinsa öll stig úr localStorage
 */
export function clear() {
  localStorage.removeItem(LOCALSTORAGE_KEY);
}
