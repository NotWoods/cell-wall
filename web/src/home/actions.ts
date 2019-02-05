import { appendChildren, clear } from '../dom';

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

export async function displayActions() {
    clear(list);

    const res = await fetch('/wall/actions');
    const actions: Action[] = await res.json();

    appendChildren(list, actions.map(renderItem));
}
