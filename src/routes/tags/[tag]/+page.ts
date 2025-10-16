import { error } from '@sveltejs/kit';
import { fetchApps, sortApps } from '$lib/data/apps';
import type { AppItem } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const parentData = await parent();
	let allApps: AppItem[];

	try {
		allApps = await fetchApps(fetch);
	} catch (exception) {
		const message = exception instanceof Error ? exception.message : 'Unable to load apps catalogue.';
		throw error(500, message);
	}

	const tag = decodeURIComponent(params.tag);
	const tagged = allApps.filter((app) => app.tags.includes(tag));
	const apps = sortApps(tagged);

	return {
		tag,
		apps,
		meta: {
			title: `${parentData.dictionary.tagsPage.heading} #${tag} · ${parentData.siteTitle}`,
			description: `${parentData.dictionary.tagsPage.description} #${tag}`
		}
	};
};
