<script lang="ts">
	import Dialog from '$lib/ui/dialog/Dialog.svelte';
		import { cn } from '$lib/utils/classnames';
	import type { Locale, UiDictionary } from '$lib/i18n';

	const props = $props<{
		open: boolean;
		onClose: () => void;
		dictionary: UiDictionary;
		locales: ReadonlyArray<Locale>;
		activeLocale: Locale;
		onLocaleSelect: (locale: Locale) => void;
		bookmark: () => void | Promise<void>;
		quickLinks: Array<{ label: string; href: string; icon: string; external?: boolean }>;
		categories: Array<{ label: string; href: string; active: boolean }>;
	}>();

	const handleBookmark = async () => {
		await props.bookmark();
		props.onClose();
	};
</script>

<Dialog open={props.open} label={props.dictionary.nav.language} onClose={props.onClose}>
	<header class="relative overflow-hidden border-b border-border/70">
		<div class="absolute inset-0 bg-[conic-gradient(at_top_right,_rgba(79,70,229,0.18),transparent_65%)]" aria-hidden="true"></div>
		<div class="relative flex items-center justify-between px-5 py-4">
			<div class="flex flex-col gap-1">
				<h2 class="text-sm font-semibold text-neutral-900">Browse App Stacks</h2>
				<p class="text-xs text-neutral-500">Navigation shortcuts, languages, and curated categories.</p>
			</div>
			<button type="button" class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-neutral-500 transition-colors hover:text-accent" onclick={props.onClose} aria-label="Close navigation menu">
				✕
			</button>
		</div>
	</header>

	<div class="flex flex-1 flex-col gap-6 overflow-y-auto bg-white px-5 py-6">
		<section class="space-y-3">
			<p class="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Quick actions</p>
			<nav aria-label="Primary navigation" class="grid grid-cols-1 gap-2 text-sm">
				{#each props.quickLinks as link}
					<a
						class="group inline-flex items-center justify-between rounded-lg border border-border px-3 py-2 transition-colors hover:border-accent hover:text-accent"
						href={link.href}
						onclick={props.onClose}
						target={link.external ? '_blank' : undefined}
						rel={link.external ? 'noreferrer' : undefined}
					>
						<span class="flex items-center gap-2">
							<span class={cn('inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-medium text-white', link.icon === 'RSS' ? 'tracking-tight' : '')}>{link.icon}</span>
							{link.label}
						</span>
						<span aria-hidden="true" class="text-xs text-neutral-400 group-hover:text-accent">↗</span>
					</a>
				{/each}
				<button
					class="group inline-flex items-center justify-between rounded-lg border border-border px-3 py-2 text-left transition-colors hover:border-accent hover:text-accent"
					type="button"
					onclick={handleBookmark}
				>
					<span class="flex items-center gap-2">
						<span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-medium text-white">★</span>
						{props.dictionary.nav.bookmark}
					</span>
					<span aria-hidden="true" class="text-xs text-neutral-400 group-hover:text-accent">⧉</span>
				</button>
			</nav>
		</section>

		<section class="space-y-3">
			<p class="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
				{props.dictionary.nav.language}
			</p>
			<div class="flex flex-wrap gap-2">
				{#each props.locales as locale}
					<button
						type="button"
						class={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
							locale === props.activeLocale
								? 'border-neutral-900 bg-neutral-900 text-white'
								: 'border-border text-neutral-600 hover:border-accent hover:text-accent'
						}`}
						onclick={() => props.onLocaleSelect(locale)}
					>
						{props.dictionary.nav.languageNames[locale]}
					</button>
				{/each}
			</div>
		</section>

		<section class="space-y-3">
			<p class="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Categories</p>
			<ul class="grid grid-cols-1 gap-2 text-xs font-medium">
				{#each props.categories as category}
					<li>
						<a
							class={`flex items-center justify-between rounded-lg border px-3 py-1.75 transition-colors ${
								category.active
									? 'border-neutral-900 text-neutral-900 shadow-sm'
									: 'border-border text-neutral-700 hover:border-accent hover:text-accent focus-visible:border-accent'
							}`}
							href={category.href}
							onclick={props.onClose}
						>
							<span>{category.label}</span>
							<span class={`text-[10px] font-semibold uppercase ${category.active ? 'text-neutral-900' : 'text-neutral-400'}`} aria-hidden="true">▸</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</div>

	<footer class="border-t border-border/70 bg-neutral-50/80 px-5 py-4 text-xs leading-relaxed text-neutral-500">
		<p>
			App Stacks is designed & built by huyixi. For questions, suggestions, or inquiries, please contact me
			<a class="ml-1 underline decoration-dotted underline-offset-2 transition-colors hover:text-accent" href="mailto:huyixi.dev@gmail.com">here</a>.
		</p>
		<p class="mt-2 font-medium text-neutral-400">All rights reserved 2025</p>
	</footer>
	</Dialog>
