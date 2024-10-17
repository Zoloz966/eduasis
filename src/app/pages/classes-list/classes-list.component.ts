import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Class, Shift } from '@interfaces/class';
import { LayoutService } from '@services/layout.service';
import { ClassesService } from '@services/classes.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardEmptyListComponent } from '@shared/card-empty-list/card-empty-list.component';
import { CoursesService } from '@services/courses.service';
import { SubjectsService } from '@services/subject.service';
import { TeachersService } from '@services/teachers.service';

@Component({
  selector: 'app-classes-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OverlayPanelModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    SkeletonModule,
    ToastModule,
    InputTextModule,
    CardEmptyListComponent,
    SidebarModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './classes-list.component.html',
})
export default class ClassesListComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  public layoutService = inject(LayoutService);
  public messageService = inject(MessageService);
  public confirmationService = inject(ConfirmationService);
  private classesService = inject(ClassesService);
  private coursesService = inject(CoursesService)
  private subjectsServices = inject(SubjectsService)
  private teachersService = inject(TeachersService)

  public courses = this.coursesService.courses
  public loadingCourses = this.coursesService.loading

  public subjects = this.subjectsServices.subjects
  public loadingSubjects = this.subjectsServices.loading

  public teachers = this.teachersService.teachers
  public loadingTeachers = this.teachersService.loading

  public classes = this.classesService.classes;
  public filteredClasses = [...this.classesService.classes()];
  public loading = this.classesService.loading;

  public filterOptions = [
    Shift.Mañana,
    Shift.Tarde,
    Shift.Nocturno,
    'Todo',
  ];
  public selectOptions = [
    Shift.Mañana,
    Shift.Tarde,
    Shift.Nocturno,
  ];
  public valueFilter = this.filterOptions.find((option) => option === 'Todo');

  public selectedClass: Class = {
    id_class: 0,
    class_name: '',
    shift: Shift.Mañana,
    courseIdCourse: 1,
    subjectIdSubject: 1,
    teacherIdTeacher: 1,
  };

  public inputsDirt = {
    class_name: false,
    shift: false,
    course: false,
    subject: false,
    teacher: false
  };

  public skeletonTab = [1, 2, 3, 4, 5, 6, 7];

  public showClass: boolean = false;

  ngOnInit(): void {
    this.coursesService.getAllCourses()
    this.teachersService.getAllTeachers()
    this.subjectsServices.getAllSubjects()
    this.classesService.getAllClasses();
    console.log(this.classes());
  }

  public createClass() {
    this.selectedClass = {
      id_class: 0,
      class_name: '',
      shift: Shift.Mañana,
      courseIdCourse: 1,
      subjectIdSubject: 1,
      teacherIdTeacher: 1,
    };
    this.showClass = true;
  }

  public editClass(classes: Class) {
    this.selectedClass = classes;
    console.log(classes);
    console.log(this.teachers());


    this.showClass = true;
  }

  public deleteClass(classes: Class) {
    this.confirmationService.confirm({
      message: 'Esta seguro de eliminar La Clase ' + classes.class_name,
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-danger w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.classesService
          .deleteClass(classes.id_class)
          .subscribe((_) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación exitosa',
              detail: `Materia ${classes.class_name} eliminado exitosamente`,
            });
          });
      },
    });
  }

  public async saveClass() {
    if (!(await this.passClassForm())) return;

    const newClass: Partial<Class> = {
      class_name: this.selectedClass.class_name,
      shift: this.selectedClass.shift,
      courseIdCourse: this.selectedClass.course?.id_course,
      subjectIdSubject: this.selectedClass.subject?.id_subject,
      teacherIdTeacher: this.selectedClass.teacher?.id_teacher,
    };
    if (this.selectedClass.id_class === 0) {
      this.classesService.postClass(newClass).subscribe((resClass) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creación exitosa',
          detail: `La Clase ${resClass.class_name} se creo exitosamente`,
        });
        this.dt.reset();
        this.showClass = false;
      });
    } else {
      this.classesService
        .updateClass(this.selectedClass.id_class, newClass)
        .subscribe((resClass) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Creación exitosa',
            detail: `La Clase ${resClass.class_name} se actualizo exitosamente`,
          });
          this.dt.reset();
          this.showClass = false;
        });
    }
  }

  public passClassForm(): Promise<boolean> {
    if (!this.selectedClass.class_name) {
      this.inputsDirt.class_name = true;
      return Promise.resolve(false);
    }
    if (!this.selectedClass.course) {
      this.inputsDirt.course = true;
      return Promise.resolve(false);
    }
    if (!this.selectedClass.teacher) {
      this.inputsDirt.teacher = true;
      return Promise.resolve(false);
    }
    if (!this.selectedClass.subject) {
      this.inputsDirt.subject = true;
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }

  public filterClassesByShift(event: DropdownChangeEvent) {

    if (!event.value || event.value === 'Todo') {
      this.classesService.updateClasses(this.filteredClasses);
      this.dt.reset();
    } else {
      const filterClasses = this.filteredClasses.filter((classes) => {
        return classes.shift === event.value;
      });

      this.classesService.updateClasses(filterClasses);
      this.dt.reset();
    }
  }
}
