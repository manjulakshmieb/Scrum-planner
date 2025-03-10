import { Component } from '@angular/core';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-story-form',
  templateUrl: './story-form.component.html',
  styleUrls: ['./story-form.component.scss']
})
export class StoryFormComponent {
  
  storyFormData!:FormGroup
  storylistArray:any=[]
  constructor(private toastr:ToastrService,public router: Router){
  }


  ngOnInit(){
    this.storyFormData=new FormGroup({
      storyname:new FormControl('',[Validators.required]),
      storypoints:new FormControl('',[Validators.required]),
      storyDes:new FormControl('',[Validators.required])
    })
    this.storylistArray = JSON.parse(localStorage.getItem('storyDataSave') || '[]');

  }

  submitForm(){
    let name_Exit=this.checkDuplicate()
    if(name_Exit) {
      this.toastr.success(`The name  already exists!`)
      return
    }
    if (this.storyFormData.invalid) {
      this.toastr.error("Please fill in all fields correctly.")
      return;
    }{
      let existingData = JSON.parse(localStorage.getItem('storyDataSave') || '[]');
      existingData.push(this.storyFormData.value); 
      localStorage.setItem('storyDataSave', JSON.stringify(existingData));
      this.toastr.success("Story added successfully")
      this.storyFormData.reset()
      this.router.navigate(['/storylist']);
    }
  }

  checkDuplicate() {
    const enteredName = this.storyFormData.value.storyname?.trim();
    const isDuplicate = this.storylistArray.some((story:any) => story.storyname.toLowerCase() === enteredName.toLowerCase());
   return isDuplicate
  }

  onInputChange(event: any) {
    const value = event.target.value;
    // Remove any non-numeric characters
    event.target.value = value.replace(/[^0-9]/g, '');
  }

}
