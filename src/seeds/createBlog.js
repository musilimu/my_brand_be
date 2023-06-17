import Blog from '../database/blogsModal.js'

export const createBlogSeeding = async ({ author }) => {
  const blog = await Blog.create({
    author,
    title: 'just test',
    banner: 'banner test',
    body: 'welcome to my blog',
    comments: [],
    likes: [],
  })
  return blog
}
