<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { locales, type Locale } from '$lib/i18n';
	import type { LayoutData } from './$types';

	const THEME_STORAGE_KEY = 'apps-theme';
	const categories = [
		'All Products',
		'Web apps',
		'Mobile apps',
		'Artificial Intelligence',
		'Desktop apps'
	];

	const { data, children } = $props<{ data: LayoutData }>();

	let hydrated = false;
	let feedback = $state('');
	let feedbackTimeout: ReturnType<typeof setTimeout> | null = null;
	let mobileMenuOpen = $state(false);

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

	const categoryHref = (category: string) => {
		const params = new URLSearchParams();
		params.set('lang', data.locale);
		if (category !== 'All Products') {
			params.set('category', category);
		}
		return `/?${params.toString()}`;
	};

	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};

	const toggleMobileMenu = () => {
		mobileMenuOpen = !mobileMenuOpen;
	};

	const handleMobileBookmark = async () => {
		await handleBookmark();
		closeMobileMenu();
	};

	const handleLocaleSelect = (nextLocale: Locale) => {
		closeMobileMenu();
		changeLanguage(nextLocale);
	};

	const isActiveLocale = (value: Locale) => value === data.locale;

	let currentCategory = $state('');
	$effect(() => {
		currentCategory = $page.url.searchParams.get('category') ?? 'All Products';
	});

	const isActiveCategory = (category: string) => currentCategory === category;

	onMount(() => {
		hydrated = true;
	});

	$effect(() => {
		if (!browser || !hydrated) return;
		document.documentElement.setAttribute('lang', data.locale);
	});

	afterNavigate(() => {
		if (!browser) return;
		mobileMenuOpen = false;
		window.scrollTo({ top: 0 });
	});
</script>

