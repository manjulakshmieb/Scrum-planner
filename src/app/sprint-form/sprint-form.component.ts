import { Component } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sprint-form',
  templateUrl: './sprint-form.component.html',
  styleUrls: ['./sprint-form.component.scss']
})
export class SprintFormComponent {
  
  formSubmitData!:FormGroup
  storyFormData:any=[]
  selectedStories:any=[]
  totelStoryPoinsts:any=0
  constructor(private toastr:ToastrService,public router: Router){
  }


  ngOnInit(){
    this.formSubmitData=new FormGroup({
      sprintName:new FormControl(''),
      sprintPoints:new FormControl(''),
    })
    this.storyFormData = JSON.parse(localStorage.getItem('storyDataSave') || '[]');

  }

  submitForm(){
    const sprintCapacity = this.formSubmitData.value.sprintPoints;
    let remainingCapacity = sprintCapacity;
    const sortedStories = [...this.storyFormData].sort((a, b) => b.storypoints - a.storypoints);
    if (this.formSubmitData.invalid) {
      this.toastr.error("Please fill in all fields correctly.")
      return;
    }else{
    const selectedStories = this.selectOptimalStories(sortedStories, sprintCapacity);
    let existingData = JSON.parse(localStorage.getItem('sprintData') || '[]');
    const lastItem = existingData.slice(-1)[0]
    let sprintData={
      sprintName:this.formSubmitData.value.sprintName,
      stories:selectedStories,
      totelPoints:this.formSubmitData.value.sprintPoints,
      slNo:lastItem ? lastItem.slNo + 1 : 1
    }
   if(existingData) {
    existingData.push(sprintData); 
    localStorage.setItem('sprintData', JSON.stringify(existingData));
    this.toastr.success("Sprint autogenerted successfully")
    this.formSubmitData.reset();
    this.router.navigate(['sprintlist']);
  }else{
    this.toastr.success("No story available in this point")
  }

    }
  }

  private selectOptimalStories(stories: any[], capacity: number): any[] {
    if (!stories || stories.length === 0 || capacity <= 0) {
      return [];
    }
    const storiesWithPoints = stories.map(story => ({
      originalStory: story,
      points: parseInt(story.storypoints, 10)
    }));
    const validStories = storiesWithPoints.filter(story => 
      !isNaN(story.points) && story.points > 0
    );
    if (validStories.length === 0) {
      return [];
    }
    if (capacity === 13) {
      const selected = this.findBestFit(validStories, 13);
      return selected.map(s => s.originalStory);
    }
    if (capacity === 9) {
      const selected = this.findBestFit(validStories, 9);
      return selected.map(s => s.originalStory);
    }
    const selectedStories = this.findBestFit(validStories, capacity);
    return selectedStories.map(s => s.originalStory);
  }
  private findBestFit(stories: { originalStory: any; points: number }[], capacity: number) {
    let bestFit: { originalStory: any; points: number }[] = [];
    let bestSum = 0;
  
    const findCombination = (index: number, currentList: typeof stories, currentSum: number) => {
      if (currentSum > capacity) return;
      if (currentSum > bestSum) {
        bestSum = currentSum;
        bestFit = [...currentList];
      }
      if (index >= stories.length) return;
      findCombination(index + 1, [...currentList, stories[index]], currentSum + stories[index].points);
      findCombination(index + 1, currentList, currentSum);
    };
    findCombination(0, [], 0);
    return bestFit;
  }
  

  clearStroy(){
    localStorage.removeItem('storyDataSave');
    this.toastr.success("Story cleared successfully")
  }

  clearSprint(){
    localStorage.removeItem('sprintData');
    this.toastr.success("Sprint cleared successfully")
  }

  onInputChange(event: any) {
    const value = event.target.value;
    // Remove any non-numeric characters
    event.target.value = value.replace(/[^0-9]/g, '');
  }

}

