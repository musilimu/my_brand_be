import crypto from 'crypto'
import { after, before, describe, it } from 'mocha'
import server from '../main.js'
import chai, { expect } from 'chai'
import User from '../src/database/userModal.js'
import Blog from '../src/database/blogsModal.js'

let token, userId
const profile = { phone: '0791160178', address: 'Ngoma - Remera' }

describe('# Testing user routes', () => {
  before((done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'john@gmail.com',
        password: 'lorem12345',
        userName: 'doe' + crypto.randomUUID().substring(0, 20).replaceAll('-', '')
      }).end((err, res) => {
        if (err) console.err(err)

        chai
          .request(server)
          .post('/api/v1/auth/login')
          .send({
            email: 'john@gmail.com',
            password: 'lorem12345'
          })
          .end((err, res) => {
            if (err) console.err(err)
            token = res.body.data.token
            userId = res.body.data._id
            done()
          })
      })
  })
  after(async () => {
    await User.deleteMany()
    await Blog.deleteMany()
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

        expect(res).to.have.status(200)
        expect(res.body).to.an('object')
        expect(res.body).to.have.property('message').to.equal('users delete successfully')
        done()
      })
  })
})
