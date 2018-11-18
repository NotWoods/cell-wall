const list = document.getElementById("action-list");
/** @type {HTMLTemplateElement} */
const itemTemplate = document.getElementById("action-list-item");

function renderItem(action) {
  const result = document.importNode(itemTemplate.content, true);
  const button = result.querySelector("button");
  button.textContent = action.name;
  button.formAction = `/wall/action/${action.id}`;
  return result;
}

async function displayActions() {
  while (list.firstChild) list.removeChild(list.firstChild);

  const res = await fetch("/wall/actions");
  /** @type {Array<{ id: string, name: string }>} */
  const actions = await res.json();

  const fragment = document.createDocumentFragment();
  actions.map(renderItem).forEach(child => fragment.appendChild(child));
  list.appendChild(fragment);
}
displayActions();
