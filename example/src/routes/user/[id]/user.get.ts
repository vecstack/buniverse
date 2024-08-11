import { useParams } from 'buniverse/router/fs';
import type { RequestHandler } from 'buniverse';

const UserGetHandler: RequestHandler = () => {
  const { id } = useParams();
  return new Response(`User ID: ${id}`);
};

export default UserGetHandler;
