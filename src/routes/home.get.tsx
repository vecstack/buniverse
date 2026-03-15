import { type RequestHandler } from 'buniverse';
import { readFile } from 'node:fs/promises';
import { Test } from '../common/Test';

const Home: RequestHandler = async (req) => {
  return <div>HEY!!!
    <Test />
  </div>;
};
export default Home;
