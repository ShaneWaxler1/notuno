--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: colors; Type: TYPE; Schema: public; Owner: anthonyborges
--

CREATE TYPE public.colors AS ENUM (
    'red',
    'yellow',
    'green',
    'blue'
);


ALTER TYPE public.colors OWNER TO anthonyborges;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cards; Type: TABLE; Schema: public; Owner: ajwc
--

CREATE TABLE public.cards (
    id integer,
    color character varying(255) NOT NULL,
    displayName character varying(255) NOT NULL
);


ALTER TABLE public.cards OWNER TO anthonyborges;

--
-- Name: cards_id_seq; Type: SEQUENCE; Schema: public; Owner: anthonyborges
--

CREATE SEQUENCE public.cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cards_id_seq OWNER TO anthonyborges;

--
-- Name: cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anthonyborges
--

ALTER SEQUENCE public.cards_id_seq OWNED BY public.cards.id;


--
-- Name: game_cards; Type: TABLE; Schema: public; Owner: anthonyborges
--

CREATE TABLE public.game_cards (
    game_id integer,
    card_id integer,
    user_id integer NOT NULL,
    ordr integer,
    discarded boolean,
    draw_pile boolean
);


ALTER TABLE public.game_cards OWNER TO anthonyborges;

--
-- Name: game_users; Type: TABLE; Schema: public; Owner: anthonyborges
--

CREATE TABLE public.game_users (
    game_id integer,
    user_id integer NOT NULL,
    current_player boolean,
    ordr integer
);


ALTER TABLE public.game_users OWNER TO anthonyborges;

--
-- Name: games; Type: TABLE; Schema: public; Owner: anthonyborges
--

CREATE TABLE public.games (
    id integer,
    direction integer,
    winner integer
);


ALTER TABLE public.games OWNER TO anthonyborges;

--
-- Name: users; Type: TABLE; Schema: public; Owner: ajwc
--

CREATE TABLE public.users (
    id integer,
    email character varying(255) NOT NULL,
    passwd character varying(255) NOT NULL,
    displayName character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO anthonyborges;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: anthonyborges
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO anthonyborges;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anthonyborges
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

--
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.cards_id_seq'::regclass);

--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- Name: game_cards game_cards_user_id_key; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.game_cards
    ADD CONSTRAINT game_cards_user_id_key UNIQUE (user_id);


--
-- Name: game_users game_users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.game_users
    ADD CONSTRAINT game_users_user_id_key UNIQUE (user_id);


--
-- Name: games games_id_pk; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_id_pk PRIMARY KEY (id);

--
-- Name: users users_displayName_key; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_displayName_key" UNIQUE (displayName);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_id_pk; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_pk PRIMARY KEY (id);


--
-- Name: game_cards game_cards_card_id_cards_fk; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.game_cards
    ADD CONSTRAINT game_cards_card_id_cards_fk FOREIGN KEY (card_id) REFERENCES public.cards(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: game_cards game_cards_game_id_games_fk; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.game_cards
    ADD CONSTRAINT game_cards_game_id_games_fk FOREIGN KEY (game_id) REFERENCES public.games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: game_cards game_cards_user_id_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.game_cards
    ADD CONSTRAINT game_cards_user_id_users_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: game_users game_users_game_id_games_fk; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.game_users
    ADD CONSTRAINT game_users_game_id_games_fk FOREIGN KEY (game_id) REFERENCES public.games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: game_users game_users_user_id_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.game_users
    ADD CONSTRAINT game_users_user_id_users_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: games games_winner_game_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_winner_game_users_fk FOREIGN KEY (winner) REFERENCES public.game_users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

