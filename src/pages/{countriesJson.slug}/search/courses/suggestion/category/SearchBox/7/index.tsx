import React, { useState } from "react";
import type { PageProps } from "gatsby";

export default function SearchResult({ location }: PageProps) {
	const [params, setParams] = useState(location.search);
	return (
		<main>
			<h1>Search result</h1>
		</main>
	);
}
export async function getServerData(props) {
	console.log("props", props);
	try {
		const res = await fetch(`https://dog.ceo/api/breeds/image/random`);

		if (!res.ok) {
			throw new Error(`Response failed`);
		}

		return {
			props: await res.json(),
		};
	} catch (error) {
		return {
			status: 500,
			headers: {},
			props: {},
		};
	}
}
