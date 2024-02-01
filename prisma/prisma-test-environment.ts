/* eslint-disable import/no-extraneous-dependencies */
import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import { exec } from 'node:child_process';
import crypto from 'node:crypto';
import util from 'node:util';
import { Client } from 'pg';
import { resolve } from 'path';

// dotenv.config({ path: '.env.testing' });
dotenv.config({ path: resolve(__dirname, '..', '.env.testing') });
const execSync = util.promisify(exec);

const prismaBinary = './node_modules/.bin/prisma';

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    super(config, _context);

    this.schema = `test_${crypto.randomUUID()}`;
    // this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`;
    this.connectionString = `${process.env.DATABASE_URLTEST}${this.schema}`;
  }

  async setup() {
    console.log('Setting up test environment');
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await execSync(`npx prisma migrate deploy`); // Alteração feita aqui
    return super.setup();
  }

  async teardown() {
    console.log('Tearing down test environment');
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();
  }
}
