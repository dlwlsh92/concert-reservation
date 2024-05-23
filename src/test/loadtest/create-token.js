import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 1500 },
    { duration: '3m', target: 1500 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<500', 'p(50)<250'],
  },
};

export default function () {
  // 토큰 생성
  let createResponse = http.post('http://localhost:3000/reservations/token');
  check(createResponse, {
    'created token successfully': (r) => r.status === 201,
  });
  let token = createResponse.body;

  let validateResponse = http.get(
    `http://localhost:3000/reservations/token/validation?token=${token}`,
  );
  if (validateResponse.status !== 200) {
    console.error(
      `Error: Received status code ${validateResponse.status} with message: ${validateResponse.body}`,
    );
  }
  check(validateResponse, {
    'token validation status 200': (r) => r.status === 200,
  });

  sleep(0.5);
}
