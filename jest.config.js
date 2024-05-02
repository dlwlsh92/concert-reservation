const dotenv = require('dotenv');

// 환경 변수 설정을 불러옵니다.
dotenv.config({ path: '.env.local' });

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  verbose: true,
  testEnvironment: 'node',
};
