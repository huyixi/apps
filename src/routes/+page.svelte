<script lang="ts">
	import { AppCard } from '$lib';
	import { page } from '$app/stores';
	import type { Locale, UiDictionary } from '$lib/i18n';
	import type { Platform } from '$lib/types';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	const pageData = $derived($page);
	const dictionary = $derived(pageData.data.dictionary as UiDictionary);
	const locale = $derived(pageData.data.locale as Locale);

	const apps = $derived(data.apps);
	const tags = $derived(data.tags);
	const selectedPlatform = $derived(data.selectedPlatform as Platform | null);

	const cardLabels = $derived({
		openDetail: dictionary.card.openDetail,
		website: dictionary.card.website,
		repository: dictionary.card.repository
	});

	const resultSummary = $derived(`${apps.length} ${dictionary.list.countLabel}`);
	const selectedPlatformLabel = $derived(
		selectedPlatform
			? dictionary.platformLabels[selectedPlatform]
			: dictionary.list.allPlatforms
	);

	const tagHref = (tag: string) => {
		const params = new URLSearchParams();
		params.set('lang', locale);
		return `/tags/${encodeURIComponent(tag)}?${params.toString()}`;
	};
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>

<section
	class="flex flex-col gap-4 rounded-sm border border-border bg-white/70 p-4 dark:border-border-dark dark:bg-neutral-950/60"
>
	<div class="flex flex-col gap-1">
		<h2 class="text-sm font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
			{dictionary.list.filteredBy}
		</h2>
		<div class="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
			<span>{resultSummary}</span>
			<span class="text-neutral-400">•</span>
			<span>{selectedPlatformLabel}</span>
		</div>
	</div>

	{#if tags.length}
		<div class="flex flex-wrap gap-2">
			{#each tags as tag}
				<a class="chip lowercase" href={tagHref(tag)} rel="noopener">
					#{tag}
				</a>
			{/each}
		</div>
	{/if}
</section>

{#if apps.length}
	<section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
		{#each apps as app (app.id)}
			<AppCard {app} labels={cardLabels} platformLabels={dictionary.platformLabels} {locale} />
		{/each}
	</section>
{:else}
	<section
		class="rounded-sm border border-dashed border-border bg-white/70 p-6 text-sm text-neutral-600 dark:border-border-dark dark:bg-neutral-950/60 dark:text-neutral-300"
	>
		{dictionary.list.empty}
	</section>
{/if}
