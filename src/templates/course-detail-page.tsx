import { graphql, PageProps } from "gatsby";
import React from "react";

export default function CourseDetailPage({
	data,
	pageContext,
}: PageProps<Queries.CourseDetailQuery>) {
	return (
		<main>
			<h1>Course detail</h1>
		</main>
	);
}
export const query = graphql`
	query CourseDetail($programCode: String) {
		coursesJson(programCode: { eq: $programCode }) {
			name
		}
	}
`;
