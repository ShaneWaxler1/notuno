--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

--
<<<<<<< HEAD
-- Name: colors; Type: TYPE; Schema: public; Owner: shanewaxler
=======
-- Name: colors; Type: TYPE; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS "SequelizeMeta" CASCADE;
DROP TABLE IF EXISTS test_table CASCADE;
DROP TABLE IF EXISTS game_users CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS game_cards CASCADE;
DROP TABLE IF EXISTS "cards" CASCADE;
DROP TYPE IF EXISTS colors;

CREATE TYPE public.colors AS ENUM (
    'red',
    'yellow',
    'green',
    'blue',
    'wild'
);


<<<<<<< HEAD
-- ALTER TYPE public.colors OWNER TO shanewaxler;
=======
ALTER TYPE public.colors OWNER TO anthonyborges;
>>>>>>> d1cf2e0 (pushing registration db fix)

SET default_tablespace = '';

SET default_table_access_method = heap;

-- CREATE SEQUENCE public."CARDS_id_seq"
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER TABLE public."CARDS_id_seq" OWNER TO shanewaxler;

--
<<<<<<< HEAD
-- Name: CARDS_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shanewaxler
=======
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

-- ALTER SEQUENCE public."CARDS_id_seq" OWNED BY public."CARDS".id;

<<<<<<< HEAD

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: shanewaxler
=======
ALTER TABLE public."SequelizeMeta" OWNER TO anthonyborges;

--
-- Name: cards; Type: TABLE; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);

CREATE TABLE public.cards (
    id integer NOT NULL,
    color character varying(255) NOT NULL,
    displayname character varying(255) NOT NULL
);


<<<<<<< HEAD
-- ALTER TABLE public.cards OWNER TO shanewaxler;

--
-- Name: cards_id_seq; Type: SEQUENCE; Schema: public; Owner: shanewaxler
=======
ALTER TABLE public.cards OWNER TO anthonyborges;

--
-- Name: game_cards; Type: TABLE; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

CREATE SEQUENCE public.cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cards_id_seq OWNED BY public.cards.id;


CREATE TABLE public.game_cards (
    game_id integer,
    card_id integer,
    user_id integer NOT NULL,
    ordr integer,
    discarded boolean,
    draw_pile boolean
);


<<<<<<< HEAD
=======
ALTER TABLE public.game_cards OWNER TO anthonyborges;

--
-- Name: game_users; Type: TABLE; Schema: public; Owner: anthonyborges
--

>>>>>>> d1cf2e0 (pushing registration db fix)
CREATE TABLE public.game_users (
    game_id integer,
    user_id integer NOT NULL,
    current_player boolean,
    ordr integer
);

<<<<<<< HEAD
CREATE TABLE public.games (
    id integer NOT NULL,
    direction boolean,
=======

ALTER TABLE public.game_users OWNER TO anthonyborges;

--
-- Name: games; Type: TABLE; Schema: public; Owner: anthonyborges
--

CREATE TABLE public.games (
    id integer,
    direction integer,
>>>>>>> d1cf2e0 (pushing registration db fix)
    winner integer
);


<<<<<<< HEAD
-- ALTER TABLE public.games OWNER TO shanewaxler;

--
-- Name: test_table; Type: TABLE; Schema: public; Owner: shanewaxler
=======
ALTER TABLE public.games OWNER TO anthonyborges;

--
-- Name: test_table; Type: TABLE; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

CREATE TABLE public.test_table (
    id integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "testString" character varying(255) NOT NULL
);


<<<<<<< HEAD
-- ALTER TABLE public.test_table OWNER TO shanewaxler;

--
-- Name: test_table_id_seq; Type: SEQUENCE; Schema: public; Owner: shanewaxler
=======
ALTER TABLE public.test_table OWNER TO anthonyborges;

--
-- Name: test_table_id_seq; Type: SEQUENCE; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

CREATE SEQUENCE public.test_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


<<<<<<< HEAD
-- ALTER TABLE public.test_table_id_seq OWNER TO shanewaxler;

--
-- Name: test_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shanewaxler
=======
ALTER TABLE public.test_table_id_seq OWNER TO anthonyborges;

--
-- Name: test_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER SEQUENCE public.test_table_id_seq OWNED BY public.test_table.id;


--
<<<<<<< HEAD
-- Name: users; Type: TABLE; Schema: public; Owner: shanewaxler
=======
-- Name: users; Type: TABLE; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    passwd character varying(255) NOT NULL,
    displayname character varying(255) NOT NULL
);


