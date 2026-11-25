/** True on the dev server. Kept out of .astro frontmatter: Vite's dev transform crashes on
 *  `import.meta.env` there ("Cannot split a chunk that has already been edited"). */
export const isDev: boolean = import.meta.env.DEV;
