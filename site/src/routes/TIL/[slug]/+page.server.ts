import type { Load } from '@sveltejs/kit';
import { compile } from 'mdsvex';
import { read } from '$app/server';

export const load: Load = async ({ params }) => {
	// const asset = read(`./../../../../../TIL/${params.slug}.md`);
	const asset = read(`/src/routes/TIL/pages/${params.slug}.md`);
	const text = await asset.text();
	const compiledResponse = await compile(text);
	console.log(compiledResponse);

	return { content: compiledResponse?.code };
};
