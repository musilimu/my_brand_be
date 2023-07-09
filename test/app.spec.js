import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import server from '../main.js'
import { after, before, describe, it } from 'mocha'
import crypto from 'crypto'
import User from '../src/database/userModal.js'

let token, message

chai.use(chaiHttp)

describe('Testing /api/v1/auth/ message routes', () => {
  before((done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'john1@gmail.com',
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
            email: 'john1@gmail.com',
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
        if (err) console.err(err)
        message = res.body.data

        expect(res.body.statusCode).to.equal(201)
        expect(res.body).to.an('object')
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
        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
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
        expect(res.body).to.an('object')
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
        expect(res.body).to.an('object')
        done()
      })
  })
  it('should handle unfound routes', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/rand/${message._id}/random`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) console.err(err)
        expect(res).to.have.status(404)
        done()
      })
  })
})
