import crypto from 'crypto'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import server from '../main.js'
import { after, before, describe, it } from 'mocha'
import User from '../src/database/userModal.js'
import Blog from '../src/database/blogsModal.js'

let token, message
chai.use(chaiHttp)

describe('# Testing /api/v1/auth/', () => {
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
            // userId = res.body.data._id
            done()
          })
      })
  })
  after(async () => {
    await User.deleteMany()
    await Blog.deleteMany()
  })
  it('posting message', (done) => {
    chai
      .request(server)
      .post('/api/v1/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'muslim',
        email: 'uwimuslim@gmail.dev',
        subject: 'lorem test',
        message: 'reply quickly no dalay man',
      })
      .end((err, res) => {
        if (err) console.error(err)

        message = res.body.data._id
        expect(res).to.have.status(201)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.an('object')
        done()
      })
  })

  it('getting all messages', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.error(err)

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.an('array')
        done()
      })
  })

  it('getting a single message', (done) => {
    chai
      .request(server)
      .get(`/api/v1/messages/${message}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.error(err)

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('data')
        done()
      })
  })

  it('updating a single message', (done) => {
    chai
      .request(server)
      .put(`/api/v1/messages/${message}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'uwi',
        email: 'uwi@gmail.com',
        subject: 'help on bug',
        message: 'help on bug fix',
      })
      .end((err, res) => {
        if (err) console.error(err)

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.an('object')
        done()
      })
  })

  it('deleting a single message', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/messages/${message}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.error(err)

        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('message')
        expect(res.body.message).to.be.a('string')
        done()
      })
  })
})
