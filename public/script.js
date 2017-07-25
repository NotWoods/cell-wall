async function triggerAction(e) {
	const button = e.target;
	console.log(`Clicked "${button.textContent.trim()}"`);

	button.classList.add('is-loading');
	try {
		await fetch(button.dataset.action);
	} catch (err) {
		throw err;
	} finally {
		button.classList.remove('is-loading');
	}
}

document.querySelectorAll('[data-action]')
	.forEach(node => node.addEventListener('click', triggerAction));
