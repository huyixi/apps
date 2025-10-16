import { error } from '@sveltejs/kit';
import { fetchApps } from '$lib/data/apps';
import type { AppItem } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const parentData = await parent();
	let allApps: AppItem[];
	try {
		allApps = await fetchApps(fetch);
	} catch (exception) {
		const message = exception instanceof Error ? exception.message : 'Unable to load apps catalogue.';
		throw error(500, message);
	}

	const apps = allApps;

	return {
		apps,
		meta: {
			title: parentData.siteTitle,
			description: parentData.siteDescription
		}
	};
};
