import withSession from "../lib/session";

export default function LogoutPage(props) {
  return <p>OK</p>;
};

export const getServerSideProps = withSession(async function ({ req, res }) {
  req.session.destroy();

  res.statusCode = 302;
  res.setHeader('location', '/login');
  
  return { props: {} };
});
