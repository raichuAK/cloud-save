import Database from './db.util.mjs';
import { DataTypeOIDs } from 'postgresql-client';
import format from 'pg-format';

const createSchema = `
create table if not exists Page( 
  pageName varchar(500) constraint page_pk primary key,
  count bigint
);
`;

class APIservice {
  async getConnection() {
    const db = new Database();
    const conn = await db.getPool();
    return conn;
  }

  async getPages(pageName) {
    let dbConnection;
    let statement;
    try {
      dbConnection = await this.getConnection();
      await dbConnection.connect();
      let resultSet;
      if (pageName === 'all') {
        resultSet = await dbConnection.query(
          'SELECT pg.pageName, pg.count  FROM public.Page pg',
        );
      } else {
        resultSet = await dbConnection.query(
          'SELECT pg.pageName, pg.count  FROM public.Page pg WHERE pg.pageName = $1', pageName 
        );
      }
      return resultSet.rows;
    } catch (error) {
      throw new Error(error); // TODO make this custom application error object
    } finally {
      if (statement) {
        await statement.close();
      }
    }
  }

  async savePage(page) {
    let dbConn;
    try {
      const pageExist = await this.getPages([page.pageName]);

      dbConn = await this.getConnection();
      await dbConn.connect();
      
      if(pageExist && pageExist.length) {
        page.count = Number(pageExist[0].count) + 1;
      } else {
        page.count = 1;
      }
      let sql = `insert into Page(pageName, count) values ( '${page.pageName}', ${page.count}  ) ON CONFLICT ON CONSTRAINT page_pk DO UPDATE SET count = ${page.count}`;
      const resp = await dbConn.query(
        sql
      );
      return resp;
    } catch (error) {
      throw new Error(error); // TODO make this custom application error object
    } finally {
    }
  } 
}

export default APIservice;