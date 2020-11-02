import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';
import { dbConnectionOptions } from './config';

// Declare WebpackHotModule for auto-restart typing
type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void,
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

declare const module: WebpackHotModule;

createConnection(dbConnectionOptions).then(connection => {
  /**
  * Server Activation
  */
  const PORT: number = parseInt(process.env.PORT as string, 10);

  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

  /**
   * Webpack HMR Activation
   */
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.close());
  }

}).catch(error => console.log(error));
