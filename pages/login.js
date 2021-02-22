import BasicLayout from '../components/BasicLayout';

import { useToasts } from 'react-toast-notifications';

import { useUser } from '../lib/useUser';

import Router from 'next/router';
import Link from 'next/link'

import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

import Form from "../components/Form";
import * as Fields from "../components/FormFields";

export default function Login(props) {
  const { user } = useUser({ redirectTo: '/dashboard' }); /* Redirection si l'utilisateur est connecté */
  const { addToast } = useToasts();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/me/login', {
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });

      const result = await res.json();
      console.dir(result);

      if (result.success) {
        addToast('Connexion réussie', { appearance: 'success' });
        Router.push('/dashboard');
      }
      else addToast(result.error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
    catch(error) {
      console.error(error);
      addToast(error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
  }

  const onError = (errors, e) => {
    console.error(errors, e);
    addToast(errors || 'Une erreur s\'est produite', { appearance: 'error' });
  }

  return (<div className={'bgLogo'}>
    <style global jsx>{`
      @font-face {
        font-family: Marianne;
        src: url(/assets/login/marianne-bold-webfont.ttf);
      }

      @font-face {
        font-family: Segoe;
        src: url(/assets/login/seguibl.ttf);
      }

      body {
        background: #EBEBEB;
        background-image: url(/assets/login/background.png);
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
      }

      @media (max-width: 600px) {
        body {
          background-position: center;
        }
      }

      .bgLogo {
        height: 100vh;
        width: 100vw;
        background-image: url(/assets/login/background2.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
        padding-bottom: 12.5%;
      }

      @media (max-width: 600px) {
        .bgLogo {
          background-position: center;
          background-size: 100%;
        }
      }

      h3 {
        margin: 0%;
        padding-bottom: 0%;
        font-family: 'Segoe';
        color: #282828;
        font-size: 3.125em;
        text-align: center;
      }

      @media (max-width: 600px) {
        h3 {
          margin-top: 1.5em;
          font-size: 1.875em;
        }
      }

      p {
        margin: 0%;
        font-family: 'Segoe';
        color: #0098FF;
        font-size: 2.5em;
        text-align: center;
      }

      @media (max-width: 600px) {
        p {
          font-size: 1.5625em;
        }
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        margin: 0 auto;

        width: 100%;
        height: 50vh;
      }

      form label {
        font-family: 'Marianne';
        font-weight: bolder;
        font-size: large;

        text-transform: uppercase;

        align-self: flex-start;
        width: 100%;
      }

      form > div {
        display: flex;
        flex-direction: column;
        align-items: center;

        min-width: 80%;
      }

      input, button {
        outline: 0;
        border: none;

        width: 75%;
        padding: 1.5% 2%;

        border-radius: 10px;

        transition: color 0.5s, background-color 0.5s;
      }

      input[type="text"],
      input[type="email"],
      input[type="password"] {
        display: inline-block;
        box-sizing: border-box;
        background-color: #282828;
        opacity: 0.2;
        font-family: monospace;
        font-size: large;
        color: white;
      }

      button {
        width: 60%;

        background-color: rgba(0, 152, 255, 0.34);
        color: #282828;
        padding: 1.5% 2%;
        cursor: pointer;
        font-family: 'Segoe';
        font-size: 1.25em;
        text-transform: uppercase;
      }

      @media (max-width: 600px) {
        button {
          padding: 3%;
          font-size: 0.93em;
        }
      }

      button:hover {
        background-color: white;
        color: #0098FF;
      }

      a {
      	margin: 0%;
      	padding-bottom: 0%;
      	font-family: 'Segoe';
      	color: #282828;
      	font-size: 1.125em;
      	text-align: center;
        text-transform: uppercase;
      }

      @media (max-width: 600px) {
      	a {
      		font-size: 0.81em;
      	}
      }
    `}</style>
    <BasicLayout title="Connexion">
      <h3>STUDENT WORKSPACE</h3>
      <p>CONNEXION</p>
      <Form className={'flex'} style={{ marginTop: '6em' }} onSubmit={onSubmit} onError={onError}>
        <Fields.FormInput disableStyle={true} label="Adresse mail" id="email" name="email" type="email" placeholder="exemple@exemple.fr" />
        <Fields.FormInput disableStyle={true} label="Mot de passe" id="password" name="password" type="password" placeholder="Mot de passe difficile à trouver" />
        <Fields.FormButton disableStyle={true} type="submit">Se connecter</Fields.FormButton>
        <Link href="#">
          <a>Mot de passe oublié ?</a>
        </Link>
      </Form>
    </BasicLayout>
  </div>);
};
