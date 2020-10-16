import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../classes/course";
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {CourseService} from "../../services/course.service";

@Component({
  selector: 'app-course-index',
  templateUrl: './course-index.component.html',
  styleUrls: ['./course-index.component.css']
})
export class CourseIndexComponent implements OnInit {


  @Input("course")
  public course: Course;


  public editingContent: Boolean = false;
  editorForm: FormGroup;


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  constructor(public authenticationService: AuthenticationService, private formBuilder: FormBuilder, private courseService: CourseService) {
    this.createForm()
  }


  createForm() {
    this.editorForm = this.formBuilder.group({
      'htmlContent': ['']
    });
  }

  ngOnInit() {
  }

  submit() {

    this.course.courseDetails.info = this.editorForm.value['htmlContent'];

    this.courseService.editCourse(this.course, "updating course info").subscribe(resp => {

      this.course = resp;
      this.editingContent = false;
    });

  }


}