<<<<<<< HEAD
-- ALTER TABLE public.users OWNER TO shanewaxler;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: shanewaxler
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.users_id_seq OWNER TO shanewaxler;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: shanewaxler
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: CARDS id; Type: DEFAULT; Schema: public; Owner: shanewaxler
--

-- ALTER TABLE ONLY public."CARDS" ALTER COLUMN id SET DEFAULT nextval('public."CARDS_id_seq"'::regclass);


--
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: shanewaxler
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.cards_id_seq'::regclass);


--
-- Name: test_table id; Type: DEFAULT; Schema: public; Owner: shanewaxler
=======
ALTER TABLE public.users OWNER TO anthonyborges;

--
-- Name: test_table id; Type: DEFAULT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.test_table ALTER COLUMN id SET DEFAULT nextval('public.test_table_id_seq'::regclass);


--
<<<<<<< HEAD
-- Name: users id; Type: DEFAULT; Schema: public; Owner: shanewaxler
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: CARDS CARDS_pkey; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
--

-- ALTER TABLE ONLY public."CARDS"
--     ADD CONSTRAINT "CARDS_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
<<<<<<< HEAD
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
<<<<<<< HEAD
-- Name: game_cards game_cards_user_id_key; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: game_cards game_cards_user_id_key; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.game_cards
    ADD CONSTRAINT game_cards_user_id_key UNIQUE (user_id);


--
<<<<<<< HEAD
-- Name: game_users game_users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: game_users game_users_user_id_key; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.game_users
    ADD CONSTRAINT game_users_user_id_key UNIQUE (user_id);


--
<<<<<<< HEAD
-- Name: games games_id_pk; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_id_pk PRIMARY KEY (id);


--
<<<<<<< HEAD
-- Name: test_table test_table_pkey; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: test_table test_table_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.test_table
    ADD CONSTRAINT test_table_pkey PRIMARY KEY (id);


--
<<<<<<< HEAD
-- Name: users users_displayName_key; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: users users_displayname_key; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_displayname_key UNIQUE (displayname);


--
<<<<<<< HEAD
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
<<<<<<< HEAD
-- Name: users users_id_pk; Type: CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_pk PRIMARY KEY (id);


--
<<<<<<< HEAD
-- Name: game_cards game_cards_card_id_cards_fk; Type: FK CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: game_cards fk_game_cards_cards; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.game_cards
    ADD CONSTRAINT game_cards_card_id_cards_fk FOREIGN KEY (card_id) REFERENCES public.cards(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
<<<<<<< HEAD
-- Name: game_cards game_cards_game_id_games_fk; Type: FK CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: game_cards fk_game_cards_games; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.game_cards
    ADD CONSTRAINT game_cards_game_id_games_fk FOREIGN KEY (game_id) REFERENCES public.games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
<<<<<<< HEAD
-- Name: game_cards game_cards_user_id_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: game_cards fk_game_cards_users; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.game_cards
    ADD CONSTRAINT game_cards_user_id_users_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
<<<<<<< HEAD
-- Name: game_users game_users_game_id_games_fk; Type: FK CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: game_users fk_game_users_games; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.game_users
    ADD CONSTRAINT game_users_game_id_games_fk FOREIGN KEY (game_id) REFERENCES public.games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
<<<<<<< HEAD
-- Name: game_users game_users_user_id_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: game_users fk_game_users_users; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.game_users
    ADD CONSTRAINT game_users_user_id_users_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
<<<<<<< HEAD
-- Name: games games_winner_game_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: shanewaxler
=======
-- Name: games fk_games_game_users; Type: FK CONSTRAINT; Schema: public; Owner: anthonyborges
>>>>>>> d1cf2e0 (pushing registration db fix)
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_winner_game_users_fk FOREIGN KEY (winner) REFERENCES public.game_users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

