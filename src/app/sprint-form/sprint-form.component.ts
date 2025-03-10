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
    // Use dynamic programming to find optimal subset
    const selectedStories = this.selectOptimalStories(sortedStories, sprintCapacity);

    // this.selectedStories = this.getOptimalStories(this.storyFormData,sprintCapacity);
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
    this.totelStoryPoinsts = Math.min(...stories.map(story => story.storypoints));
    if (capacity < this.totelStoryPoinsts) {
      return [];
    }
    const dp: number[][] = Array(stories.length + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0));
    for (let i = 1; i <= stories.length; i++) {
      for (let j = 0; j <= capacity; j++) {
        const story = stories[i - 1];
        if (story.storypoints <= j) {
          dp[i][j] = Math.max(
            dp[i - 1][j],                          
            dp[i - 1][j - story.storypoints] + story.storypoints 
          );
        } else {
          dp[i][j] = dp[i - 1][j];
        }
      }
    
  }

  const selectedStories: any[] = [];
    let remainingCapacity = capacity;
    
    for (let i = stories.length; i > 0 && remainingCapacity > 0; i--) {
      // If this story was included in the optimal solution
      if (dp[i][remainingCapacity] !== dp[i - 1][remainingCapacity]) {
        const story = stories[i - 1];
        selectedStories.push(story);
        remainingCapacity -= story.storypoints;
      }
    }
    return selectedStories;
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

