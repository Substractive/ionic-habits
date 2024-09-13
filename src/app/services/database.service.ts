import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';

const DB_HABITS = 'habitsdb';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private habits = new BehaviorSubject<any[]>([]);

  constructor() { }

  async initializePlugin() {
    if (!Capacitor.isNativePlatform()) {
      await this.sqlite.initWebStore();
    }

    this.db = await this.sqlite.createConnection(
      DB_HABITS,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    /**
     * DB SCHEMA
     */
    const schema = `CREATE TABLE IF NOT EXISTS habits(
      id INTEGER PRIMARY KEY,
      name TEXT,
      reminder_id TEXT,
      reminder_hour TEXT,
      reminder_minute TEXT
    );`;

    await this.db.execute(schema);

    this.loadHabits();
    return true;
  }

  async loadHabits() {
    const habits = await this.db.query('SELECT * FROM habits');
    this.habits.next(habits.values || []); // emmit new data
  }

  getHabits() {
    return this.habits.asObservable();
  }

  async addHabit(name: string){
    const query = `INSERT INTO habits (name) VALUES ('${name}')`;
    const result = await this.db.query(query);

    this.loadHabits();
    if(!Capacitor.isNativePlatform()){
      // saveToStore when working on web because when you insert into DB it's actually only in memory. After refresh data is gone so this function call will store data in db file
      this.sqlite.saveToStore(DB_HABITS);
    }
    return result;
  }
}
