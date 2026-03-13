import { type RequestHandler } from 'buniverse';

const Home: RequestHandler = (req) => {
  return <div>HEY!!! {req.url}</div>;
};
export default Home;
