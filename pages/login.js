import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Link from '../components/Link';

import BasicLayout from '../components/BasicLayout';

import Form from "../components/Form";
import * as Fields from "../components/FormFields";

import { useTheme } from 'next-themes';
import { useToasts } from 'react-toast-notifications';

import withSession from "../lib/session";

export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToasts();

  const router = useRouter();

  /*
   * Variable definitions
   */
   const [values, setValues] = useState({ email: '', password: '' });

   const handleInputChange = e => {
     const { name, value } = e.target;
     setValues({ ...values, [name]: value});
   };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_URL_PREFIX + '/api/me/login', {
        body: JSON.stringify({
          email: values.email || e.target.email.value,
          password: values.password || e.target.password.value
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });

      if (!res.ok) {
        console.dir(await res.text());
        return addToast('Une erreur s\'est produite', { appearance: 'error' });
      }
      const result = await res.json();

      if (result.success) {
        addToast('Connexion réussie', { appearance: 'success' });
        router.push('/dashboard');
      }
      else {
        addToast(result.error || 'Une erreur s\'est produite', { appearance: 'error' });
        console.dir(result);
      }
    }
    catch(error) {
      console.error(error);
      addToast(error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
  }, []);

  /*
   * End of variable definitions
   */

  /* Précharge le tableau de bord */
  useEffect(() => router.prefetch('/dashboard'), []);

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
        background: #${theme === 'dark' ? '282828' : 'EBEBEB'};
        background-image: url(/assets/login/bg-1.webp), url(/assets/login/bg-1.png);
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;

        font-family: 'Segoe UI', 'Segoe';
        font-weight: bolder;
      }

      @media (max-width: 600px) {
        body {
          background-position: center;
        }
      }

      .layout .bgLogo {
        height: 100vh;
        width: 100vw;
        background-image: url(/assets/login/bg-overlay.webp), url(/assets/login/bg-overlay.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
        padding-bottom: 12.5%;
      }

      @media (max-width: 600px) {
        .layout .bgLogo {
          background-position: center;
          background-size: 100%;
        }
      }

      .layout h3 {
        margin: 1em 0 0 0;
        padding-bottom: 0;
        color: #${theme === 'dark' ? 'DCDCDC' : '282828'} !important;
        font-size: 3.125em;
        text-align: center;
        text-transform: uppercase;

        font-weight: bolder;
      }

      @media (max-width: 600px) {
        .layout h3 {
          margin-top: 1.5em;
          font-size: 1.875em;
        }
      }

      .layout h5 {
        margin: 0;

        text-align: center;
        color: #0098FF;

        font-size: 2.5em;
        font-weight: bolder;

        text-transform: uppercase;
      }

      @media (max-width: 600px) {
        .layout h5 {
          font-size: 1.5625em;
        }
      }

      .layout p {
        width: 80%;

        color: var(--color-primary-100);

        font-family: 'Marianne', 'Segoe UI', 'Segoe';
        font-weight: bolder;
        font-size: min(3vw, 1rem);

        text-transform: uppercase;
      }

      .layout form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        margin: auto auto;

        width: 50vw;
        height: 70vh;
      }

      .layout form label {
        color: #${theme === 'dark' ? 'DCDCDC' : '282828'} !important;

        font-family: 'Marianne', 'Segoe UI', 'Segoe';
        font-weight: bolder;
        font-size: large;

        text-transform: uppercase;

        width: 100%;
        display: block;
      }

      .layout form > div:not(.buttons) {
        width: 100% !important;
      }

      .layout button {
        padding: 1em 2em !important;
      }

      .layout form > div > div {
        margin: 0 !important;
      }

      .layout input {
        outline: 0;
        border: none;

        width: 100%;
        padding: 1.5% 2%;

        border-radius: 8px;

        transition: color 0.5s, background-color 0.5s;
      }

      .layout input:-webkit-autofill,
      .layout input:-webkit-autofill:hover,
      .layout input:-webkit-autofill:focus,
      .layout input:-webkit-autofill:active {
        transition: background-color 5000s ease-in-out 0s;
      }

      .layout input:-webkit-autofill {
        font-family: monospace;
        -webkit-text-fill-color: #fff;
      }

      .layout input:-webkit-autofill:focus {
        font-family: monospace;
        -webkit-text-fill-color: #fff;
      }

      .layout input[type="text"],
      .layout input[type="email"],
      .layout input[type="password"] {
        display: inline-block;

        box-sizing: border-box;
        background-color: #282828;
        opacity: ${theme === 'dark' ? 0.3 : 0.2};
        font-family: monospace;
        font-size: large;
        color: white;
      }

      .layout button:hover {
        transform: scale(1.15, 1.15);
      }

      @media (max-width: 600px) {
        .layout input {
          border-radius: 5px;
        }

        .layout button {
          padding: 3%;
          font-size: 0.93em;
        }
      }

      .layout .buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 2rem;
        gap: 1rem;
      }

      .layout .buttons button {
        width: unset;
      }

      .link {
        border-bottom: solid 3px var(--color-accent);
      }

      .link:hover {
        color: var(--color-accent-hover) !important;
      }
    `}</style>
    <BasicLayout title="Connexion" disableBackground={true} className="layout">
      <h3>Student Workspace</h3>
      <h5>Connexion</h5>
      <Form onSubmit={handleSubmit}>
        <>
          <p>En vous connectant, vous acceptez nos <a className="link" onClick={() => router.push('/legal')}>conditions générales d'utilisation</a>.</p>
          <Fields.FormInput disableStyle={true} label="Adresse mail" name="email" type="email" placeholder="exemple@exemple.fr" onChange={handleInputChange} defaultValue={values.email} />
          <Fields.FormInput disableStyle={true} label="Mot de passe" name="password" type="password" placeholder="Mot de passe difficile à trouver" onChange={handleInputChange} defaultValue={values.password} />
        </>

        <div className="buttons">
          <Fields.FormButton type="submit" is="light">Connexion</Fields.FormButton>
          <Fields.FormButton is="danger" onClick={e => {
            e.preventDefault();
            router.push('/sign-up?email=' + values.email);
          }}>Inscription</Fields.FormButton>
        </div>
      </Form>
    </BasicLayout>
  </div>);
};

export const getServerSideProps = withSession(async function ({ req, res }) {
  if (req.session.get('user')) {
    res.setHeader('location', '/dashboard');
    res.statusCode = 302;
    res.end();
  }

  return { props: { title: 'Connexion' } };
});
