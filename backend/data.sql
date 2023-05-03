\c capstone_2

DROP TABLE IF EXISTS users_lessons;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username TEXT PRIMARY KEY,
    pass_hash TEXT NOT NULL,
    youtube_account TEXT,
    about TEXT
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    creator_username TEXT REFERENCES users ON DELETE CASCADE,
    about TEXT
);

CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    course_id INTEGER REFERENCES courses ON DELETE CASCADE,
    unit_order INTEGER NOT NULL
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    unit_id INTEGER REFERENCES units ON DELETE CASCADE,
    lesson_order INTEGER NOT NULL,
    lesson_type TEXT NOT NULL,
    lesson_url TEXT NOT NULL
);

CREATE TABLE users_lessons (
    id SERIAL PRIMARY KEY,
    user_username TEXT REFERENCES users ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses ON DELETE CASCADE,
    unit_id INTEGER REFERENCES units ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons ON DELETE CASCADE,
    stat TEXT NOT NULL
);