import 'reflect-metadata';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import path from 'path';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Like } from '../entities/Like'
import { Follow } from '@/entities/Follow';
import { Message } from '@/entities/Message';
import { Reply } from '@/entities/Reply';

// データソースの定義
const dbUrl = process.env.POSTGRES_URL;

const appDataSource = new DataSource(
  dbUrl
    ? {
        type: 'postgres',
        url: dbUrl,
        synchronize: true,
        logging: true,
        entities: [User, Post, Like, Follow, Message, Reply],
        migrations: [path.join(__dirname, '../migrations/*.ts')],
        subscribers: [],
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        type: 'sqlite',
        database: path.join(process.cwd(), 'database.sqlite'),
        synchronize: true,
        logging: true,
        entities: [User, Post, Like, Follow, Message, Reply],
        migrations: [path.join(__dirname, '../migrations/*.ts')],
        subscribers: [],
      }
);

// 初期化済みインスタンスを保持する変数
let initializedDataSource: DataSource | null = null;

// データソースを取得・初期化する関数
export const getDataSource = async (): Promise<DataSource> => {
  // すでに初期化済みならそれを返す
  if (initializedDataSource && initializedDataSource.isInitialized) {
    return initializedDataSource;
  }

  // まだ初期化されていない、または初期化中の場合は初期化する
  if (!appDataSource.isInitialized) {
  try {
    initializedDataSource = await appDataSource.initialize();
  } catch (error) {
    // 💡 エラー内容を「db_error.txt」というファイルに強制保存する
    import('fs').then((fs) => {
      fs.writeFileSync('db_error.txt', String(error));
    });
    console.error("❌ DBの初期化に失敗しました:", error);
    throw error;
  }} else {
    initializedDataSource = appDataSource;
  }

  return initializedDataSource;
};

// リポジトリ取得用のショートカット
export const getRepository = async <T extends ObjectLiteral>(
  entity: EntityTarget<T>
): Promise<Repository<T>> => {
  const dataSource = await getDataSource();
  return dataSource.getRepository(entity);
};

// マイグレーション用などはAppDataSourceを直接使う
export const AppDataSource = appDataSource;
