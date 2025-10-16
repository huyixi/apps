<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { locales, type Locale } from '$lib/i18n';
	import type { LayoutData } from './$types';

	const THEME_STORAGE_KEY = 'apps-theme';

	const { data, children } = $props<{ data: LayoutData }>();

	let theme = $state<'light' | 'dark'>('light');
	let hydrated = false;
	let feedback = $state('');
	let feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

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
</script>

<svelte:head>
	<title>{data.siteTitle}</title>
	<meta name="description" content={data.siteDescription} />
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="min-h-screen text-surface-foreground dark:bg-neutral-950 dark:text-surface-dark-foreground"
>
	<header class="border-b border-border bg-white/80 dark:border-border-dark dark:bg-neutral-950/70">
		<div class="mx-auto w-full max-w-screen-2xl px-4 py-4 md:px-8 md:py-5">
			<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div class="flex flex-col gap-1">
					<h1 class="text-base leading-tight font-semibold">{data.siteTitle}</h1>
					<p class="max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">
						{data.dictionary.tagline}
					</p>
				</div>
				<div class="flex flex-wrap items-center gap-2">
					<a
						class="dark:hover-border-accent rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200"
						href={langHref('/about')}
					>
						{data.dictionary.nav.about}
					</a>
					<a
						class="dark:hover-border-accent rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200"
						href="/rss.xml"
						target="_blank"
						rel="noreferrer"
						title={data.dictionary.nav.rssDescription}
					>
						{data.dictionary.nav.rss}
					</a>
					<button
						type="button"
						class="dark:hover-border-accent rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200"
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
						class="dark:hover-border-accent inline-flex items-center gap-1 rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200"
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
		</div>
	</header>

	<div
		class="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col border-x border-border md:flex-row dark:border-border-dark"
	>
		<aside
			class="border-b border-border bg-white/70 px-4 py-6 md:w-72 md:flex-shrink-0 md:border-r md:border-b-0 md:px-6 md:py-8 dark:border-border-dark dark:bg-neutral-950/60"
			aria-label={data.dictionary.sidebar.title}
		>
			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<span
						class="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400"
					>
						{data.dictionary.sidebar.title}
					</span>
					<p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
						{data.siteDescription}
					</p>
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
									class="dark:hover-border-accent flex items-center justify-between rounded-xs border border-border px-2 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200"
									href={langHref('/about')}
								>
									<span>{data.dictionary.sidebar.about}</span>
									<span aria-hidden="true">↗</span>
								</a>
							</li>
							<li>
								<a
									class="dark:hover-border-accent flex items-center justify-between rounded-xs border border-border px-2 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent dark:border-border-dark dark:text-neutral-200"
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

		<main
			id="main-content"
			class="flex-1 border-t border-border bg-white/80 px-4 py-6 md:border-t-0 md:border-l md:px-8 md:py-10 dark:border-border-dark dark:bg-neutral-950/70"
		>
			<div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
