// models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  INSTANCE_CONNECTION_NAME,
  NODE_ENV
} = process.env;

const isProd = NODE_ENV === 'production';

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: 'mysql',
  dialectOptions: isProd
    ? { socketPath: `/cloudsql/${INSTANCE_CONNECTION_NAME}` }
    : {},
  host:     isProd ? undefined : DB_HOST,
  port:     isProd ? undefined : (DB_PORT || 3306),
  pool: {
    max:     5,
    min:     0,
    acquire: 30000,
    idle:    10000
  },
  logging: false,
});

// import models
import User from './User.js';
import Book from './Book.js';
import Exchange from './Exchange.js';
import ExchangeHistory from './ExchangeHistory.js';

// associations
// User ↔ Book
Book.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
User.hasMany(Book, { foreignKey: 'userId', as: 'books' });

// Book ↔ Exchange (offered/requested)
Book.hasMany(Exchange, { foreignKey: 'offeredBookId',   as: 'offeredExchanges',   onDelete: 'CASCADE', hooks: true });
Book.hasMany(Exchange, { foreignKey: 'requestedBookId', as: 'requestedExchanges', onDelete: 'CASCADE', hooks: true });

// Exchange ↔ Book
Exchange.belongsTo(Book, { foreignKey: 'offeredBookId',   as: 'offeredBook' });
Exchange.belongsTo(Book, { foreignKey: 'requestedBookId', as: 'requestedBook' });

// Exchange ↔ User
Exchange.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Exchange.belongsTo(User, { foreignKey: 'ownerId',     as: 'owner' });

// Exchange ↔ ExchangeHistory
Exchange.hasOne(ExchangeHistory, { foreignKey: 'exchangeRequestId', as: 'history' });
ExchangeHistory.belongsTo(Exchange, { foreignKey: 'exchangeRequestId', as: 'parentExchange' });

export { User, Book, Exchange, ExchangeHistory };
