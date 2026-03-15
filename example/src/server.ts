import Buniverse from 'buniverse';
import { createFSRouter } from 'buniverse/router/fs';

const router = await createFSRouter('./src/routes');


const server = await Buniverse.bootstrap({
	router,
	publicDir: './public',
});

export default server;
