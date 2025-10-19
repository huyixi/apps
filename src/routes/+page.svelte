<script lang="ts">
	import { AppCard } from '$lib';
	import { page } from '$app/stores';
	import type { Locale, UiDictionary } from '$lib/i18n';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	const pageData = $derived($page);
	const dictionary = $derived(pageData.data.dictionary as UiDictionary);
	const locale = $derived(pageData.data.locale as Locale);

	const apps = $derived(data.apps);

	const cardLabels = $derived({
		openDetail: dictionary.card.openDetail,
		website: dictionary.card.website,
		repository: dictionary.card.repository
	});

	const collectionSummary = $derived(`${apps.length} ${dictionary.list.countLabel}`);
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>

{#if apps.length}
	<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
		{#each apps as app (app.id)}
			<AppCard {app} labels={cardLabels} {locale} />
		{/each}
	</section>
{:else}
	<section
		class="rounded-sm border border-dashed border-border p-6 text-sm text-neutral-600 dark:border-border-dark dark:bg-neutral-950/60 dark:text-neutral-300"
	>
		{dictionary.list.empty}
	</section>
{/if}
