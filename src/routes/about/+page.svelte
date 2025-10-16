<script lang="ts">
	import { page } from '$app/stores';
	import type { UiDictionary } from '$lib/i18n';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	const dictionary = $derived($page.data.dictionary as UiDictionary);
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>

<article
	class="flex flex-col gap-6 rounded-sm border border-border bg-white/70 p-6 text-sm leading-relaxed text-neutral-700 dark:border-border-dark dark:bg-neutral-950/60 dark:text-neutral-300"
>
	<header class="flex flex-col gap-2">
		<h1 class="text-lg font-semibold text-surface-foreground dark:text-surface-dark-foreground">
			{dictionary.aboutPage.title}
		</h1>
		<p>{dictionary.aboutPage.intro}</p>
	</header>

	{#each dictionary.aboutPage.sections as section (section.title)}
		<section class="flex flex-col gap-2">
			<h2
				class="text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400"
			>
				{section.title}
			</h2>
			<ul
				class="flex list-disc flex-col gap-2 pl-5 marker:text-neutral-400 dark:marker:text-neutral-500"
			>
				{#each section.points as point (point)}
					<li>{point}</li>
				{/each}
			</ul>
		</section>
	{/each}
</article>
