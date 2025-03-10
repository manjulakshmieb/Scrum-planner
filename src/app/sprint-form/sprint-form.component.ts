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
  // Convert storypoints from string to number
  const storiesWithNumericPoints = stories.map(story => ({
    ...story,
    storypoints: parseInt(story.storypoints, 10)
  }));
  
  // Sort stories by storypoints in descending order (largest first)
  const sortedStories = [...storiesWithNumericPoints].sort((a, b) => 
    b.storypoints - a.storypoints
  );
  
  let remainingCapacity = capacity;
  const selectedStories: any[] = [];
  
  // First pass: Add large stories that fit
  for (const story of sortedStories) {
    if (story.storypoints <= remainingCapacity) {
      // Find original story object
      const originalStory = stories.find(s => s.storyname === story.storyname);
      selectedStories.push(originalStory);
      remainingCapacity -= story.storypoints;
    }
  }
  
  // Sort selected stories by storypoints (to match expected output order)
  return selectedStories.sort((a, b) => 
    parseInt(b.storypoints, 10) - parseInt(a.storypoints, 10)
  );
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

