import type { GatsbyNode } from "gatsby";
const path = require("path");
/** sourceNodes is how you can fetch nodes from remote sources and add it to the GraphQL data layer */

/** createResolvers allows you to form relationships between two nodes */
export const createResolvers: GatsbyNode["createResolvers"] = ({
	createResolvers,
}) => {
	const resolvers = {
		CountriesJson: {
			schools: {
				type: ["SchoolsJson"],
				resolve: async (source, args, context, info) => {
					const { entries } = await context.nodeModel.findAll({
						query: {
							filter: {
								slug: { in: source.school_slugs },
							},
						},
						type: "SchoolsJson",
					});
					return entries;
				},
			},
		},
		SchoolsJson: {
			courses: {
				type: ["CoursesJson"],
				resolve: async (source, args, context, info) => {
					const { entries } = await context.nodeModel.findAll({
						query: {
							filter: {
								programCode: { in: source.course_codes },
							},
						},
						type: "CoursesJson",
					});
					return entries;
				},
			},
		},
	};
	createResolvers(resolvers);
};
export const createPages: GatsbyNode["createPages"] = async ({
	graphql,
	actions,
	reporter,
}) => {
	const { createPage } = actions;

	// Query for markdown nodes to use in creating pages.
	const result = await graphql(
		`
			query allCountries {
				allCountriesJson {
					edges {
						node {
							slug
							schools {
								slug
								courses {
									slug
									programCode
								}
							}
						}
					}
				}
			}
		`
	);

	// Handle errors
	if (result.errors) {
		reporter.panicOnBuild(`Error while running GraphQL query.`);
		return;
	}

	const template = path.resolve(`src/templates/course-detail-page.tsx`);
	// Create pages for each country.
	result.data.allCountriesJson.edges.forEach(({ node }) => {
		const { slug, schools } = node;
		schools.forEach((school) => {
			school.courses.forEach((course) => {
				const path = `/${slug}/categories/${school.slug}/${course.slug}/p/${course.programCode}/`;
				createPage({
					path,
					component: template,
					context: {
						programCode: course.programCode,
					},
				});
			});
		});
	});
};
