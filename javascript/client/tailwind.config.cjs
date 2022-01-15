/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
	content: ['./src/**/*.{html,svelte,ts}'],
	theme: { extend: {} },
	plugins: [require('@tailwindcss/forms')]
};

module.exports = config;
