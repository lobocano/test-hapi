DROP TABLE comments;
DROP TABLE users;
CREATE TABLE users
(
    userid SERIAL NOT NULL PRIMARY KEY,
    email TEXT,
    password TEXT,
    displayname TEXT
);
CREATE UNIQUE INDEX users_email_uindex ON public.users (email);

CREATE TABLE comments
(
    commentid SERIAL NOT NULL PRIMARY KEY,
    owner int,
    posttime TIMESTAMP,
    message TEXT,
    parent int,
    CONSTRAINT comments_users_username_fk FOREIGN KEY (owner) REFERENCES users (userid)
);
CREATE TABLE tests
(
    commentid SERIAL NOT NULL PRIMARY KEY,
    owner int,
    posttime TIMESTAMP,
    message TEXT,
    parent int,
    CONSTRAINT comments_users_username_fk FOREIGN KEY (owner) REFERENCES users (userid)
);