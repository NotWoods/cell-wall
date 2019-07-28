const list = document.getElementById('action-list') as HTMLUListElement;
const itemTemplate = document.getElementById(
    'action-list-item',
) as HTMLTemplateElement;

interface Action {
    id: string;
    name: string;
}

function renderItem(action: Action) {
    const result = document.importNode(itemTemplate.content, true);
    const button = result.querySelector('button')!;
    button.textContent = action.name;
    button.formAction = `/wall/action/${action.id}`;
    return result;
}

async function displayActions() {
    while (list.firstChild) list.removeChild(list.firstChild);

    const res = await fetch('/wall/actions');
    const actions: Action[] = await res.json();

    list.append(...actions.map(renderItem));
}

displayActions();
