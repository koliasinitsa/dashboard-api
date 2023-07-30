import { App } from "../src/app";
import { boot } from "../src/main";
import request from 'supertest';

let application : App;

beforeAll(async() => {
    const { app } = await boot;
    application = app;
    
});

describe('Users e2e', ()=> {
    it('Register - error', async () => {
        const res = await request(application.app)
        .post('/users/register')
        .send({email: 'a@a.ru', password: '1'});
        expect(res.statusCode).toBe(422);
    });

    it('login - success', async () => {
        const res = await request(application.app)
        .post('/users/login')
        .send({email: 'nik@111.ru', password: '1234'});
        expect(res.body.jwt).not.toBeUndefined();
    });

    // dont work - disconect to db???
    it('login - error', async () => {
        const res = await request(application.app)
        .post('/users/login')
        .send({email: 'nik@111.ru', password: '12fbvdfbdfb34'});
        expect(res.statusCode).toBe(401);
    });

    it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: "kolia@1.ru", password: '1234' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('kolia@1.ru');
	});

    // it('info - success', async () => {
    //     const login = await request(application.app)
    //     .post('/users/login')
    //     .send({email: "kolia@1.ru", password: '1234'});
    //     const res = await request(application.app)
    //     .get('/users/info')
    //     .set('Authorization', `bearer ${login.body.jwt}`)
    //     expect(res.body.email).toBe("kolia@1.ru");
    // });

    it('info - error', async () => {
        const res = await request(application.app)
        .get('/users/info')
        .set('Authorization', `bearer 1`)
        expect(res.statusCode).toBe(401);
    });
    
});



afterAll(() => {
	application.close();
});
