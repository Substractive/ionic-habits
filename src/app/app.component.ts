import { Component } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isWeb = false;

  constructor() {
    this.testDatabase();
  }

  async testDatabase() {

    if (!Capacitor.isNativePlatform()) {
      this.isWeb = true;
      await customElements.whenDefined('jeep-sqlite');
      console.log('JEEP ready');
    }

    const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);

    if (this.isWeb) {
      await sqlite.initWebStore();
    }

    let db: SQLiteDBConnection = await sqlite.createConnection('appdb', false, 'no-encryption', 1, false);

    try {
      await db.open();
      // after successful db open we can work with our DB

      /**
       *  SQL for creating table and inserting some test data
       *
      const schema = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email TEXT UNIQUE NOT NULL, age INTEGER);`;

      let result = await db.execute(schema); // execute sql

      const users = `
      DELETE FROM users;
      INSERT INTO users (id, email, age) VALUES (1, 'aa@bb', 31);
      INSERT INTO users (id, email, age) VALUES (2, 'bb@cc', 34);
      INSERT INTO users (id, email, age) VALUES (3, 'cc@dd', 29);
      `;

      result = await db.execute(users);

      console.log("Users insert Result ", result);
       */

      sqlite.saveToStore('appdb'); // For web usage
      const res = await db.query('SELECT * FROM users');

      console.log('Users from DB ', JSON.stringify(res));

      await sqlite.closeAllConnections();


    } catch (e) {
      console.error('ERROR: ', e);
      await sqlite.closeAllConnections();
      // close connections to avoid problems if DB already has connection hanging
    }
  }
}
