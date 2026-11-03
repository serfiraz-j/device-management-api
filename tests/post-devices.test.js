
const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

const URL = 'http://[::1]:3000/devices';

function newSerial() {
  return `TEST-${randomUUID().toUpperCase()}`;
}

function validDevice() {
  return {
    name: 'Test Sensoru',
    serialNumber: newSerial(),
    status: 'ACTIVE',
    battery: 50,
    lastSeen: null,
  };
}

async function postDevice(data, expectedStatus, expectedCode) {
  const response = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await response.json();

  assert.equal(response.status, expectedStatus);

  if (expectedStatus === 201) {
    assert.ok(body.id > 0);
    assert.equal(body.serialNumber, data.serialNumber);

    assert.equal(
      response.headers.get('location'),
      `/devices/${body.id}`,
    );
  } else {
    assert.equal(body.error.code, expectedCode);
    assert.equal(body.error.statusCode, expectedStatus);
  }

  return body;
}

test('01 - Gecerli cihaz olusturulur', async () => {
  const data = validDevice();
  const body = await postDevice(data, 201);
  assert.equal(body.name, data.name);
  assert.equal(body.status, 'ACTIVE');
  assert.ok(body.createdAt);
  assert.ok(body.updatedAt);
});

test('02 - Varsayilan status INACTIVE', async () => {
  const data = {
    name: 'Minimal Sensor',
    serialNumber: newSerial(),
  };

  const body = await postDevice(data, 201);
  assert.equal(body.status, 'INACTIVE');
  assert.equal(body.battery, null);
  assert.equal(body.lastSeen, null);
});

test('03 - Battery 0 kabul edilir', async () => {
  const data = { ...validDevice(), battery: 0 };
  const body = await postDevice(data, 201);
  assert.equal(body.battery, 0);
});

test('04 - Battery 100 kabul edilir', async () => {
  const data = { ...validDevice(), battery: 100 };
  const body = await postDevice(data, 201);
  assert.equal(body.battery, 100);
});

test('05 - Battery null kabul edilir', async () => {
  await postDevice({ ...validDevice(), battery: null }, 201);
});

test('06 - Gecerli lastSeen kabul edilir', async () => {
  const date = '2026-11-02T10:00:00Z';
  const body = await postDevice(
    { ...validDevice(), lastSeen: date },
    201,
  );

  assert.equal(body.lastSeen, '2026-11-02T10:00:00.000Z');
});

test('07 - Kisa name reddedilir', async () => {
  await postDevice(
    { ...validDevice(), name: 'AB' },
    400,
    'VALIDATION_ERROR',
  );
});

test('08 - Uzun name reddedilir', async () => {
  await postDevice(
    { ...validDevice(), name: 'A'.repeat(101) },
    400,
    'VALIDATION_ERROR',
  );
});

test('09 - Eksik name reddedilir', async () => {
  const data = validDevice();
  delete data.name;

  await postDevice(data, 400, 'VALIDATION_ERROR');
});

test('10 - Kucuk harfli serial reddedilir', async () => {
  await postDevice(
    { ...validDevice(), serialNumber: 'test-001' },
    400,
    'VALIDATION_ERROR',
  );
});

test('11 - Bosluklu serial reddedilir', async () => {
  await postDevice(
    { ...validDevice(), serialNumber: 'TEST 001' },
    400,
    'VALIDATION_ERROR',
  );
});

test('12 - Eksik serial reddedilir', async () => {
  const data = validDevice();
  delete data.serialNumber;

  await postDevice(data, 400, 'VALIDATION_ERROR');
});

test('13 - Gecersiz status reddedilir', async () => {
  await postDevice(
    { ...validDevice(), status: 'BROKEN' },
    400,
    'VALIDATION_ERROR',
  );
});

test('14 - Battery -1 reddedilir', async () => {
  await postDevice(
    { ...validDevice(), battery: -1 },
    400,
    'VALIDATION_ERROR',
  );
});

test('15 - Battery 101 reddedilir', async () => {
  await postDevice(
    { ...validDevice(), battery: 101 },
    400,
    'VALIDATION_ERROR',
  );
});

test('16 - Ondalikli battery reddedilir', async () => {
  await postDevice(
    { ...validDevice(), battery: 12.5 },
    400,
    'VALIDATION_ERROR',
  );
});

test('17 - Fazladan alan reddedilir', async () => {
  await postDevice(
    { ...validDevice(), admin: true },
    400,
    'VALIDATION_ERROR',
  );
});

test('18 - Duplicate serial 409 dondurur', async () => {
  const data = validDevice();

  await postDevice(data, 201);

  await postDevice(data, 409, 'DUPLICATE_SERIAL_NUMBER');
});
