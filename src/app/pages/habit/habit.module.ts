import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HabitPageRoutingModule } from './habit-routing.module';

import { HabitPage } from './habit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HabitPageRoutingModule
  ],
  declarations: [HabitPage]
})
export class HabitPageModule {}
