import { Component } from '@angular/core';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent {
  storylistArray:any=[]

  ngOnInit(){
    this.storylistArray = JSON.parse(localStorage.getItem('storyDataSave') || '[]');
  }
  
}
