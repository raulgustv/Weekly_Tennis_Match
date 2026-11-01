import {jest, test} from '@jest/globals'
import request from 'supertest'

process.env.JWT_SECRET = 'SECRET_FOR_TEST';

const EMAIL = 'raul@test.com';
const CORRECT_PASSWORD = 'Correct123'


const fake_user = {
    _id: 'abc12',
    email: EMAIL,
    role: 'player',
    isActive: true, 
    provider: 'local',
    password: 'fake-hash',
    loginAttempts: 0,
    lockUntil: null,
    sessions: [],
    comparePassword: async(attempt) => attempt === CORRECT_PASSWORD,
    save: async() => {},
}


const fakeUser = {
    findOne: ({email}) => ({
        select: () => Promise.resolve(email === EMAIL ? fake_user : null)
    }),
    findById: () => ({
        select: () => Promise.resolve({_id: 'abc123', email: EMAIL})
    })
}

jest.unstable_mockModule('../models/user.js', () => ({default: fakeUser}))
jest.unstable_mockModule('../config/firebase.js', () => ({ default: {} }));

// La app se importa DESPUÉS de definir los reemplazos
const { default: app } = await import('../app.js')


//-------------COMPROBACION-------------
test('login con credenciales devuelve 200 y un token', async() => {
    const res = await request(app)
        .post('/api/user/login')
        .send({email: EMAIL, password: CORRECT_PASSWORD})

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined();
})

test('login con credenciales incorrectos 401 y sin token', async() => {
    const res = await request(app)
        .post('/api/user/login')
        .send({email: EMAIL, password: 'wrong_pass'})

    expect(res.status).toBe(401)
    expect(res.body.accessToken).toBeUndefined();
})