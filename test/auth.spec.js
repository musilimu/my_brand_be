import server from '../main.js'
import chai, { expect } from 'chai'
import { describe, it, after } from 'mocha'
import crypto from 'crypto'
import chaiHttp from 'chai-http'
import User from '../src/database/userModal.js'

chai.use(chaiHttp)

describe('# Testing authentication routes', () => {
  let user
  after(async () => {
    await User.deleteMany()
  })
  it('should signup the user successfully', (done) => {
    user = { email: crypto.randomUUID() + 'john@gmail.com', password: 'lorem12345', userName: 'doe' + crypto.randomUUID().substring(0, 20).replaceAll('-', '') }

    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        if (err) console.err(err)

        expect(res.body).to.be.an('object')
        expect(res.body.statusCode).to.equal(201)
        expect(res.body).to.have.property('message').to.equal('user account created successfully')
        done()
      })
  })
  it('login the user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        if (err) console.err(err)

        expect(res.body).to.be.an('object')
        expect(res.body.statusCode).to.equal(200)
        expect(res.body.data).to.have.property('token')
        done()
      })
  })
})
