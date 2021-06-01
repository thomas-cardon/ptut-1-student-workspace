import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Link from '../components/Link';

import BasicLayout from '../components/BasicLayout';

import Form from "../components/Form";
import * as Fields from "../components/FormFields";

import { useTheme } from 'next-themes';
import { useToasts } from 'react-toast-notifications';

import withSession from "../lib/session";

import { Line } from 'rc-progress';

import { emails } from '../lib/ade';
import { fetcher } from '../lib/hooks';

export default function LoginPage({ email }) {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToasts();

  const router = useRouter();

  /*
   * Variable definitions
   */
   const { data : schools, error } = useSWR('/api/schools', fetcher);

   const [values, setValues] = useState({ firstName: '', lastName: '', email: email || '', password: '', school: 0, degree: 0, group: 0, teacher: false, birthDate: "1970-01-01", resourceId: null });
   const [step, setStep] = useState(1);

   const MAX_STEPS = values.teacher ? 5 : 4;

   const handleInputChange = e => {
     const {name, value, checked, type } = e.target;
     setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
   };

  function previousStep(e) {
    e.preventDefault();
    setStep(step - 1);
  }

  async function nextStep(e) {
    e.preventDefault();

    if (step === MAX_STEPS) {
      if (values.teacher && !new URLSearchParams(values.resourceId).get('resources')) return addToast('Veuillez entrer la bonne URL afin de pouvoir importer votre emploi du temps.', { appearance: 'error' });
      if (values.password.length < 8) return addToast('Veuillez entrer un mot de passe d\'au moins 8 caractères', { appearance: 'error' });

      try {
        console.dir(JSON.stringify({ ...values, resourceId: new URLSearchParams(values.resourceId).get('resources') }));

        const res = await fetch(process.env.NEXT_PUBLIC_URL_PREFIX + '/api/me/sign-up', {
          body: JSON.stringify({ ...values, resourceId: parseInt(new URLSearchParams(values.resourceId).get('resources')) }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST'
        });

        const result = await res.json();

        if (result.success) {
          addToast('Inscription réussie', { appearance: 'success' });
          router.push('/login');
        }
        else addToast(result.message ? result.message : (result.error ? 'Erreur: ' + result.error : 'Une erreur s\'est produite'), { appearance: 'error' });
      }
      catch(error) {
        addToast('Une erreur s\'est produite', { appearance: 'error' });
        console.error(error);
      }
    }
    else {
      if (step === 1) {
        if (!values.email) return addToast('Entrez votre adresse e-mail pour continuer.', { appearance: 'error' });
        if (!emails.includes(values.email.slice(values.email.indexOf('@')))) return addToast('Veuillez entrer une adresse-mail universitaire (ex. @etu.univ-amu.fr).', { appearance: 'error' });

        let data = values.email.split('@')[0].split('.');

        setValues({ ...values, firstName: data[0].charAt(0).toUpperCase() + data[0].slice(1), lastName: data[1] ? data[1].toUpperCase() : '' });
        setStep(step + 1);
      }
      else if (step === 2) {
        if (values.teacher === false && (values.school === 0 || values.degree === 0 || values.year === 0)) return addToast('Sélectionnez votre école, votre formation et votre année pour continuer.', { appearance: 'error' });
        setStep(step + 1);
      }
      else if (step === 3) {
        if (values.firstName === '' || values.lastName === '') return addToast('Veuillez entrer votre nom et prénom pour continuer.', { appearance: 'error' });
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

        margin-top: -1em;
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
        justify-content: start;

        margin: 1em auto 0 auto;
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
        width: 40vw !important;
        margin-bottom: 1rem;
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
      input[type="date"],
      input[type="url"] {
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

      button:disabled {
        background-color: #ccc;
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

        flex-wrap: nowrap;
      }

      .login {
        margin-top: -1em;
        margin-bottom: 1em;
        margin-left: auto;
        margin-right: auto;

        color: var(--color-accent);
        transition: color 0.2s ease;

        font-size: x-large;
      }

      .login:hover {
        color: var(--color-accent-hover);
      }

      .link {
        border-bottom: solid 3px var(--color-accent);
      }

      .link:hover {
        color: var(--color-accent-hover) !important;
      }
    `}</style>
    <BasicLayout title="Inscription" disableBackground={true}>
      <h3>Student Workspace</h3>
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
          <Fields.FormSelect label="Université" name="school" onChange={handleInputChange} noOption="-- Sélectionnez une université --" value={values.school} options={schools?.map(x => { return { option: x.name, value: x.id } })} required />
          <Fields.FormSelect label="Formation" name="degree" onChange={handleInputChange} noOption="-- Sélectionnez une formation --" value={values.degree} options={values.school ? schools.find(x => x.id == values.school).degrees.map(x => { return { option: x.name, value: x.id } }) : null} required />
          <Fields.FormSelect disabled={values.teacher} label="Groupe" name="group" onChange={handleInputChange} noOption="-- Sélectionnez un groupe --" value={values.group} options={values.degree ? schools.find(x => x.id == values.school).degrees.find(x => x.id == values.degree).groups.map(x => { return { option: x.name, value: x.id } }) : null} required />
          <Fields.FormSwitch label="Êtes vous professeur ?" name="teacher" onChange={handleInputChange} value={values.teacher} />
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
          <p style={{ fontSize: '1rem', width: '50%', marginBottom: '2em' }}>Veuillez écrire un mot de passe de 8 caractères minimum contenant au moins une minuscule, une majuscule, et un chiffre.</p>
          <Fields.FormInput disableStyle={true} label="Définissez votre mot de passe" name="password" type="password" minLength={8} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$" required onChange={handleInputChange} value={values.password} />
        </Form>
      )}

      {step === 5 && (
        <Form onSubmit={e => e.preventDefault()}>
          <p style={{ fontFamily: 'Lato', textTransform: 'none', textAlign: 'justify', fontSize: '1rem', width: '35vw', marginBottom: '2em' }}>
            Afin d'importer votre emploi du temps, vous devez nous indiquer votre lien d'exportation iCalendar.
            <br />
            Vous pouvez récupérer ce lien sur ADE en cliquant sur le deuxième bouton en partant de la gauche en bas, dans le cadre "options"
          </p>
          <Fields.FormInput disableStyle={true} label="Lien" name="resourceId" type="url" placeholder="Lien d'exportation de l'agenda en format iCalendar" required onChange={handleInputChange} value={values.resourceId} />
        </Form>
      )}

      <div className="buttons">
        <Fields.FormButton is="light" onClick={previousStep} disabled={step <= 1}>Précédent</Fields.FormButton>
        <Fields.FormButton is="action" onClick={nextStep}>Suivant</Fields.FormButton>
      </div>
      <Link href="/login">
        <p className="login">Vous avez déjà un compte?</p>
      </Link>
    </BasicLayout>
  </div>);
};

export const getServerSideProps = withSession(async function ({ req, res, query }) {
  if (req.session.get('user')) {
    res.setHeader('location', '/dashboard');
    res.statusCode = 302;
    res.end();
  }

  if (query.email) return { props: { email: query.email, title: 'Inscription' } };
  return { props: { title: 'Inscription' } };
});
