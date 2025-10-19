<script lang="ts">
	import type { Locale } from '$lib/i18n';
	import type { AppItem, Platform } from '$lib/types';

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
</script>

<article class="card group h-full">
	<a
		class="flex flex-col gap-2"
		href={detailHref()}
		aria-label={`${labels.openDetail}: ${app.name}`}
	>
		<div
			class="relative mb-2 flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xs border border-dashed border-border bg-neutral-50 transition-colors group-hover:border-accent/60 group-hover:bg-neutral-100 dark:border-border-dark dark:bg-neutral-900/60 group-hover:dark:border-accent/60 group-hover:dark:bg-neutral-900"
		>
			<img
				src={app.logo}
				alt={`${app.name} logo`}
				class="h-16 w-16 object-contain"
				loading="lazy"
				decoding="async"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<div class="flex items-start justify-between gap-3">
				<h3 class="text-sm leading-tight font-medium text-surface-foreground">
					{app.name}
				</h3>
			</div>

			<p class="text-xs leading-relaxed text-neutral-600">
				{app.summary}
			</p>
		</div>
	</a>
</article>
