/**
 * Reset the given node by removing all children.
 * Equivalent to `node.innerHTML = ""`, but faster.
 */
export function clear(node: Node) {
    while (node.firstChild) node.removeChild(node.firstChild);
}

/**
 * Append the given children to the parent node using a document fragment.
 */
export function appendChildren(node: Node, children: Iterable<Node>) {
    const fragment = document.createDocumentFragment();
    for (const child of children) {
        fragment.appendChild(child);
    }
    node.appendChild(fragment);
}
