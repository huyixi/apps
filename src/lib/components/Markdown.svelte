<script lang="ts">
	import { marked } from 'marked';

	marked.use({
		breaks: true,
		gfm: true
	});

	export let content = '';
	export let className = '';

	$: html = marked.parse(content ?? '');
</script>

<div
	class={`prose prose-sm prose-headings:text-base prose-headings:font-medium prose-p:text-sm prose-li:text-sm prose-strong:font-semibold prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:pl-3 prose-blockquote:text-neutral-600 prose-code:rounded-xs prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-[13px] dark:prose-invert dark:prose-blockquote:text-neutral-300 dark:prose-code:bg-neutral-800 ${className}`}
>
	{@html html}
</div>
