import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NavController, ToastController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-habit',
  templateUrl: './habit.page.html',
  styleUrls: ['./habit.page.scss'],
})
export class HabitPage implements OnInit {
  habit: any = null;
  constructor(private route: ActivatedRoute, private database: DatabaseService, private navCtrl: NavController, private toastCtrl: ToastController) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.habit = await this.database.getHabitById(id);
      console.log('My Habit: ', this.habit);

    }
  }

  async updateHabit() {
    await this.database.updateHabitById(this.habit.id, this.habit.name);
    const toast = await this.toastCtrl.create({
      message: 'Habit Updated',
      duration: 1000,
      position: 'bottom'
    });

    await toast.present();
  }

  async deleteHabit() {
    await this.database.deleteHabitById(this.habit.id);
    this.navCtrl.pop();
  }


  async test() {
    await LocalNotifications.checkPermissions();
    await LocalNotifications.requestPermissions();
    const randomId = Math.floor(Math.random() * 10000) + 1;

    const res = await LocalNotifications.schedule({
      notifications: [
        {
          title: 'My Habit reminder',
          body: 'Have you done your habit??',
          id: randomId,
          extra: {
            data: { id: this.habit?.id },
          }
        }
      ]
    });
  }
}
