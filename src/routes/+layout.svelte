<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { locales, type Locale } from '$lib/i18n';
	import type { Platform } from '$lib/types';
	import type { LayoutData } from './$types';

	const THEME_STORAGE_KEY = 'apps-theme';
	const platformList: Platform[] = ['Web apps', 'iOS apps', 'android apps', 'desktop apps'];
	const platformSet = new Set<Platform>(platformList);

	const { data, children } = $props<{ data: LayoutData }>();

	type PlatformKey = 'all' | Platform;
	type PlatformFilter = { key: PlatformKey; label: string };

	let theme = $state<'light' | 'dark'>('light');
	let hydrated = false;
	let feedback = $state('');
	let feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

	const filterButtonClass = (active: boolean) =>
		`flex w-full items-center justify-between rounded-xs border px-2 py-1 text-xs font-medium uppercase tracking-wide transition-colors ${
			active
				? 'border-accent text-accent bg-neutral-50 dark:border-accent dark:bg-neutral-900'
				: 'border-border/50 text-neutral-600 hover:border-accent hover:text-accent dark:border-border-dark/60 dark:text-neutral-300 dark:hover-border-accent'
		}`;

	const applyTheme = (value: 'light' | 'dark') => {
		if (!browser) return;
		theme = value;
		document.documentElement.classList.toggle('dark', value === 'dark');
		localStorage.setItem(THEME_STORAGE_KEY, value);
	};

	const toggleTheme = () => {
		applyTheme(theme === 'dark' ? 'light' : 'dark');
	};

	const clearFeedback = () => {
		if (feedbackTimeout) {
			clearTimeout(feedbackTimeout);
			feedbackTimeout = null;
		}
	};

	const handleBookmark = async () => {
		if (!browser) return;
		clearFeedback();
		try {
			await navigator.clipboard.writeText($page.url.href);
			feedback = data.dictionary.nav.bookmarkNotice;
		} catch {
			feedback = data.dictionary.nav.bookmarkFallback;
		}
		feedbackTimeout = setTimeout(() => {
			feedback = '';
			feedbackTimeout = null;
		}, 4000);
	};

	const changeLanguage = (nextLocale: Locale) => {
		if (nextLocale === data.locale) return;
		const params = new URLSearchParams($page.url.searchParams);
		params.set('lang', nextLocale);
		goto(`${$page.url.pathname}?${params.toString()}`, { keepFocus: true });
	};

	const langHref = (pathname: string) => {
		const params = new URLSearchParams();
		params.set('lang', data.locale);
		const query = params.toString();
		return query ? `${pathname}?${query}` : pathname;
	};

	const applyPlatformFilter = (key: PlatformKey) => {
		const params = new URLSearchParams($page.url.searchParams);
		if (key === 'all') {
			params.delete('platform');
		} else {
			params.set('platform', key);
		}
		params.set('lang', data.locale);
		goto(`${$page.url.pathname}?${params.toString()}`, { keepFocus: true });
	};

	const isActiveLocale = (value: Locale) => value === data.locale;

	onMount(() => {
		hydrated = true;
		const stored = browser
			? (localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null)
			: null;
		const prefersDark =
			browser && window.matchMedia
				? window.matchMedia('(prefers-color-scheme: dark)').matches
				: false;
		applyTheme(stored ?? (prefersDark ? 'dark' : 'light'));
	});

	$effect(() => {
		if (!browser || !hydrated) return;
		document.documentElement.setAttribute('lang', data.locale);
	});

	const platformFilters = $derived<PlatformFilter[]>([
		{ key: 'all' as PlatformKey, label: data.dictionary.sidebar.platformFilters.all },
		...platformList.map((key) => ({
			key,
			label: data.dictionary.sidebar.platformFilters[key]
		}))
	]);

	const activePlatform = $derived.by<PlatformKey>(() => {
		const value = $page.url.searchParams.get('platform');
		if (value && platformSet.has(value as Platform)) {
			return value as Platform;
		}
		return 'all';
	});
</script>

<svelte:head>
	<title>{data.siteTitle}</title>
	<meta name="description" content={data.siteDescription} />
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	class="absolute top-4 left-4 z-50 -translate-y-full rounded-xs border border-border bg-white px-3 py-2 text-xs font-medium text-neutral-700 focus-visible:translate-y-0 focus-visible:outline-hidden dark:border-border-dark dark:bg-neutral-900 dark:text-neutral-200"
	href="#main-content"
>
	{data.dictionary.nav.skipToContent}
</a>

<div
	class="min-h-screen text-surface-foreground dark:bg-neutral-950 dark:text-surface-dark-foreground"
