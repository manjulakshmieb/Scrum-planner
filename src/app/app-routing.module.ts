import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoryFormComponent } from './story-form/story-form.component';
import { SprintFormComponent } from './sprint-form/sprint-form.component';
import { StoryListComponent } from './story-list/story-list.component';
import { SprintDisplayComponent } from './sprint-display/sprint-display.component';

const routes: Routes = [
  {path:'story',component:StoryFormComponent},
  {path: '', redirectTo:'story', pathMatch: 'full'},
  {path:'sprint',component:SprintFormComponent},
  {path:'storylist',component:StoryListComponent},
  {path:'sprintlist',component:SprintDisplayComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
