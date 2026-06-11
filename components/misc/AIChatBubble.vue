<template>
	<div :class="['group h-fit', optionalStyles]">
		<div
			class="markdown-content h-fit rounded-2xl p-3 text-sm text-gray-700 outline-none"
			v-html="renderMarkdown(props.message)"></div>
		<div class="invisible h-fit w-full group-hover:visible">
			<button class="inline-flex items-center justify-center rounded-full p-1">
				<span class="icon-[material-symbols-light--content-copy-outline] size-5"></span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface Props {
		message: string;
		optionalStyles?: string;
	}

	const props = defineProps<Props>();
</script>

<style scoped>
	/* Base Container */
	.markdown-content :deep(*) {
		box-sizing: border-box;
	}

	.markdown-content {
		color: #364153;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		line-height: 1.6;
	}

	/* Paragraphs */
	.markdown-content :deep(p) {
		margin-bottom: 1rem;
		line-height: 1.75;
		color: #364153;
	}

	.markdown-content :deep(p:last-child) {
		margin-bottom: 0;
	}

	/* Typography Scale */
	.markdown-content :deep(h1),
	.markdown-content :deep(h2),
	.markdown-content :deep(h3),
	.markdown-content :deep(h4),
	.markdown-content :deep(h5),
	.markdown-content :deep(h6) {
		color: #364153;
		font-weight: 600;
		line-height: 1;
		margin-top: 1rem;
		margin-bottom: 1rem;
		font-size: 0.95rem;
	}

	/* Lists */
	.markdown-content :deep(ul),
	.markdown-content :deep(ol) {
		margin-bottom: 1.25rem;
		padding-left: 1.5rem;
	}

	.markdown-content :deep(li) {
		margin-bottom: 0.5rem;
	}

	/* Links */
	.markdown-content :deep(a) {
		color: #2563eb; /* A classic blue for visibility */
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s;
	}

	.markdown-content :deep(a:hover) {
		color: #1d4ed8;
	}

	/* Blockquotes */
	.markdown-content :deep(blockquote) {
		border-left: 4px solid #cbd5e1;
		margin: 1.5rem 0;
		padding: 0.5rem 1rem;
		background-color: #f8fafc;
		color: #475569;
		font-style: italic;
	}

	/* Code Blocks */
	.markdown-content :deep(code) {
		background-color: #f1f5f9;
		color: #e11d48; /* Contrast color for inline code */
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.9em;
	}

	.markdown-content :deep(pre) {
		background-color: #1e293b; /* Keeping code blocks dark for syntax highlighting */
		color: #f8fafc;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1.5rem;
	}

	.markdown-content :deep(pre code) {
		background-color: transparent;
		color: inherit;
		padding: 0;
	}

	/* Tables */
	.markdown-content :deep(table) {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	.markdown-content :deep(th) {
		background-color: #f8fafc;
		border: 1px solid #e2e8f0;
		padding: 0.75rem;
		text-align: left;
		font-weight: 600;
	}

	.markdown-content :deep(td) {
		border: 1px solid #e2e8f0;
		padding: 0.75rem;
	}

	.markdown-content :deep(tr:nth-child(even)) {
		background-color: #fcfcfc;
	}

	/* Horizontal Rule */
	.markdown-content :deep(hr) {
		border: 0;
		border-top: 1px solid #e2e8f0;
		display: none;
	}

	/* Images */
	.markdown-content :deep(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.375rem;
		margin: 1rem 0;
	}

	/* Checkboxes (Task Lists) */
	.markdown-content :deep(input[type='checkbox']) {
		margin-right: 0.5rem;
		accent-color: #364153;
	}
</style>
