import React, { useState } from 'react';

import Router from 'next/router';
import Link from '../components/Link';

import withSession from "../lib/session";

import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

export default function LegalPage({ user }) {
  return (
    <UserLayout user={user} flex={true}>
      <Title>
        Mentions légales
      </Title>
      <div>
        <h3>
          POLITIQUE DE CONFIDENTIALITÉ
        </h3>
        <h5>DONNÉES PERSONNELLES</h5>
        <h7>Définitions</h7>
        <p>
          <strong>L'Éditeur</strong> : La personne, physique ou morale, qui édite les
          services de communication au public en ligne. <strong>Le Site</strong> :
          L'ensemble des sites, pages Internet et services en ligne proposés par
          l'Éditeur.
        </p>
        <p>
          <strong>L'Utilisateur</strong> : La personne utilisant le Site et les
          services.
        </p>
        <p>1- Nature des données collectées</p>
        <p>
          <strong>Dans le cadre de l'utilisation des Sites, l'Éditeur est susceptible de
            collecter les catégories de données suivantes concernant ses Utilisateurs
            :</strong>
        </p>
        <p>Données d'état-civil, d'identité, d'identification...</p>
        <p>
          Données relatives à la vie professionnelle (CV, scolarité, formation
          professionnelle, distinctions...) Données de connexion (adresses IP,
          journaux d'événements...)
        </p>
        <p>2- Communication des données personnelles à des tiers</p>
        <p><strong>Pas de communication à des tiers</strong></p>
        <p>
          Vos données ne font l'objet d'aucune communication à des tiers. Vous êtes
          toutefois informés qu'elles pourront être divulguées en application d'une
          loi, d'un règlement ou en vertu d'une décision d'une autorité réglementaire
          ou judiciaire compétente.
        </p>
        <p>
          3- Information préalable pour la communication des données personnelles à
          des tiers en cas de fusion / absorption
        </p>
        <p>
          <strong>Information préalable et possibilité d’opt-out avant et après la fusion /
            acquisition</strong>
        </p>
        <p>
          Dans le cas où nous prendrions part à une opération de fusion, d’acquisition
          ou à toute autre forme de cession d’actifs, nous nous engageons à garantir
          la confidentialité de vos données personnelles et à vous informer avant que
          celles-ci ne soient transférées ou soumises à de nouvelles règles de
          confidentialité.
        </p>
        <p>4- Agrégation des données</p>
        <p><strong>Agrégation avec des données non personnelles</strong></p>
        <p>
          Nous pouvons publier, divulguer et utiliser les informations agrégées
          (informations relatives à tous nos Utilisateurs ou à des groupes ou
          catégories spécifiques d'Utilisateurs que nous combinons de manière à ce
          qu'un Utilisateur individuel ne puisse plus être identifié ou mentionné) et
          les informations non personnelles à des fins d'analyse du secteur et du
          marché, de profilage démographique, à des fins promotionnelles et
          publicitaires et à d'autres fins commerciales.
        </p>
        <p>
          <strong>Agrégation avec des données personnelles disponibles sur les comptes
            sociaux de l'Utilisateur</strong>
        </p>
        <p>
          Si vous connectez votre compte à un compte d’un autre service afin de faire
          des envois croisés, ledit service pourra nous communiquer vos informations
          de profil, de connexion, ainsi que toute autre information dont vous avez
          autorisé la divulgation. Nous pouvons agréger les informations relatives à
          tous nos autres Utilisateurs, groupes, comptes, aux données personnelles
          disponibles sur l’Utilisateur.
        </p>
        <p>5- Collecte des données d'identité</p>
        <p>
          <strong>Inscription et identification préalable pour la fourniture du
            service</strong>
        </p>
        <p>
          L’utilisation du Site nécessite une inscription et une identification
          préalable. Vos données nominatives (nom, prénom, adresse postale, e-mail,
          numéro de téléphone,...) sont utilisées pour exécuter nos obligations
          légales résultant de la livraison des produits et / ou des services, en
          vertu du Contrat de licence utilisateur final, de la Limite de garantie, le
          cas échéant, ou de toute autre condition applicable. Vous ne fournirez pas
          de fausses informations nominatives et ne créerez pas de compte pour une
          autre personne sans son autorisation. Vos coordonnées devront toujours être
          exactes et à jour.
        </p>
        <p>6- Collecte des données d'identification</p>
        <p>
          <strong>Utilisation de l'identifiant de l’utilisateur uniquement pour l’accès aux
            services</strong>
        </p>
        <p>
          Nous utilisons vos identifiants électroniques seulement pour et pendant
          l'exécution du contrat.
        </p>
        <p>7- Collecte des données du terminal</p>
        <p><strong>Aucune collecte des données techniques</strong></p>
        <p>
          Nous ne collectons et ne conservons aucune donnée technique de votre
          appareil (adresse IP, fournisseur d'accès à Internet...).
        </p>
        <p>8- Cookies</p>
        <p><strong>Durée de conservation des cookies</strong></p>
        <p>
          Conformément aux recommandations de la CNIL, la durée maximale de
          conservation des cookies est de 13 mois au maximum après leur premier dépôt
          dans le terminal de l'Utilisateur, tout comme la durée de la validité du
          consentement de l’Utilisateur à l’utilisation de ces cookies. La durée de
          vie des cookies n’est pas prolongée à chaque visite. Le consentement de
          l’Utilisateur devra donc être renouvelé à l'issue de ce délai.
        </p>
        <p><strong>Finalité cookies</strong></p>
        <p>
          Les cookies peuvent être utilisés pour des fins statistiques notamment pour
          optimiser les services rendus à l'Utilisateur, à partir du traitement des
          informations concernant la fréquence d'accès, la personnalisation des pages
          ainsi que les opérations réalisées et les informations consultées.
        </p>
        <p>
          Vous êtes informé que l'Éditeur est susceptible de déposer des cookies sur
          votre terminal. Le cookie enregistre des informations relatives à la
          navigation sur le service (les pages que vous avez consultées, la date et
          l'heure de la consultation...) que nous pourrons lire lors de vos visites
          ultérieures.
        </p>
        <p><strong>Droit de l'Utilisateur de refuser les cookies</strong></p>
        <p>
          Vous reconnaissez avoir été informé que l'Éditeur peut avoir recours à des
          cookies. Si vous ne souhaitez pas que des cookies soient utilisés sur votre
          terminal, la plupart des navigateurs vous permettent de désactiver les
          cookies en passant par les options de réglage.
        </p>
        <p>9 - Conservation des données techniques</p>
        <p><strong>Durée de conservation des données techniques</strong></p>
        <p>
          Les données techniques sont conservées pour la durée strictement nécessaire
          à la réalisation des finalités visées ci-avant.
        </p>
        <p>10- Délai de conservation des données personnelles et d'anonymisation</p>
        <p>
          <strong>Conservation des données pendant la durée de la relation
            contractuelle</strong>
        </p>
        <p>
          Conformément à l'article 6-5° de la loi n°78-17 du 6 janvier 1978 relative à
          l'informatique, aux fichiers et aux libertés, les données à caractère
          personnel faisant l'objet d'un traitement ne sont pas conservées au-delà du
          temps nécessaire à l'exécution des obligations définies lors de la
          conclusion du contrat ou de la durée prédéfinie de la relation
          contractuelle.
        </p>
        <p>
          <strong>Conservation des données anonymisées au delà de la relation contractuelle
            / après la suppression du compte</strong>
        </p>
        <p>
          Nous conservons les données personnelles pour la durée strictement
          nécessaire à la réalisation des finalités décrites dans les présentes
          Politiques de confidentialité. Au-delà de cette durée, elles seront
          anonymisées et conservées à des fins exclusivement statistiques et ne
          donneront lieu à aucune exploitation, de quelque nature que ce soit.
        </p>
        <p><strong>Suppression des données après suppression du compte</strong></p>
        <p>
          Des moyens de purge de données sont mis en place afin d'en prévoir la
          suppression effective dès lors que la durée de conservation ou d'archivage
          nécessaire à l'accomplissement des finalités déterminées ou imposées est
          atteinte. Conformément à la loi n°78-17 du 6 janvier 1978 relative à
          l'informatique, aux fichiers et aux libertés, vous disposez par ailleurs
          d'un droit de suppression sur vos données que vous pouvez exercer à tout
          moment en prenant contact avec l'Éditeur.
        </p>
        <p><strong>Suppression des données après 3 ans d'inactivité</strong></p>
        <p>
          Pour des raisons de sécurité, si vous ne vous êtes pas authentifié sur le
          Site pendant une période de trois ans, vous recevrez un e-mail vous invitant
          à vous connecter dans les plus brefs délais, sans quoi vos données seront
          supprimées de nos bases de données.
        </p>
        <p>11- Suppression du compte</p>
        <p><strong>Suppression du compte à la demande</strong></p>
        <p>
          L'Utilisateur a la possibilité de supprimer son Compte à tout moment, par
          simple demande à l'Éditeur OU par le menu de suppression de Compte présent
          dans les paramètres du Compte le cas échéant.
        </p>
        <p>
          <strong>Suppression du compte en cas de violation de la Politique de
            Confidentialité</strong>
        </p>
        <p>
          En cas de violation d'une ou de plusieurs dispositions de la Politique de
          Confidentialité ou de tout autre document incorporé aux présentes par
          référence, l'Éditeur se réserve le droit de mettre fin ou restreindre sans
          aucun avertissement préalable et à sa seule discrétion, votre usage et accès
          aux services, à votre compte et à tous les Sites.
        </p>
        <p>12- Indications en cas de faille de sécurité décelée par l'Éditeur</p>
        <p>
          <strong>Information de l'Utilisateur en cas de faille de sécurité</strong>
        </p>
        <p>
          Nous nous engageons à mettre en oeuvre toutes les mesures techniques et
          organisationnelles appropriées afin de garantir un niveau de sécurité adapté
          au regard des risques d'accès accidentels, non autorisés ou illégaux, de
          divulgation, d'altération, de perte ou encore de destruction des données
          personnelles vous concernant. Dans l'éventualité où nous prendrions
          connaissance d'un accès illégal aux données personnelles vous concernant
          stockées sur nos serveurs ou ceux de nos prestataires, ou d'un accès non
          autorisé ayant pour conséquence la réalisation des risques identifiés
          ci-dessus, nous nous engageons à :
        </p>
        <p>Vous notifier l'incident dans les plus brefs délais ;</p>
        <p>Examiner les causes de l'incident et vous en informer ;</p>
        <p>
          Prendre les mesures nécessaires dans la limite du raisonnable afin
          d'amoindrir les effets négatifs et préjudices pouvant résulter dudit
          incident.
        </p>
        <p><strong>Limitation de la responsabilité</strong></p>
        <p>
          En aucun cas les engagements définis au point ci-dessus relatifs à la
          notification en cas de faille de sécurité ne peuvent être assimilés à une
          quelconque reconnaissance de faute ou de responsabilité quant à la
          survenance de l'incident en question.
        </p>
        <p>13- Transfert des données personnelles à l'étranger</p>
        <p><strong>Pas de transfert en dehors de l'Union européenne</strong></p>
        <p>
          L'Éditeur s'engage à ne pas transférer les données personnelles de ses
          Utilisateurs en dehors de l'Union européenne.
        </p>
        <p>
          14- Modification de la politique de confidentialité
          <strong>En cas de modification de la présente Politique de Confidentialité,
            engagement de ne pas baisser le niveau de confidentialité de manière
            substantielle sans l'information préalable des personnes
            concernées</strong>
        </p>
        <p>
          Nous nous engageons à vous informer en cas de modification substantielle de
          la présente Politique de Confidentialité, et à ne pas baisser le niveau de
          confidentialité de vos données de manière substantielle sans vous en
          informer et obtenir votre consentement.
        </p>
        <p>15- Droit applicable et modalités de recours</p>
        <p><strong>Clause d'arbitrage</strong></p>
        <p>
          Vous acceptez expressément que tout litige susceptible de naître du fait de
          la présente Politique de Confidentialité, notamment de son interprétation ou
          de son exécution, relèvera d'une procédure d'arbitrage soumise au règlement
          de la plateforme d'arbitrage choisie d'un commun accord, auquel vous
          adhérerez sans réserve.
        </p>
        <p>16- Portabilité des données</p>
        <p><strong>Portabilité des données</strong></p>
        <p>
          L'Éditeur s'engage à vous offrir la possibilité de vous faire restituer
          l'ensemble des données vous concernant sur simple demande. L'Utilisateur se
          voit ainsi garantir une meilleure maîtrise de ses données, et garde la
          possibilité de les réutiliser. Ces données devront être fournies dans un
          format ouvert et aisément réutilisable.
        </p>
      </div>
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get('user');

  if (!user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user') },
  };
});
