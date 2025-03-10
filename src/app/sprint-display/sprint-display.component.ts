import { Component } from '@angular/core';

@Component({
  selector: 'app-sprint-display',
  templateUrl: './sprint-display.component.html',
  styleUrls: ['./sprint-display.component.scss']
})
export class SprintDisplayComponent {
  sprintListArray:any=[]

  ngOnInit(){
    this.sprintListArray = JSON.parse(localStorage.getItem('sprintData') || '[]');
  }
}
