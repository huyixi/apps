<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { AppCard, ImageCarousel, Markdown, PlatformBadges } from '$lib';
	import { formatUpdatedAt, type Locale, type UiDictionary } from '$lib/i18n';
	import type { AppItem } from '$lib/types';
	import type { PageData } from './$types';
	import { onDestroy } from 'svelte';

	const { data } = $props<{ data: PageData }>();

	const dictionary = $derived($page.data.dictionary as UiDictionary);
	const locale = $derived($page.data.locale as Locale);
	const app = $derived(data.app as AppItem);

	const cardLabels = $derived({
		openDetail: dictionary.card.openDetail,
		website: dictionary.card.website,
		repository: dictionary.card.repository
	});

	const galleryImages = $derived.by<string[]>(() => {
		const screenshots = app.screenshots?.filter((value): value is string => Boolean(value));
		if (screenshots && screenshots.length) {
			return screenshots;
		}
		return [app.logo];
	});

	let shareFeedback = $state('');
	let shareTimer: ReturnType<typeof setTimeout> | null = null;

	const clearShareFeedback = () => {
		if (shareTimer) {
			clearTimeout(shareTimer);
			shareTimer = null;
		}
	};

	const setShareFeedback = (message: string) => {
		clearShareFeedback();
		shareFeedback = message;
		shareTimer = setTimeout(() => {
			shareFeedback = '';
			shareTimer = null;
		}, 4000);
	};

	const permalink = () => $page.url.href;

	const copyLink = async () => {
		if (!browser) return;
		clearShareFeedback();
		try {
			await navigator.clipboard.writeText(permalink());
			setShareFeedback(dictionary.detail.shareCopied);
		} catch {
			setShareFeedback(dictionary.detail.shareFailed);
		}
	};

	const shareApp = async () => {
		if (!browser) {
			await copyLink();
			return;
		}
		if (navigator.share) {
			try {
				await navigator.share({
					title: app.name,
					text: app.summary,
					url: permalink()
				});
				setShareFeedback(dictionary.detail.shareCopied);
			} catch (exception) {
				if ((exception as Error)?.name !== 'AbortError') {
					setShareFeedback(dictionary.detail.shareFailed);
				}
			}
		} else {
			await copyLink();
		}
	};

	onDestroy(clearShareFeedback);
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>

<article class="flex flex-col gap-6">
	<ImageCarousel images={galleryImages} />

	<header
		class="flex flex-col gap-4 rounded-sm border border-border bg-white/70 p-4 md:flex-row md:items-start"
	>
		<div class="flex items-start gap-4">
			<div
				class="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xs border border-border bg-white"
			>
				<img
					src={app.logo}
					alt={`${app.name} logo`}
					class="h-16 w-16 object-contain"
					loading="lazy"
					decoding="async"
				/>
			</div>
			<div class="flex flex-col gap-3">
				<div class="flex flex-wrap items-center gap-2">
					<h1 class="text-lg leading-tight font-semibold text-surface-foreground">
						{app.name}
					</h1>
					{#if app.updatedAt}
						<span
							class="rounded-xs border border-border px-2 py-1 text-[11px] tracking-wide text-neutral-500 uppercase"
						>
							{formatUpdatedAt(locale, app.updatedAt)}
						</span>
					{/if}
				</div>
				<p class="max-w-2xl text-sm leading-relaxed text-neutral-600">
					{app.summary}
				</p>
				<PlatformBadges platforms={app.platforms} labels={dictionary.platformLabels} />
			</div>
		</div>

		<div class="flex flex-1 flex-col gap-3 md:items-end">
			<div class="flex flex-wrap gap-2 md:justify-end">
				{#if app.website}
					<a
						class="inline-flex items-center gap-2 rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent"
						href={app.website}
						target="_blank"
						rel="noreferrer"
					>
						<span aria-hidden="true">↗</span>
						<span>{dictionary.detail.website}</span>
					</a>
				{/if}
				{#if app.repo}
					<a
						class="inline-flex items-center gap-2 rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent"
						href={app.repo}
						target="_blank"
						rel="noreferrer"
					>
						<span aria-hidden="true">⌘</span>
						<span>{dictionary.detail.repo}</span>
					</a>
				{/if}
			</div>

			<div class="flex flex-wrap gap-2 md:justify-end">
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent"
					onclick={shareApp}
				>
					<span aria-hidden="true">⇪</span>
					<span>{dictionary.detail.share}</span>
				</button>
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent"
					onclick={copyLink}
				>
					<span aria-hidden="true">⧉</span>
					<span>{dictionary.detail.shareCopy}</span>
				</button>
			</div>

			{#if shareFeedback}
				<p
					class="rounded-xs border border-dashed border-border px-3 py-1 text-[11px] text-neutral-500 md:text-right"
				>
					{shareFeedback}
				</p>
			{/if}
		</div>
	</header>

	{#if app.tags.length}
		<section class="rounded-sm border border-border bg-white/70 p-4">
			<div class="flex flex-wrap gap-2">
				{#each app.tags as tag}
					<span class="chip lowercase">
						#{tag}
					</span>
				{/each}
			</div>
		</section>
	{/if}

	<section class="rounded-sm border border-border bg-white/70 p-4">
		<h2 class="mb-3 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
			{dictionary.detail.summary}
		</h2>
		<Markdown content={app.description} />
	</section>

	{#if data.similar.length}
		<section class="rounded-sm border border-border bg-white/70 p-4">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
					{dictionary.detail.similar}
				</h2>
				<span class="text-[11px] text-neutral-400">
					{data.similar.length}
					{dictionary.list.countLabel}
				</span>
			</div>
			<div class="grid gap-3 md:grid-cols-2">
				{#each data.similar as item (item.id)}
					<AppCard
						app={item}
						labels={cardLabels}
						platformLabels={dictionary.platformLabels}
						{locale}
					/>
				{/each}
			</div>
		</section>
	{:else}
		<section
			class="rounded-sm border border-dashed border-border bg-white/60 p-6 text-sm text-neutral-500 dark:border-border-dark dark:bg-neutral-950/50 dark:text-neutral-400"
		>
			{dictionary.detail.similarEmpty}
		</section>
	{/if}
</article>