<svelte:head>
	<title>{data.siteTitle}</title>
	<meta name="description" content={data.siteDescription} />
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen min-h-screen flex-col text-surface-foreground">
	<header class="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-sm">
		<div class="relative mx-auto w-full px-4 py-4 md:px-8 md:py-5">
			<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div class="flex items-center justify-between gap-3 md:block">
					<div class="flex flex-col gap-1">
						<h1 class="text-base leading-tight font-semibold">{data.siteTitle}</h1>
						<p class="hidden max-w-2xl text-sm text-neutral-600 md:block">
							{data.dictionary.tagline}
						</p>
					</div>
				</div>
				<div class="hidden flex-wrap items-center gap-2 md:flex">
					<a
						class="focus-visible-border-accent rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-accent hover:text-accent"
						href={langHref('/about')}
					>
						{data.dictionary.nav.about}
					</a>
					<a
						class="hover-border-accent hover-text-accent focus-visible-border-accent rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors"
						href="/rss.xml"
						target="_blank"
						rel="noreferrer"
						title={data.dictionary.nav.rssDescription}
					>
						{data.dictionary.nav.rss}
					</a>
					<button
						type="button"
						class="hover-border-accent hover-text-accent focus-visible-border-accent rounded-xs border border-border px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors"
						onclick={handleBookmark}
						title={data.dictionary.nav.bookmarkDescription}
					>
						{data.dictionary.nav.bookmark}
					</button>
					<div
						class="flex items-center gap-1 rounded-xs border border-border px-1 py-1"
						role="group"
						aria-label={data.dictionary.nav.language}
					>
						{#each locales as option}
							<button
								type="button"
								class={`rounded-xs px-2 py-1 text-xs font-semibold transition-colors ${
									isActiveLocale(option)
										? 'bg-neutral-200 text-neutral-900'
										: 'text-neutral-600 hover:text-accent'
								}`}
								onclick={() => changeLanguage(option)}
								aria-pressed={isActiveLocale(option)}
							>
								{data.dictionary.nav.languageNames[option]}
							</button>
						{/each}
					</div>
				</div>
			</div>
			{#if feedback}
				<p
					class="mt-3 rounded-xs border border-dashed border-border px-3 py-2 text-xs text-neutral-600"
				>
					{feedback}
				</p>
			{/if}
			{#if mobileMenuOpen}
				<dialog
					id="mobile-navigation-dialog"
					open
					class="fixed inset-0 z-40 flex items-center justify-center bg-neutral-950/50 backdrop-blur-sm"
				>
					<div class="absolute inset-0" role="presentation" onclick={closeMobileMenu}></div>
					<div
						class="relative z-10 max-h-[calc(100vh-3rem)] w-[min(22rem,_calc(100vw-2.5rem))] overflow-y-auto rounded-lg border border-border bg-white shadow-2xl ring-1 ring-border/60"
						aria-modal="true"
						aria-label="Mobile navigation"
					>
						<header class="flex items-center justify-between border-b border-border px-4 py-3">
							<h2 class="text-sm font-semibold text-neutral-800">Browse</h2>
							<button
								type="button"
								class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-neutral-500 transition-colors hover:text-accent"
								onclick={closeMobileMenu}
								aria-label="Close navigation menu"
							>
								✕
							</button>
						</header>
						<div class="flex flex-col divide-y divide-border/70">
							<div class="space-y-4 px-4 py-5">
								<div class="space-y-3">
									<p class="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
										Menu
									</p>
									<nav aria-label="Primary navigation" class="flex flex-col gap-2 text-sm">
										<a
											class="inline-flex items-center justify-between rounded-md border border-border px-3 py-2 text-neutral-700 transition-colors hover:border-accent hover:text-accent"
											href={langHref('/about')}
											onclick={closeMobileMenu}
										>
											{data.dictionary.nav.about}
											<span aria-hidden="true">↗</span>
										</a>
										<a
											class="inline-flex items-center justify-between rounded-md border border-border px-3 py-2 text-neutral-700 transition-colors hover:border-accent hover:text-accent"
											href="/rss.xml"
											target="_blank"
											rel="noreferrer"
											title={data.dictionary.nav.rssDescription}
											onclick={closeMobileMenu}
										>
											{data.dictionary.nav.rss}
											<span aria-hidden="true">RSS</span>
										</a>
										<button
											type="button"
											class="inline-flex items-center justify-between rounded-md border border-border px-3 py-2 text-left text-neutral-700 transition-colors hover:border-accent hover:text-accent"
											onclick={handleMobileBookmark}
										>
											{data.dictionary.nav.bookmark}
											<span aria-hidden="true">⧉</span>
										</button>
									</nav>
								</div>
								<div class="space-y-2">
									<p class="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
										{data.dictionary.nav.language}
									</p>
									<div class="flex flex-wrap gap-2">
										{#each locales as option}
											<button
												type="button"
												class={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
													isActiveLocale(option)
														? 'border-accent text-accent'
														: 'border-border text-neutral-600 hover:border-accent hover:text-accent'
												}`}
												onclick={() => handleLocaleSelect(option)}
											>
												{data.dictionary.nav.languageNames[option]}
											</button>
										{/each}
									</div>
								</div>
							</div>
							<div class="space-y-3 px-4 py-5">
								<p class="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
									Categories
								</p>
								<ul class="flex flex-col gap-2 text-xs font-medium">
									{#each categories as category}
										<li>
											<a
												class={`flex items-center justify-between rounded-md border px-3 py-1.5 transition-colors ${
													isActiveCategory(category)
														? 'border-accent text-accent'
														: 'border-border text-neutral-700 hover:border-accent hover:text-accent focus-visible:border-accent'
												}`}
												href={categoryHref(category)}
												onclick={closeMobileMenu}
											>
												<span>{category}</span>
												<span
													class={`text-[10px] font-semibold uppercase ${isActiveCategory(category) ? 'text-accent' : 'text-neutral-400'}`}
													aria-hidden="true">▸</span
												>
											</a>
										</li>
									{/each}
								</ul>
							</div>
							<footer
								class="space-y-2 bg-neutral-50/60 px-4 py-4 text-xs leading-relaxed text-neutral-500"
							>
								<p>
									App Stacks is designed & built by huyixi. For questions, suggestions, or
									inquiries, please contact me
									<a
										class="ml-1 underline decoration-dotted underline-offset-2 transition-colors hover:text-accent"
										href="mailto:huyixi.dev@gmail.com">here</a
									>.
								</p>
								<p class="mt-2 font-medium text-neutral-400">All rights reserved 2025</p>
							</footer>
						</div>
					</div>
				</dialog>
			{/if}
		</div>
	</header>

	<button
		type="button"
		class={`fixed right-4 bottom-6 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-white/95 px-4 py-2 text-xs font-semibold text-neutral-700 shadow-lg transition md:hidden ${mobileMenuOpen ? 'border-accent text-accent shadow-accent/40' : ''}`}
		onclick={toggleMobileMenu}
		aria-haspopup="dialog"
		aria-expanded={mobileMenuOpen}
		aria-controls="mobile-navigation-dialog"
	>
		<span aria-hidden="true">{mobileMenuOpen ? '✕' : '☰'}</span>
		<span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
	</button>

	<div class=" flex w-full flex-1 flex-col overflow-auto border-x border-border md:flex-row">
		<aside
			class="hidden border-r border-border bg-white/85 px-4 py-6 backdrop-blur-sm md:flex md:w-72 md:flex-shrink-0 md:flex-col md:space-y-6"
			aria-label="Catalogue navigation"
		>
			<div class="space-y-3">
				<span
					class="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400"
				>
					Categories
				</span>
				<nav aria-label="Product categories">
					<ul class="flex flex-col gap-2 text-xs font-medium">
						{#each categories as category}
							<li>
								<a
									class={`flex items-center justify-between rounded-xs border px-3 py-1.5 transition-colors ${isActiveCategory(category) ? 'border-accent text-accent' : 'border-border text-neutral-700 hover:border-accent hover:text-accent focus-visible:border-accent'}`}
									href={categoryHref(category)}
								>
									<span>{category}</span>
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			</div>
			<div
				class="mt-auto border-t border-border pt-4 text-xs leading-relaxed text-neutral-500 dark:border-border-dark dark:text-neutral-400"
			>
				<p>
					App Stacks is designed & built by huyixi. For questions, suggestions, or inquiries, please
					contact me
					<a
						class="ml-1 underline decoration-dotted underline-offset-2 transition-colors hover:text-accent"
						href="mailto:huyixi.dev@gmail.com">here</a
					>.
				</p>
				<p class="mt-2">All rights reserved 2025</p>
			</div>
		</aside>

		<main
			id="main-content"
			class="flex-1 overflow-auto border-t border-border bg-white/80 px-4 py-6 md:border-t-0 md:border-l md:px-8 md:py-10"
		>
			<div class="flex w-full flex-col gap-6">
				{@render children?.()}
			</div>
		</main>
	</div>
</div>
