/// attendance

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- Links to your users table
    punch_in_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    punch_out_time TIMESTAMP WITH TIME ZONE,
    date DATE DEFAULT CURRENT_DATE
);