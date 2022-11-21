import mongoose from 'mongoose';
import { FatalErrorException } from '../exception/fatal-error.exception';

interface ConnectMongoOptions {
  name?: string; // default: default
  uri: string;
  connectOptions?: mongoose.ConnectOptions;
}

const ConnectionMap = new Map<string, mongoose.Connection>();

export const ConnectMongoStore = {
  getConnection(name: string) {
    return ConnectionMap.get(name);
  },
  hasConnection(name: string) {
    return ConnectionMap.has(name);
  },
};

export async function connectMongo(options: ConnectMongoOptions) {
  return new Promise((resolve) => {
    const connectionName = options.name || 'default';

    if (ConnectMongoStore.hasConnection(connectionName)) {
      throw new FatalErrorException(`Duplicate connect mongo connection ${connectionName}`);
    }

    mongoose.createConnection(options.uri, options.connectOptions || {}, (error, connection) => {
      if (error) {
        throw new FatalErrorException(
          `Have an error when during connect mongo connection ${connectionName}\n\toptions:${JSON.stringify(
            options
          )}`,
          error.stack
        );
      }

      ConnectionMap.set(connectionName, connection);

      resolve(connection);
    });
  });
}
