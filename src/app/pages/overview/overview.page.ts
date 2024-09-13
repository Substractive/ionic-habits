import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  habits = this.database.getHabits();
  newHabitName = 'My test string';
  @ViewChild('modal') modal!: IonModal;

  constructor(private database: DatabaseService) { }

  ngOnInit() {
  
  }

  async addHabit(){
    const result = await this.database.addHabit(this.newHabitName);
    console.log("Result: ", result);
    
    this.modal.dismiss();
    this.newHabitName = '';
  }

}
