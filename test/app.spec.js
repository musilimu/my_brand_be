import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import server from '../main.js'
import { before, describe, it } from 'mocha'

// const should = chai.should()
let token, blog, comments, userId, message
const profile = { phone: '0791160178', address: 'Ngoma - Remera' }

chai.use(chaiHttp)
describe('# Testing user routes', () => {
  before((done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'john1@gmail.com',
        password: 'lorem12345'
      })
      .end((err, res) => {
        if (err) console.err(err)
        token = res.body.data.token
        userId = res.body.data._id
        done()
      })
  })

  it('get all users', (done) => {
    chai
      .request(server)
      .get('/api/v1/auth/users')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)

        expect(res.body.statusCode).to.equal(200)
        expect(res.body).to.an('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('array')
        done()
      })
  })
  it('get single users', (done) => {
    chai
      .request(server)
      .get(`/api/v1/auth/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)

        expect(res.body.statusCode).to.equal(200)
        expect(res.body).to.an('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('object')
        done()
      })
  })
  it('adding user profile', (done) => {
    chai
      .request(server)
      .put(`/api/v1/auth/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(profile)
      .end((err, res) => {
        if (err) console.err(err)

        expect(res.body.statusCode).to.equal(200)
        expect(res.body).to.an('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('object')
        done()
      })
  })
  it('deleting a single user', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/auth/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)

        expect(res).to.have.status(401)
        expect(res.body).to.an('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.be.a('string')
        done()
      })
  })
})
describe('@# Testing /api/v1/auth/', () => {
  it('posting message', (done) => {
    chai
      .request(server)
      .post('/api/v1/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'muslim',
        email: 'uwimuslim@gmail.dev',
        subject: 'lorem test',
        message: 'reply quickly no dalay man'
      })
      .end((err, res) => {
        if (err) console.err(err)
        message = res.body.data

        expect(res.body.statusCode).to.equal(201)
        res.body.should.be.a('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('object')
        done()
      })
  })

  it('getting messages', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)
        res.should.have.status(200)
        res.body.should.be.a('object')
        expect(res.body).to.have.property('data')
        done()
      })
  })
  it('getting single message', (done) => {
    chai
      .request(server)
      .get(`/api/v1/messages/${message._id}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)
        res.body.should.be.a('object')
        expect(res.body).to.have.property('data')
        done()
      })
  })
  it('deleting single message', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/messages/${message._id}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)
        res.body.should.be.a('object')
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

        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data[0]).to.be.a('object')
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .send({ text: 'testing comment' })
        .end((err, res) => {
          if (err) console.err(err)
          res.should.have.status(200)
          res.body.should.be.a('object')
          done()
        })
    })
    it('# Testing POST /api/v1/blogs/', (done) => {
      // readFile('./test/blog.json', 'utf8', (err, data) => {
      //   if (err) console.error(err)
      //   chai
      //     .request(server)
      //     .post('/api/v1/blogs')
      //     .set('Authorization', `Bearer ${token}`)
      //     .send(JSON.parse(data))
      //     .end((err, res) => {
      //       if (err) console.err(err)

      //       res.should.have.status(401)
      //       res.body.should.be.a('object')
      //       res.body.should.have.property('error')
      //       done()
      //     })
      // })
    })
    it('# Testing PUT /api/v1/blogs:blogid', (done) => {
      // readFile('./test/update_blog_title.json', 'utf8', (err, data) => {
      //   if (err) console.error(err)
      //   chai
      //     .request(server)
      //     .put('/api/v1/blogs/63a154066e166cf15da42031')
      //     .set('Authorization', `Bearer ${token}`)
      //     .send(JSON.parse(data))
      //     .end((err, res) => {
      //       if (err) console.err(err)

      //       res.should.have.status(401)
      //       res.body.should.be.a('object')

      //       res.body.should.have.property('error')
      //       done()
      //     })
      // })
    })

    it('# Testing DELETE /api/v1/blogs:blogId', (done) => {
      chai
        .request(server)
        .delete('/api/v1/blogs/63a154066e166cf15da42031')
        .set('Authorization', `Bearer ${token}`)
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
