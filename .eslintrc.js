module.exports = {
  parser: '@typescript-eslint/parser', // TypeScript 파서를 지정
  extends: [
    'eslint:recommended', // ESLint의 기본 규칙 세트
    'plugin:@typescript-eslint/recommended', // TypeScript 규칙 세트
  ],
  parserOptions: {
    ecmaVersion: 2020, // 최신 ECMAScript 기능 사용
    sourceType: 'module', // 모듈 시스템 사용
  },
  rules: {
    // 프로젝트에 맞게 규칙을 추가하거나 변경
    indent: ['error', 2], // 들여쓰기는 공백 2칸
    'linebreak-style': ['error', 'unix'], // 줄바꿈은 Unix 스타일
    quotes: ['error', 'single'], // 따옴표는 싱글 쿼트 사용
    semi: ['error', 'always'], // 세미콜론은 항상 사용
  },
  env: {
    es6: true, // ES6 환경에서 실행됨을 명시
    node: true, // Node.js 환경에서 실행됨을 명시
  },
};
