import server from './app';

async function start(port = 3000) {
  const app = server({ logger: true });
  try {
    await app.listen(port);
    const nodeEnv = process.env.NODE_ENV || 'development';
    app.log.info(
      `App is running at ${JSON.stringify(
        app.server.address(),
      )} in ${nodeEnv} mode`,
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start(process.argv[2] ? parseInt(process.argv[2], 10) : undefined);
