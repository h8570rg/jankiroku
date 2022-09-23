import { withAuth } from "~/lib/routes/ssr";

export const getServerSideProps = withAuth(async () => {
  return {
    props: {},
  };
});

export default function SignupUser() {
  return <>aaa</>;
}
