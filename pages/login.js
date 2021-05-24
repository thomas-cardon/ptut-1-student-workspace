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

      .bgLogo {
        height: 100vh;
        width: 100vw;
        background-image: url(/assets/login/bg-overlay.webp), url(/assets/login/bg-overlay.png);
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
        margin: 1em 0 0 0;
        padding-bottom: 0;
        color: #${theme === 'dark' ? 'DCDCDC' : '282828'} !important;
        font-size: 3.125em;
        text-align: center;
        text-transform: uppercase;

        font-weight: bolder;
      }

      @media (max-width: 600px) {
        h3 {
          margin-top: 1.5em;
          font-size: 1.875em;
        }
      }

      p {
        margin: 0;

        text-align: center;
        color: #0098FF;

        font-size: 2.5em;
        font-weight: bolder;

        text-transform: uppercase;
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

        margin: auto auto;

        width: 100%;
        height: 50vh;
      }

      form label {
        color: #${theme === 'dark' ? 'DCDCDC' : '282828'} !important;

        font-family: 'Marianne', 'Segoe UI', 'Segoe';
        font-weight: bolder;
        font-size: large;

        text-transform: uppercase;

        width: 100%;
        display: block;
      }

      form > div {
        width: 60% !important;
      }

      button {
        padding: 1em 2em !important;
      }

      form > div > div {
        margin: 0 !important;
      }

      input {
        outline: 0;
        border: none;

        width: 100%;
        padding: 1.5% 2%;

        border-radius: 0.7em;

        transition: color 0.5s, background-color 0.5s;
      }

      input[type="text"],
      input[type="email"],
      input[type="password"] {
        display: inline-block;

        box-sizing: border-box;
        background-color: #282828;
        opacity: ${theme === 'dark' ? 0.3 : 0.2};
        font-family: monospace;
        font-size: large;
        color: white;
      }

      button {
        font-size: 1.15rem;
      }

      button:hover {
        transform: scale(1.1, 1.1);
      }

      @media (max-width: 600px) {
        button {
          padding: 3%;
          font-size: 0.93em;
        }
      }

      a {
      	margin: 0%;
      	padding-bottom: 0%;
      	font-family: 'Segoe UI', 'Segoe';
        color: #${theme === 'dark' ? 'DCDCDC' : '282828'};
      	font-size: 1.125em;
      	text-align: center;
        text-transform: uppercase;
      }

      @media (max-width: 600px) {
      	a {
      		font-size: 0.81em;
      	}
      }

      .buttons {
        display: flex;
        gap: 20px;
        align-self: flex-end;
        margin: 0 auto;
        width: fit-content !important;

        flex-wrap: nowrap;
      }
    `}</style>
    <BasicLayout title="SWS -> Connexion" disableBackground={true}>
      <h3>Student Workspace</h3>
      <p>Connexion</p>
      <Form onSubmit={handleSubmit}>
        <Fields.FormInput disableStyle={true} label="Adresse mail" name="email" type="email" placeholder="exemple@exemple.fr" onChange={handleInputChange} defaultValue={values.email} />
        <Fields.FormInput disableStyle={true} label="Mot de passe" name="password" type="password" placeholder="Mot de passe difficile à trouver" onChange={handleInputChange} defaultValue={values.password} />

        <div className="buttons">
          <Fields.FormButton type="submit" is="light">Se connecter</Fields.FormButton>
          <Link href={{
            pathname: '/sign-up',
            query: { email: values.email },
          }}>
            <Fields.FormButton is="danger">Inscription</Fields.FormButton>
          </Link>
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
