import type { AppItem, Platform } from '$lib/types';

export const platformList: Platform[] = ['Web apps', 'iOS apps', 'android apps', 'desktop apps'];
export const platformSet = new Set<Platform>(platformList);

export const sortApps = (items: AppItem[]) =>
	[...items].sort((a, b) => {
		const weightDelta = (b.weight ?? 0) - (a.weight ?? 0);
		if (weightDelta !== 0) return weightDelta;

		const dateA = a.updatedAt ? Date.parse(a.updatedAt) : 0;
		const dateB = b.updatedAt ? Date.parse(b.updatedAt) : 0;
		if (dateA !== dateB) return dateB - dateA;

		return a.name.localeCompare(b.name, 'en');
	});

export const parsePlatform = (value: string | null): Platform | null => {
	if (!value) return null;
	return platformSet.has(value as Platform) ? (value as Platform) : null;
};

export const collectTags = (items: AppItem[], locale = 'en') =>
	Array.from(new Set(items.flatMap((app) => app.tags))).sort((a, b) => a.localeCompare(b, locale));

export const fetchApps = async (fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) => {
	const response = await fetch('/apps.json');
	if (!response.ok) {
		throw new Error('Unable to load apps catalogue.');
	}
	const items = (await response.json()) as AppItem[];
	return sortApps(items);
};

export const findBySlug = (items: AppItem[], slug: string) => items.find((app) => app.slug === slug);

export const findSimilar = (items: AppItem[], current: AppItem, limit = 6) => {
	const tagSet = new Set(current.tags);

	return items
		.filter((item) => item.id !== current.id && item.tags.some((tag) => tagSet.has(tag)))
		.sort((a, b) => {
			const sharedA = a.tags.filter((tag) => tagSet.has(tag)).length;
			const sharedB = b.tags.filter((tag) => tagSet.has(tag)).length;
			if (sharedA !== sharedB) return sharedB - sharedA;
			return (b.weight ?? 0) - (a.weight ?? 0);
		})
		.slice(0, limit);
};
