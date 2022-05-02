function randomIndex(items) {
  return Math.floor(Math.random() * items.length);
}
function randomItem(items) {
  return items[randomIndex(items)];
}
export { randomIndex as a, randomItem as r };
