import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import server from '../main.js'
import { readFile } from 'fs'
import { describe, it } from 'mocha'

const should = chai.should()
let token, user, blog, comments, userId
const profile = {
  phone: '0791160178',
  address: 'Ngoma - Remera'
}

chai.use(chaiHttp)
describe('@# Testing /api/v1/auth/', () => {
  it('signup the user', (done) => {
    user = {
      email: `johnd${Math.floor(Math.random() * 1000)}@gmail.com`,
      password: 'lorem12345',
      userName: `doed${Math.floor(Math.random() * 1000)}`
    }
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        if (err) console.err(err)

        res.should.have.status(201)
        res.body.should.be.a('object')
        done()
      })
  })
  it('login the user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: user.email,
        password: user.password
      })
      .end((err, res) => {
        if (err) console.err(err)
        res.should.have.status(200)
        res.body.should.be.a('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('object')
        token = res.body.data.token
        userId = res.body.data._id
        done()
      })
  })
  it('get all users', (done) => {
    chai
      .request(server)
      .get('/api/v1/auth/users')
      .set(
        'Authorization',
        `Bearer ${token}`
      )
      .end((err, res) => {
        if (err) console.err(err)

        res.should.have.status(200)
        res.body.should.be.a('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('array')
        done()
      })
  })
  it('get single users', (done) => {
    chai
      .request(server)
      .get(`/api/v1/auth/users/${userId}`)
      .set(
        'Authorization',
        `Bearer ${token}`
      )
      .end((err, res) => {
        if (err) console.err(err)

        res.should.have.status(200)
        res.body.should.be.a('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('object')
        done()
      })
  })
  it('adding user profile', (done) => {
    chai
      .request(server)
      .put(`/api/v1/auth/users/${userId}`)
      .set(
        'Authorization',
        `Bearer ${token}`
      ).send(profile)
      .end((err, res) => {
        if (err) console.err(err)

        res.should.have.status(200)
        res.body.should.be.a('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('object')
        done()
      })
  })
  it('deleting a single user', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/auth/users/${userId}`)
      .set(
        'Authorization',
        `Bearer ${token}`
      )
      .end((err, res) => {
        if (err) console.err(err)

        res.should.have.status(401)
        res.body.should.be.a('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.be.a('string')
        done()
      })
  })
})

describe('@# test server', () => {
  describe('# Testing GET /api/v1/blogs/ ', () => {
    it('get all blogs', (done) => {
      chai
        .request(server)
        .get('/api/v1/blogs')
        .end((err, res) => {
          if (err) console.err(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('data')
          blog = res.body.data[0]
          res.body.should.be.a('object')
          done()
        })
    })
    it('get single blog', (done) => {
      chai
        .request(server)
        .get('/api/v1/blogs/63a154066e166cf15da42031')
        .end((err, res) => {
          if (err) console.err(err)

          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    it('get all likes for a blog', (done) => {
      chai
        .request(server)
        .get('/api/v1/blogs/63a154066e166cf15da42031/likes')
        .end((err, res) => {
          if (err) console.err(err)
          res.should.have.status(200)
          res.body.should.be.a('array')
          done()
        })
    })
    it('liking a single blog', (done) => {
      chai
        .request(server)
        .post(`/api/v1/blogs/${blog._id}/likes`)
        .set(
          'Authorization',
          `Bearer ${token}`
        )
        .end((err, res) => {
          if (err) console.err(err)

          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    it('commenting on a single blog', (done) => {
      chai
        .request(server)
        .post(`/api/v1/blogs/${blog._id}/comments`)
        .set(
          'Authorization',
          `Bearer ${token}`
        )
        .send({ text: 'testing comment' })
        .end((err, res) => {
          if (err) console.err(err)
          comments = res.body.data.comments[0]
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    it('liking a comment of a single blog', (done) => {
      chai
        .request(server)
        .post(`/api/v1/blogs/${blog._id}/comments/${comments._id}/likes`)
        .set(
          'Authorization',
          `Bearer ${token}`
        )
        .send({ text: 'testing comment' })
        .end((err, res) => {
          if (err) console.err(err)
          comments = res.body.data.comments[0]
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    it('deleting a comment of a single blog', (done) => {
      chai
        .request(server)
        .delete(`/api/v1/blogs/${blog._id}/comments/${comments._id}`)
        .set(
          'Authorization',
          `Bearer ${token}`
        )
        .send({ text: 'testing comment' })
        .end((err, res) => {
          if (err) console.err(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    it('# Testing POST /api/v1/blogs/', (done) => {
      readFile('./test/blog.json', 'utf8', (err, data) => {
        if (err) console.log(err)
        chai
          .request(server)
          .post('/api/v1/blogs')
          .set(
            'Authorization',
            `Bearer ${token}`
          )
          .send(JSON.parse(data))
          .end((err, res) => {
            if (err) console.err(err)

            res.should.have.status(401)
            res.body.should.be.a('object')
            res.body.should.have.property('error')
            done()
          })
      })
    })
    it('# Testing PUT /api/v1/blogs:blogid', (done) => {
      readFile('./test/update_blog_title.json', 'utf8', (err, data) => {
        if (err) console.log(err)
        chai
          .request(server)
          .put('/api/v1/blogs/63a154066e166cf15da42031')
          .set(
            'Authorization',
            `Bearer ${token}`
          )
          .send(JSON.parse(data))
          .end((err, res) => {
            if (err) console.err(err)

            res.should.have.status(401)
            res.body.should.be.a('object')

            res.body.should.have.property('error')
            done()
          })
      })
    })

    it('# Testing DELETE /api/v1/blogs:blogId', (done) => {
      chai
        .request(server)
        .delete('/api/v1/blogs/63a154066e166cf15da42031')
        .set(
          'Authorization',
          `Bearer ${token}`
        )
        .end((err, res) => {
          if (err) console.err(err)

          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have
            .property('message')
            .eql('only admin can delete a blog')
          res.body.should.have.property('message')
          done()
        })
    })
  })
})
