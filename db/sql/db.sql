/*
    PostgreSQL Database Design for Notuno

    NOTE: Foreign keys are commented out in 
    create table statements and are instead
    added at the bottom of the document.

    Shane W. (qherm)
*/

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS game_users CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS game_cards CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS "CARDS" CASCADE;
DROP TABLE IF EXISTS "SequelizeMeta" CASCADE;
DROP TABLE IF EXISTS test_table CASCADE;
DROP TYPE IF EXISTS colors;

-- CREATE TYPE colors AS ENUM ('red', 'yellow', 'green', 'blue', 'Wild');

-- CREATE TABLE cards(
--     id INT,
--     color colors, 
--     displayname VARCHAR(255) NOT NULL,
--     PRIMARY KEY (id)
-- );

-- CREATE TABLE users(
--     id INT NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     passwd VARCHAR(255),
--     displayname VARCHAR(255) NOT NULL UNIQUE,
--     PRIMARY KEY (id)
-- );

-- CREATE TABLE game_users(
--     game_id INT,
--     user_id INT NOT NULL UNIQUE,
--     current_player BOOLEAN,
--     ordr INT  /* 'order' is a reserved word so I removed the 'e'*/ 
--     -- FOREIGN KEY (user_id) REFERENCES users(id),
--     -- FOREIGN KEY (game_id) REFERENCES games(id)
-- );

-- CREATE TABLE games(
--     id INT NOT NULL,
--     direction INT,
--     winner INT,
--     PRIMARY KEY (id)
--     -- FOREIGN KEY (winner) REFERENCES game_users(user_id)
-- );

-- CREATE TABLE game_cards(
--     game_id INT,
--     card_id INT,
--     user_id INT NOT NULL UNIQUE,
--     ordr INT,
--     discarded BOOLEAN,
--     draw_pile BOOLEAN
--     -- FOREIGN KEY (user_id) REFERENCES users(id),
--     -- FOREIGN KEY (card_id) REFERENCES cards(id),
--     -- FOREIGN KEY (game_id) REFERENCES games(id)
-- );

-- /*
--     Add foreign keys:
-- */

-- ALTER TABLE game_cards 
--     ADD CONSTRAINT fk_game_cards_users 
--     FOREIGN KEY (user_id) 
--     REFERENCES users(id)
--     ON DELETE CASCADE;
-- ALTER TABLE game_cards
--     ADD CONSTRAINT fk_game_cards_cards 
--     FOREIGN KEY (card_id) 
--     REFERENCES cards(id)
--     ON DELETE CASCADE;
-- ALTER TABLE game_cards
--     ADD CONSTRAINT fk_game_cards_games 
--     FOREIGN KEY (game_id) 
--     REFERENCES games(id)
--     ON DELETE CASCADE;
-- ALTER TABLE game_users 
--     ADD CONSTRAINT fk_game_users_users 
--     FOREIGN KEY (user_id) 
--     REFERENCES users(id)
--     ON DELETE CASCADE;
-- ALTER TABLE game_users
--     ADD CONSTRAINT fk_game_users_games 
--     FOREIGN KEY (game_id) 
--     REFERENCES games(id)
--     ON DELETE CASCADE;
-- ALTER TABLE games
--     ADD CONSTRAINT fk_games_game_users 
--     FOREIGN KEY (winner) 
--     REFERENCES game_users(user_id)
--     ON DELETE CASCADE;
