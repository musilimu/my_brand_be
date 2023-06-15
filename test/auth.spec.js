describe('@# Testing /api/v1/auth/', () => {
    let user
    it('signup the user', (done) => {
        user = { email: `john@gmail.com`, password: 'lorem12345', userName: `doe` }
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
                // token = res.body.data.token
                // userId = res.body.data._id
                done()
            })
    })

})