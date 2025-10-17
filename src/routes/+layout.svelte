<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
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
	let desktopMenuOpen = $state(false);

	const toId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

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

	const handleLocaleSelect = (nextLocale: Locale) => {
		changeLanguage(nextLocale);
	};

	const isActiveLocale = (value: Locale) => value === data.locale;

	let currentCategory = $state('');
	$effect(() => {
		currentCategory = $page.url.searchParams.get('category') ?? 'All Products';
	});

	const quickLinks = $derived([
		{ label: data.dictionary.nav.about, href: langHref('/about'), icon: 'i', external: false },
		{ label: data.dictionary.nav.rss, href: '/rss.xml', icon: 'RSS', external: true }
	]);

	const categoryLinks = $derived(
		categories.map((label) => ({
			label,
			href: categoryHref(label),
			active: currentCategory === label
		}))
	);

	$effect(() => {
		if (!browser || !hydrated) return;
		document.documentElement.setAttribute('lang', data.locale);
	});

	let previousBodyOverflow = '';

	$effect(() => {
		if (!browser || !hydrated) return;
		if (desktopMenuOpen) {
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = previousBodyOverflow;
		}
	});

	onDestroy(() => {
		if (!browser) return;
		document.body.style.overflow = previousBodyOverflow;
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
				<div class="hidden items-center gap-2 md:flex">
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
		</div>
	</header>

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
						{#each categoryLinks as category}
							<li>
								<a
									class={`flex items-center justify-between rounded-xs border px-3 py-1.5 transition-colors ${category.active ? 'border-accent text-accent' : 'border-border text-neutral-700 hover:border-accent hover:text-accent focus-visible:border-accent'}`}
									href={category.href}
								>
									<span>{category.label}</span>
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
