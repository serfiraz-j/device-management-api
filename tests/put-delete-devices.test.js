const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

const BASE_URL =
  process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
  
function newDevice() {
  return {
    name: 'Test Sensoru',
    serialNumber: `TEST-${randomUUID().toUpperCase()}`,
    status: 'ACTIVE',
    battery: 80,
    lastSeen: null,
  };
}

async function createDevice() {
  const response = await fetch(`${BASE_URL}/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDevice()),
  });

  assert.equal(response.status, 201);
  return response.json();
}

async function putDevice(id, data) {
  return fetch(`${BASE_URL}/devices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function getDevice(id) {
  return fetch(`${BASE_URL}/devices/${id}`);
}

async function cleanup(id) {
  if (id !== undefined) {
    await fetch(`${BASE_URL}/devices/${id}`, {
      method: 'DELETE',
    });
  }
}

test('01 - PUT cihazi gunceller', async () => {
  const device = await createDevice();

  try {
    const response = await putDevice(device.id, {
      name: 'Guncellenmis Sensor',
      serialNumber: device.serialNumber,
      status: 'MAINTENANCE',
      battery: 40,
      lastSeen: null,
    });

    assert.equal(response.status, 200);

    const updated = await response.json();

    assert.equal(updated.id, device.id);
    assert.equal(updated.name, 'Guncellenmis Sensor');
    assert.equal(updated.status, 'MAINTENANCE');
    assert.equal(updated.battery, 40);

    const getResponse = await getDevice(device.id);
    assert.equal(getResponse.status, 200);

    const saved = await getResponse.json();
    assert.equal(saved.battery, 40);
  } finally {
    await cleanup(device.id);
  }
});

test('02 - PUT updatedAt alanini yeniler', async () => {
  const device = await createDevice();

  try {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await putDevice(device.id, {
      name: 'Tarih Test Sensoru',
      serialNumber: device.serialNumber,
      status: 'INACTIVE',
      battery: 25,
      lastSeen: null,
    });

    assert.equal(response.status, 200);

    const updated = await response.json();

    assert.equal(updated.createdAt, device.createdAt);

    assert.ok(Date.parse(updated.updatedAt) > Date.parse(device.updatedAt));
  } finally {
    await cleanup(device.id);
  }
});

test('03 - Eksik PUT verisi reddedilir', async () => {
  const response = await putDevice(1, {
    name: 'Eksik Sensor',
  });

  assert.equal(response.status, 400);

  const body = await response.json();
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});

test('04 - Gecersiz PUT ID reddedilir', async () => {
  const response = await putDevice('abc', newDevice());

  assert.equal(response.status, 400);

  const body = await response.json();
  assert.equal(body.error.code, 'INVALID_ID');
});

test('05 - Olmayan cihaza PUT 404 dondurur', async () => {
  const response = await putDevice(2147483647, newDevice());

  assert.equal(response.status, 404);

  const body = await response.json();
  assert.equal(body.error.code, 'DEVICE_NOT_FOUND');
});

test('06 - PUT duplicate serial 409 dondurur', async () => {
  const first = await createDevice();
  let second;

  try {
    second = await createDevice();

    const response = await putDevice(second.id, {
      name: 'Cakisan Sensor',
      serialNumber: first.serialNumber,
      status: 'ACTIVE',
      battery: 50,
      lastSeen: null,
    });

    assert.equal(response.status, 409);

    const body = await response.json();
    assert.equal(body.error.code, 'DUPLICATE_SERIAL_NUMBER');
  } finally {
    await cleanup(first.id);
    await cleanup(second?.id);
  }
});

test('07 - DELETE 204 ve GET 404 dondurur', async () => {
  const device = await createDevice();

  try {
    const response = await fetch(`${BASE_URL}/devices/${device.id}`, { method: 'DELETE' });

    assert.equal(response.status, 204);

    assert.equal(await response.text(), '');

    const getResponse = await getDevice(device.id);
    assert.equal(getResponse.status, 404);
  } finally {
    await cleanup(device.id);
  }
});

test('08 - DELETE hatali ID kontrolu', async () => {
  const missing = await fetch(`${BASE_URL}/devices/2147483647`, { method: 'DELETE' });

  assert.equal(missing.status, 404);

  const missingBody = await missing.json();
  assert.equal(missingBody.error.code, 'DEVICE_NOT_FOUND');

  const invalid = await fetch(`${BASE_URL}/devices/abc`, { method: 'DELETE' });

  assert.equal(invalid.status, 400);

  const invalidBody = await invalid.json();
  assert.equal(invalidBody.error.code, 'INVALID_ID');
});
