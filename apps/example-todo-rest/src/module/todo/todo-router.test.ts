import * as request from 'supertest';

import app from '../../main';

describe('Test todo api', function () {
  test('Should response list todo for api /api/v1/todos', async () => {
    const response = await request(app).get('/api/v1/todos');

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data[0]).toBeInstanceOf(Object);
    expect(typeof response.body.data[0].title).toEqual('string');
    expect(response.statusCode).toEqual(200);
  });

  test('Should response 404 for api /api/v1/todosxxx', async () => {
    const response = await request(app).get('/api/v1/todosxxx');

    expect(response.statusCode).toEqual(404);
  });
});
