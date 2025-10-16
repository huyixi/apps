<script lang="ts">
	import type { Locale } from '$lib/i18n';
	import { formatUpdatedAt as formatUpdatedAtForLocale } from '$lib/i18n';
	import type { AppItem, Platform } from '$lib/types';
	import PlatformBadges from './PlatformBadges.svelte';

type CardLabels = {
	openDetail: string;
	website: string;
	repository: string;
};

	export let app: AppItem;
	export let labels: CardLabels = {
		openDetail: 'View details',
		repository: 'Repository',
		website: 'Website'
	};
export let platformLabels: Record<Platform, string> = {
	'Web apps': 'Web apps',
	'iOS apps': 'iOS apps',
	'android apps': 'android apps',
	'desktop apps': 'desktop apps'
};
export let locale: Locale = 'en';

const detailHref = () => {
	const params = new URLSearchParams();
	params.set('lang', locale);
	return `/apps/${app.slug}?${params.toString()}`;
};

	const tagHref = (tag: string) => {
		const params = new URLSearchParams();
		params.set('lang', locale);
		return `/tags/${encodeURIComponent(tag)}?${params.toString()}`;
	};
</script>

<article class="card group h-full">
	<a class="flex flex-col gap-2" href={detailHref()} aria-label={`${labels.openDetail}: ${app.name}`}>
		<div
			class="relative mb-2 flex h-32 items-center justify-center overflow-hidden rounded-xs border border-dashed border-border bg-neutral-50 transition-colors group-hover:border-accent/60 group-hover:bg-neutral-100 dark:border-border-dark dark:bg-neutral-900/60 group-hover:dark:border-accent/60 group-hover:dark:bg-neutral-900"
		>
			<img src={app.logo} alt={`${app.name} logo`} class="h-16 w-16 object-contain" loading="lazy" decoding="async" />
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex items-start justify-between gap-3">
				<h3 class="text-sm font-medium leading-tight text-surface-foreground dark:text-surface-dark-foreground">
					{app.name}
				</h3>
				{#if app.updatedAt}
					<span class="whitespace-nowrap text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
						{formatUpdatedAtForLocale(locale, app.updatedAt)}
					</span>
				{/if}
			</div>

			<p class="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
				{app.summary}
			</p>

			<PlatformBadges labels={platformLabels} platforms={app.platforms} />
		</div>
	</a>

	{#if app.tags.length}
		<ul class="mt-2 flex flex-wrap gap-1">
			{#each app.tags as tag}
				<li>
					<a class="chip lowercase" href={tagHref(tag)}>
						#{tag}
					</a>
				</li>
			{/each}
		</ul>
	{/if}

	{#if app.website || app.repo}
		<div class="mt-3 flex flex-wrap gap-2 border-t border-dashed border-border pt-2 text-xs dark:border-border-dark">
			{#if app.website}
				<a
					class="inline-flex items-center gap-1 rounded-xs border border-border px-2 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200 hover:dark:border-accent hover:dark:text-accent"
					href={app.website}
					target="_blank"
					rel="noreferrer"
								>
					<span aria-hidden="true">↗</span>
					<span>{labels.website}</span>
				</a>
			{/if}
			{#if app.repo}
				<a
					class="inline-flex items-center gap-1 rounded-xs border border-border px-2 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200 hover:dark:border-accent hover:dark:text-accent"
					href={app.repo}
					target="_blank"
					rel="noreferrer"
								>
					<span aria-hidden="true">⌘</span>
					<span>{labels.repository}</span>
				</a>
			{/if}
		</div>
	{/if}
</article>
