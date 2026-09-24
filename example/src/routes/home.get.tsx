import { useRequest, type RequestHandler } from 'buniverse';

const Home: RequestHandler = async () => {
  const req = useRequest();
  return new Response(
    JSON.stringify({
      message: `Welcome to Buniverse! You are visiting ${req.url}`,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export default Home;
