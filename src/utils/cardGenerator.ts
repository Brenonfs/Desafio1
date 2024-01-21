import faker from 'faker';

export function generateCardNumber() {
  return Array.from({ length: 19 }, () => faker.random.number({ min: 0, max: 9 }))
    .join('')
    .toString();
}

export function generateCardVerificationCode() {
  return Array.from({ length: 3 }, () => faker.random.number({ min: 0, max: 9 }))
    .join('')
    .toString();
}
