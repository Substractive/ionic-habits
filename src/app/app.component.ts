import { Component } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { DatabaseService } from './services/database.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isWeb = false;

  constructor(private database: DatabaseService) {
    this.initApp();
  }

  async initApp(){
    if(!Capacitor.isNativePlatform()){
      this.isWeb = true;
      const res = await customElements.whenDefined('jeep-sqlite');
    }

    await this.database.initializePlugin();

    console.log('APP READY');
    
    SplashScreen.hide();
  }

}
