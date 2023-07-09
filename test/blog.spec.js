import chai, { expect } from 'chai'
import crypto from 'crypto'
import { after, before, describe, it } from 'mocha'
import server from '../main.js'
import User from '../src/database/userModal.js'
import { dommyBlog } from '../src/seeds/blog.js'
import Blog from '../src/database/blogsModal.js'
import { STATUSCODE } from '../src/utils/statusCodes.js'
import { Comment } from '../src/database/CommentSchema.js'

let token, blog, comments

describe('# Testing GET /api/v1/blogs/ ', () => {
  before((done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'john@gmail.com',
        password: 'lorem12345',
        userName:
          'doe' + crypto.randomUUID().substring(0, 20).replaceAll('-', ''),
      })
      .end((err, res) => {
        if (err) console.err(err)

        chai
          .request(server)
          .post('/api/v1/auth/login')
          .send({
            email: 'john@gmail.com',
            password: 'lorem12345',
          })
          .end((err, res) => {
            if (err) console.err(err)
            token = res.body.data.token

            done()
          })
      })
  })
  after(async () => {
    await User.deleteMany()
    await Blog.deleteMany()
    await Comment.deleteMany()
  })
  it('admin should be able to post a blogs', (done) => {
    chai
      .request(server)
      .post('/api/v1/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(dommyBlog)
      .end((err, res) => {
        if (err) console.err(err)

        blog = res.body.data
        expect(res).to.have.status(201)
        expect(res.body).to.an('object')
        expect(res.body).to.have.property('data')
        done()
      })
  })

  it('get all blogs', (done) => {
    chai
      .request(server)
      .get('/api/v1/blogs')
      .end((err, res) => {
        if (err) console.err(err)
        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        expect(res.body).to.have.property('data')
        done()
      })
  })
  it('get single blog', (done) => {
    chai
      .request(server)
      .get('/api/v1/blogs/63a154066e166cf15da42031')
      .end((err, res) => {
        if (err) console.err(err)

        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        done()
      })
  })
  it('get all likes for a blog', (done) => {
    chai
      .request(server)
      .get('/api/v1/blogs/63a154066e166cf15da42031/likes')
      .end((err, res) => {
        if (err) console.err(err)
        expect(res).to.have.status(200)
        expect(res.body).to.an('array')
        done()
      })
  })
  it('liking a single blog', (done) => {
    chai
      .request(server)
      .post(`/api/v1/blogs/${blog._id}/likes`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)
        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        done()
      })
  })
  it('should be able to unlike a single blog', (done) => {
    chai
      .request(server)
      .post(`/api/v1/blogs/${blog._id}/likes`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)
        expect(res).to.have.status(STATUSCODE.OK)
        expect(res.body).to.an('object')
        done()
      })
  })
  it('commenting on a single blog', (done) => {
    chai
      .request(server)
      .post(`/api/v1/blogs/${blog._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'testing comment' })
      .end((err, res) => {
        if (err) console.err(err)

        comments = res.body.data.comments[0]
        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        done()
      })
  })
  it('liking a comment of a single blog', (done) => {
    chai
      .request(server)
      .post(`/api/v1/blogs/${comments.blog}/comments/${comments._id}/likes`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'testing comment' })
      .end((err, res) => {
        if (err) console.err(err)
        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        done()
      })
  })
  it('deleting a comment of a single blog', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/blogs/${blog._id}/comments/${comments._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'testing comment' })
      .end((err, res) => {
        if (err) console.err(err)
        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        done()
      })
  })

  it('# Testing PUT /api/v1/blogs:blogid', (done) => {
    chai
      .request(server)
      .put(`/api/v1/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dommyBlog)
      .end((err, res) => {
        if (err) console.err(err)

        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        expect(res.body)
          .to.have.property('message')
          .to.equal('updated a blog successfully')
        done()
      })
  })

  it('# Testing DELETE /api/v1/blogs:blogId', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/blogs/${blog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)

        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        expect(res.body)
          .to.have.property('message')
          .equal('deleted a blog successfully')
        done()
      })
  })
})
