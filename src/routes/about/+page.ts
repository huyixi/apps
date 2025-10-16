import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const parentData = await parent();
	return {
		meta: {
			title: `${parentData.dictionary.nav.about} · ${parentData.siteTitle}`,
			description: parentData.dictionary.aboutPage.intro
		}
	};
};
