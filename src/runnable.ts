import { bootstrap } from './bootstrap';
import { createFSRouter } from './packages/router/fs/index';

const router = await createFSRouter('./src/routes');

export default await bootstrap({
	router,
	publicDir: './public',
});