>
	<div
		class="mx-auto flex min-h-screen max-w-screen-2xl border-x border-border dark:border-border-dark"
	>
		<aside
			class="w-full border-b border-border bg-white/70 p-4 md:sticky md:top-0 md:h-screen md:w-64 md:border-r md:border-b-0 dark:border-border-dark dark:bg-neutral-950/60"
			aria-label={`${data.dictionary.sidebar.filtersHeading} & ${data.dictionary.sidebar.linksHeading}`}
		>
			<div class="flex flex-col gap-6 md:h-full">
				<div class="flex flex-col gap-3">
					<span
						class="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400"
					>
						{data.dictionary.sidebar.filtersHeading}
					</span>
					<nav aria-label={data.dictionary.sidebar.filtersHeading}>
						<ul class="flex flex-wrap gap-2 md:flex-col">
							{#each platformFilters as item}
								<li>
									<button
										type="button"
										class={filterButtonClass(activePlatform === item.key)}
										onclick={() => applyPlatformFilter(item.key)}
										aria-pressed={activePlatform === item.key}
									>
										<span>{item.label}</span>
										{#if item.key !== 'all'}
											<span class="text-[10px] text-neutral-400 normal-case dark:text-neutral-500">
												{data.dictionary.platformLabels[item.key]}
											</span>
										{/if}
									</button>
								</li>
							{/each}
						</ul>
					</nav>
				</div>

				<div class="flex flex-col gap-3">
					<span
						class="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400"
					>
						{data.dictionary.sidebar.linksHeading}
					</span>
					<nav aria-label={data.dictionary.sidebar.linksHeading}>
						<ul class="flex flex-wrap gap-2 md:flex-col">
							<li>
								<a
									class="flex items-center justify-between rounded-xs border border-border px-2 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200 dark:hover:border-accent"
									href={langHref('/about')}
								>
									<span>{data.dictionary.sidebar.about}</span>
									<span aria-hidden="true">↗</span>
								</a>
							</li>
							<li>
								<a
									class="flex items-center justify-between rounded-xs border border-border px-2 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200 dark:hover:border-accent"
									href="https://github.com/huyixi"
									target="_blank"
									rel="noreferrer"
								>
									<span>{data.dictionary.sidebar.github}</span>
									<span aria-hidden="true">↗</span>
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</aside>

		<div class="flex min-h-screen flex-1 flex-col">
			<header
				class="border-b border-border bg-white/80 px-4 py-4 md:px-8 dark:border-border-dark dark:bg-neutral-950/70"
			>
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div class="flex flex-col gap-1">
						<h1 class="text-base leading-tight font-semibold">{data.siteTitle}</h1>
						<p class="max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">
							{data.dictionary.tagline}
						</p>
					</div>
					<div class="flex flex-wrap items-center gap-2">
						<a
							class="rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200 dark:hover:border-accent"
							href={langHref('/about')}
						>
							{data.dictionary.nav.about}
						</a>
						<a
							class="rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200 dark:hover:border-accent"
							href="/rss.xml"
							target="_blank"
							rel="noreferrer"
							title={data.dictionary.nav.rssDescription}
						>
							{data.dictionary.nav.rss}
						</a>
						<button
							type="button"
							class="rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200 dark:hover:border-accent"
							onclick={handleBookmark}
							title={data.dictionary.nav.bookmarkDescription}
						>
							{data.dictionary.nav.bookmark}
						</button>
						<div
							class="flex items-center gap-1 rounded-xs border border-border px-1 py-1 dark:border-border-dark"
							role="group"
							aria-label={data.dictionary.nav.language}
						>
							{#each locales as option}
								<button
									type="button"
									class={`rounded-xs px-2 py-1 text-xs font-semibold transition-colors ${
										isActiveLocale(option)
											? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
											: 'text-neutral-600 hover:text-accent dark:text-neutral-300 dark:hover:text-accent'
									}`}
									onclick={() => changeLanguage(option)}
									aria-pressed={isActiveLocale(option)}
								>
									{data.dictionary.nav.languageNames[option]}
								</button>
							{/each}
						</div>
						<button
							type="button"
							class="inline-flex items-center gap-1 rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200 dark:hover:border-accent"
							onclick={toggleTheme}
							title={data.dictionary.nav.themeToggle}
						>
							<span aria-hidden="true">{theme === 'dark' ? '☾' : '☀︎'}</span>
							<span class="hidden sm:inline">{data.dictionary.nav.themeToggle}</span>
						</button>
					</div>
				</div>
				{#if feedback}
					<p
						class="mt-3 rounded-xs border border-dashed border-border px-3 py-2 text-xs text-neutral-600 dark:border-border-dark dark:text-neutral-300"
					>
						{feedback}
					</p>
				{/if}
			</header>

			<main
				id="main-content"
				class="flex-1 border-t border-border bg-white/80 px-4 py-6 md:px-8 md:py-10 dark:border-border-dark dark:bg-neutral-950/70"
			>
				<div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
					{@render children?.()}
				</div>
			</main>
		</div>
	</div>
</div>
