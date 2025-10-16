export type Platform = 'Web apps' | 'iOS apps' | 'android apps' | 'desktop apps';

export interface AppItem {
	id: string;
	slug: string;
	name: string;
	logo: string;
	summary: string;
	description: string;
	website?: string;
	repo?: string;
	tags: string[];
	platforms: Platform[];
	screenshots?: string[];
	weight?: number;
	updatedAt?: string;
}
