import { Component } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { DatabaseService } from './services/database.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { ActionPerformed, LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isWeb = false;

  constructor(private database: DatabaseService, private navCtrl: NavController) {
    this.initApp();
    this.setupNotificationListener();
  }

  async initApp() {
    if (!Capacitor.isNativePlatform()) {
      this.isWeb = true;
      const res = await customElements.whenDefined('jeep-sqlite');
    }

    await this.database.initializePlugin();

    console.log('APP READY');

    SplashScreen.hide();
  }

  setupNotificationListener() {
    LocalNotifications.addListener(
      'localNotificationReceived',
      (notification: LocalNotificationSchema) => {
        console.log('RECIEVED: ', notification);

      }
    );

    LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('PERFORMED: ', action);
        const habitID = action.notification.extra.data.id;
        console.log('ID: ', habitID);
        this.navCtrl.navigateForward(`habit/${habitID}`);

      }
    );

  }

}
