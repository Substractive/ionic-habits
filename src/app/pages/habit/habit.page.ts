import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NavController, ToastController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-habit',
  templateUrl: './habit.page.html',
  styleUrls: ['./habit.page.scss'],
})
export class HabitPage implements OnInit {
  habit: any = null;
  selectedTime = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss'Z'");

  constructor(private route: ActivatedRoute, private database: DatabaseService, private navCtrl: NavController, private toastCtrl: ToastController) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.habit = await this.database.getHabitById(id);
      console.log('My Habit: ', this.habit);

      if (this.habit.reminder_id) {
        const date = new Date();
        date.setHours(this.habit.reminder_hour);
        date.setMinutes(this.habit.reminder_minute);
        this.selectedTime = format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
      }
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


  async onTimeSelected() {
    await LocalNotifications.checkPermissions();
    await LocalNotifications.requestPermissions();

    // cancel previous notification if exists
    if(this.habit?.reminder_id){
      await this.cancelNotifications();
    }

    const randomId = Math.floor(Math.random() * 10000) + 1;
    const hour = +format(parseISO(this.selectedTime), 'HH'); // + to conver to number type because schedule on wants number type
    const minute = +format(parseISO(this.selectedTime), 'mm'); // + to conver to number type because schedule on wants number type

    const res = await LocalNotifications.schedule({
      notifications: [
        {
          title: 'My Habit reminder',
          body: `Have you done ${this.habit.name}?`,
          id: randomId,
          extra: {
            data: { id: this.habit?.id },
          },
          schedule: {
            repeats: true, // repeat every day or something?
            on: {
              hour,
              minute
            },
            allowWhileIdle: true
          }
          //  schedule: { at: new Date(Date.now() + 1000 * 3)}
        }
      ]
    });

    console.log(res);
    const test = await LocalNotifications.getPending();
    console.log("Pending notifications: ", test);

    // ID of the reminder created is important if we want to cancel it.
    // That is why we are getting ID from  res.notifications[0].id and storing it in DB

    await this.database.updateHabitReminderById(
      this.habit.id,
      res.notifications[0].id,
      `${hour}`,
      `${minute}`
    );

    this.habit = await this.database.getHabitById(this.habit.id);

  }

  async cancelNotifications() {
    await LocalNotifications.cancel({ notifications: [{ id: this.habit.reminder_id }] });

    await this.database.updateHabitReminderById(
      this.habit.id,
      null,
      null,
      null
    );

    this.habit = await this.database.getHabitById(this.habit.id);
  }
}
