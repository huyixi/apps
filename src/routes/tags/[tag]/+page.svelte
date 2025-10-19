<script lang="ts">
	import { AppCard } from '$lib';
	import { page } from '$app/stores';
	import type { Locale, UiDictionary } from '$lib/i18n';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	const dictionary = $derived($page.data.dictionary as UiDictionary);
	const locale = $derived($page.data.locale as Locale);
	const cardLabels = $derived({
		openDetail: dictionary.card.openDetail,
		website: dictionary.card.website,
		repository: dictionary.card.repository
	});

	const homeHref = () => {
		const params = new URLSearchParams();
		params.set('lang', locale);
		const query = params.toString();
		return query ? `/?${query}` : '/';
	};
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>

<section
	class="flex flex-col gap-4 rounded-sm border border-border p-4 dark:border-border-dark dark:bg-neutral-950/60"
>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex flex-col gap-1">
			<h1
				class="text-base leading-tight font-semibold text-surface-foreground dark:text-surface-dark-foreground"
			>
				{dictionary.tagsPage.heading} #{data.tag}
			</h1>
			<p class="text-sm text-neutral-600 dark:text-neutral-300">
				{dictionary.tagsPage.description} #{data.tag}
			</p>
		</div>
		<a
			class="dark:hover-border-accent rounded-xs border border-border px-3 py-1.5 font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200"
			href={homeHref()}
		>
			{dictionary.list.allPlatforms}
		</a>
	</div>
</section>

{#if data.apps.length}
	<section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
		{#each data.apps as app (app.id)}
			<AppCard {app} labels={cardLabels} platformLabels={dictionary.platformLabels} {locale} />
		{/each}
	</section>
{:else}
	<section
		class="rounded-sm border border-dashed border-border p-6 text-sm text-neutral-600 dark:border-border-dark dark:bg-neutral-950/60 dark:text-neutral-300"
	>
		{dictionary.list.empty}
	</section>
{/if}
