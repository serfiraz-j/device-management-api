
CREATE TABLE devices (

    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name TEXT NOT NULL
        CHECK (char_length(name) BETWEEN 3 AND 100),

    serial_number TEXT NOT NULL UNIQUE
        CHECK (serial_number ~ '^[A-Z0-9-]+$'),

    status TEXT NOT NULL DEFAULT 'INACTIVE'
        CHECK (status IN (
            'ACTIVE',
            'INACTIVE',
            'MAINTENANCE',
            'DECOMMISSIONED'
        )),

    battery INTEGER
        CHECK (battery BETWEEN 0 AND 100),

    last_seen TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_status ON devices(status);

CREATE INDEX idx_devices_last_seen ON devices(last_seen);
