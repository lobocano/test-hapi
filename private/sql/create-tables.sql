CREATE TABLE users
(
    username TEXT PRIMARY KEY NOT NULL,
    email TEXT,
    password TEXT,
    displayname TEXT
);

CREATE TABLE comments
(
    commentid SERIAL NOT NULL PRIMARY KEY,
    owner TEXT,
    posttime TIMESTAMP,
    message TEXT,
    parent int,
    CONSTRAINT comments_users_username_fk FOREIGN KEY (owner) REFERENCES users (username)
);