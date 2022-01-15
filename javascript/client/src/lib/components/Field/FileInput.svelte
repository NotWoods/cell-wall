<label
	class="file-label relative w-full shadow-sm rounded-md flex-1 bg-white border border-gray-300"
>
	<input
		{...$$restProps}
		class="file-input absolute inset-0 rounded-md w-full cursor-pointer"
		type="file"
		on:change
	/>
	<div class="relative flex pointer-events-none cursor-pointer">
		<span
			class="inline-flex items-center px-3 rounded-l-md border-r border-gray-300 bg-gray-50 text-gray-500 text-sm "
			aria-hidden="true"
		>
			<svg class="fill-current mr-1" width="24" height="24" viewBox="4 3 18 17">
				<path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
			</svg>
			Choose a file…
		</span>
		<span
			class="flex-1 block bg-white w-full rounded-none rounded-r-md sm:text-sm border-gray-300 px-3 py-2"
			aria-hidden="true"
		>
			<slot />
		</span>
	</div>
</label>
