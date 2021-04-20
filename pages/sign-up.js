import React, { useState } from 'react';
import { useRouter } from 'next/router';

import Link from '../components/Link';

import BasicLayout from '../components/BasicLayout';

import Form from "../components/Form";
import * as Fields from "../components/FormFields";

import { useDarkMode } from 'next-dark-mode';
import { useToasts } from 'react-toast-notifications';

import withSession from "../lib/session";

import { Line } from 'rc-progress';

import { uni as schools, emails } from '../lib/ade';

export default function LoginPage({ email }) {
  const router = useRouter();

  const { darkModeActive } = useDarkMode();
  const { addToast } = useToasts();

  /*
   * Variable definitions
   */
   const MAX_STEPS = 4;

   const [values, setValues] = useState({ firstName: '', lastName: '', email: email || '', password: '', school: '', degree: '', year: '', birthDate: "1970-01-01" });
   const [step, setStep] = useState(1);

   const handleInputChange = e => {
     const { name, value } = e.target;
     setValues({ ...values, [name]: value});
   };

  function previousStep(e) {
    e.preventDefault();
    setStep(step - 1);
  }

  async function nextStep(e) {
    e.preventDefault();

    if (step === MAX_STEPS) {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_URL_PREFIX + '/api/me/sign-up', {
          body: JSON.stringify(values),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST'
        });

        if (!res.ok) return addToast('Une erreur s\'est produite', { appearance: 'error' });
        const result = await res.json();

        if (result.success) {
          addToast('Inscription réussie', { appearance: 'success' });
          router.push('/login');
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
    }
    else {
      if (step === 1) {
        if (!values.email) return addToast('Entrez votre adresse e-mail pour continuer.', { appearance: 'error' });
        if (!emails.includes(values.email.slice(values.email.indexOf('@')))) return addToast('Veuillez entrer une adresse-mail universitaire (ex. @etu.univ-amu.fr).', { appearance: 'error' });

        let data = values.email.split('@')[0].split('.');
        setValues({ ...values, firstName: data[0].charAt(0).toUpperCase() + data[0].slice(1), lastName: data[1].toUpperCase() });
        setStep(step + 1);
      }
      else setStep(step + 1);
    }
  }

  /*
   * End of variable definitions
   */

  return (<div>
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
        background-image: url(/assets/login/bg-1.webp), url(/assets/login/bg-1.png) !important;
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

      h3, h5 {
        margin: 1em 0 0 0;
        padding-bottom: 0;
        color: var(--color-primary-900);
        font-size: 3.125em;
        text-align: center;
        text-transform: uppercase;

        font-weight: bolder;
      }

      h5 {
        color: var(--color-secondary);
        font-size: 1.5rem;
      }

      @media (max-width: 600px) {
        h3, h5 {
          margin-top: 1.5em;
        }

        h3 {
          font-size: 1.875em;
        }
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        margin: 3em auto auto auto;
        width: 100%;
      }

      form label {
        color: var(--color-primary-900) !important;

        font-family: 'Marianne', 'Segoe UI', 'Segoe';
        font-weight: bolder;
        font-size: large;

        text-transform: uppercase;

        width: 100%;
        display: block;
      }

      form > div:not(.buttons) {
        width: 60% !important;
      }

      form > div:not(.buttons) > div {
        margin: 0 !important;
      }

      button {
        padding: 1em 2em !important;
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
      input[type="password"],
      input[type="date"] {
        display: inline-block;

        box-sizing: border-box;
        background-color: #282828;
        opacity: ${darkModeActive ? 0.3 : 0.2};
        font-family: monospace;
        font-size: large;
        color: white;
      }

      button {
        font-size: 1.15rem;
      }

      button:disabled {
        background-color: #ccc;
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
        color: var(--color-primary-800);
      	font-size: 1.125em;
      	text-align: center;
        text-transform: uppercase;
      }

      @media (max-width: 600px) {
      	a {
      		font-size: 0.81em;
      	}
      }

      p {
        text-transform: uppercase;
        color: var(--color-primary-700);

        font-weight: bolder;
        text-align: center;
      }

      .buttons {
        display: flex;
        gap: 20px;
        margin: 0 auto;
        align-self: flex-end;

        margin-bottom: 2em;
      }

      .login {
        margin-top: -1em;
        margin-bottom: 1em;
        margin-left: auto;
        margin-right: auto;

        color: var(--color-accent);
        transition: color 0.2s ease;
      }

      .login:hover {
        color: var(--color-accent-hover);
      }
    `}</style>
    <BasicLayout title="SWS -> Inscription" disableBackground={true}>
      <h3>Student Workspace</h3>
      <Link href="/login">
        <p className="login">Vous avez déjà un compte?</p>
      </Link>
      <h5>Inscription</h5>

      <div style={{ margin: '0 auto', width: '30%' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary-washed-out)' }}>Etape: {step}/{MAX_STEPS}</h3>
        <Line strokeWidth={1} trailWidth={1} percent={((step - 1) / MAX_STEPS) * 100} strokeColor="#2ecc71" trailColor="black" />
      </div>

      {step === 1 && (
        <Form onSubmit={e => e.preventDefault()}>
          <Fields.FormInput disableStyle={true} label="Adresse mail universitaire" name="email" type="email" placeholder="prenom.nom@etu.univ-amu.fr" onChange={handleInputChange} value={values.email} />
        </Form>
      )}

      {step === 2 && (
        <Form onSubmit={e => e.preventDefault()}>
          <Fields.FormSelect label="Université" name="school" onChange={handleInputChange} noOption="-- Sélectionnez une université --" value={values.school} options={Object.keys(schools).map(x => { return { option: x, value: x } })} required />
          <Fields.FormSelect label="Formation" name="degree" onChange={handleInputChange} noOption="-- Sélectionnez une formation --" value={values.degree} options={(values.school ? Object.keys(schools[values.school]) : []).map(x => { return { option: x, value: x } })} required />
          <Fields.FormSelect label="Groupe" name="year" onChange={handleInputChange} noOption="-- Sélectionnez un groupe --" value={values.year} options={(values.school && values.degree ? Object.keys(schools[values.school][values.degree]) : []).filter(x => !x.startsWith('_')).map(x => { return { option: x, value: x } })} required />
        </Form>
      )}

      {step === 3 && (
        <Form onSubmit={e => e.preventDefault()}>
          <Fields.FormInput disableStyle={true} label="Prénom" name="firstName" type="text" placeholder="Jean" onChange={handleInputChange} defaultValue={values.firstName} />
          <Fields.FormInput disableStyle={true} label="Nom" name="lastName" type="text" placeholder="Dujardin" onChange={handleInputChange} defaultValue={values.lastName} />
          <Fields.FormInput disableStyle={true} label="Date de naissance" name="birthDate" type="date" onChange={handleInputChange} value={values.birthDate} min="1920-01-01" />
        </Form>
      )}

      {step === 4 && (
        <Form onSubmit={e => e.preventDefault()}>
          <p>Veuillez écrire un mot de passe de 8 caractères contenant au moins une minuscule, une majuscule, et un chiffre.</p>
          <Fields.FormInput disableStyle={true} label="Définissez votre mot de passe" name="password" type="password" minLength={8} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$" onChange={handleInputChange} value={values.password} />
        </Form>
      )}

      <div className="buttons">
        <Fields.FormButton is="light" onClick={previousStep} disabled={step <= 1}>Précédent</Fields.FormButton>
        <Fields.FormButton is="action" onClick={nextStep}>Suivant</Fields.FormButton>
      </div>
    </BasicLayout>
  </div>);
};

export const getServerSideProps = withSession(async function ({ req, res, query }) {
  if (req.session.get('user')) {
    res.setHeader('location', '/dashboard');
    res.statusCode = 302;
    res.end();
  }

  if (query.email) return { props: { email: query.email } };
  return { props: {} };
});
