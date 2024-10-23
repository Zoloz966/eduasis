import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-grades-student',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './grades-student.component.html',
})
export default class GradesStudentComponent implements OnInit {

  ngOnInit(): void { }

}
