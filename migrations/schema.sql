--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 11.5

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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: schema_migration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migration (
    version character varying(14) NOT NULL
);


ALTER TABLE public.schema_migration OWNER TO postgres;

--
-- Name: session_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session_groups (
    id integer NOT NULL,
    image_ready boolean DEFAULT false NOT NULL,
    slug character varying(10) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.session_groups OWNER TO postgres;

--
-- Name: session_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.session_groups_id_seq OWNER TO postgres;

--
-- Name: session_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.session_groups_id_seq OWNED BY public.session_groups.id;


--
-- Name: shared_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shared_images (
    id integer NOT NULL,
    session_group_id integer,
    blob bytea,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.shared_images OWNER TO postgres;

--
-- Name: shared_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shared_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shared_images_id_seq OWNER TO postgres;

--
-- Name: shared_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shared_images_id_seq OWNED BY public.shared_images.id;


--
-- Name: session_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_groups ALTER COLUMN id SET DEFAULT nextval('public.session_groups_id_seq'::regclass);


--
-- Name: shared_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shared_images ALTER COLUMN id SET DEFAULT nextval('public.shared_images_id_seq'::regclass);


--
-- Name: session_groups session_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_groups
    ADD CONSTRAINT session_groups_pkey PRIMARY KEY (id);


--
-- Name: shared_images shared_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shared_images
    ADD CONSTRAINT shared_images_pkey PRIMARY KEY (id);


--
-- Name: schema_migration_version_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX schema_migration_version_idx ON public.schema_migration USING btree (version);


--
-- Name: session_groups_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX session_groups_slug_idx ON public.session_groups USING btree (slug);


--
-- PostgreSQL database dump complete
--

