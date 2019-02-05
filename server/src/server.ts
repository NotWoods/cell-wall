import { config } from 'dotenv';
config();
import app from './app';

const port = process.argv[2] ? parseInt(process.argv[2], 10) : 3000;

export default app.listen(port, () => {
    console.log(
        '  App is running at http://localhost:%d in %s mode',
        port,
        process.env.NODE_ENV,
    );
    console.log('  Press CTRL-C to stop\n');
});
