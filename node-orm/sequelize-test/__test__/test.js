var { should, expect } = require('chai'),
    supertest = require('supertest'),
    api = supertest('http://127.0.0.1:3000');

describe('Students', function() {
    it('should get students', function(done) {
        api
            .get('/api/students')
            .set('Accpect', 'application/json')
            .end(function(err, res) {
                res.body.map((item, i) => {
                    expect(item).to.have.property('name')
                    expect(item).to.have.property('age')
                    expect(item).to.have.property('phone_number')
                    expect(item).to.have.property('grade')
                })
                done()
            })
    })

    it('should create student', function(done) {
        let createName = `测试${new Date().toDateString()}`

        api
            .post('/api/student')
            .set('Accpect', 'application/json')
            .send({
                name: createName,
                age: 18,
                phoneNumber: '11111111111',
                grade: 7
            })
            .end((err, res) => {
                console.log(err)
                should().not.exist(err)
                expect(res.body).to.have.property('id')
                expect(res.body.id).to.not.equal(0)

                const createId = +res.body.id
                return api
                        .get(`/api/student/${createId}`)
                        .set('Accpect', 'application/json')
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).to.have.property('id')
                            expect(res.body.id).to.equal(createId)
                            expect(res.body.name).to.equal(createName)
                            done()
                        })
            })
    })

    // it('update student', function(done) {

    // })

})