import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {File} from '../../classes/file';
import {FileService} from '../../services/file.service';
import {Course} from '../../classes/course';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../../services/course.service';

@Component({
  selector: 'app-pdf-online-viewer',
  templateUrl: './pdf-online-viewer.component.html',
  styleUrls: ['./pdf-online-viewer.component.css']
})
export class PdfOnlineViewerComponent implements OnInit {

  public file: File;
  private course: Course;
  public blob: Blob;

  constructor(private fileService: FileService,
              private router: Router,
              private courseService: CourseService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    let courseId: number = Number(this.activatedRoute.snapshot.paramMap.get('courseId'));
    let fileId: number = Number(this.activatedRoute.snapshot.paramMap.get('fileId'));
    this.courseService.getCourse(courseId).subscribe(data => {
      this.course = data;
      this.course.courseDetails.files.forEach(fg => {
        this.file = fg.files.find(f => f.id === fileId);
        this.fileService.downloadFileAsBlob(courseId, this.file, (blob) => {
          this.blob = blob;
        })
      })
    }, error => {
      console.log(error);
    });
  }

  getSrcFromBlob(){
    return this.blob ? this.blob: '';
  }


  goBack() {
    this.router.navigate([`/courses/${this.course.id}/1`])
  }
}
