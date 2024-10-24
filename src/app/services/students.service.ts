import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Student } from '@interfaces/student';
import { UserResponse } from '@interfaces/user';
import { Observable, tap } from 'rxjs';

interface StudentService {
  students: Student[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private http = inject(HttpClient);
  #student = signal<StudentService>({
    students: [],
    loading: true,
  });

  public students = computed(() => this.#student().students);
  public loading = computed(() => this.#student().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(students: Student[]) {
    if (students.length > 0) {
      localStorage.setItem(
        'students',
        JSON.stringify(this.#student().students)
      );
    } else {
      localStorage.removeItem('students');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('students')) {
      this.#student.set({
        loading: false,
        students: JSON.parse(localStorage.getItem('students')!),
      });
    } else {
      this.getAllStudents();
    }
  }

  public postStudent(student: Partial<Student>): Observable<Student> {
    return this.http
      .post<Student>(`${environment.url_api}/students/`, student)
      .pipe(
        tap((resStudent) => {
          const oldStudent = this.#student().students;
          oldStudent.push(resStudent);
          this.#student.set({
            loading: false,
            students: oldStudent,
          });
          this.saveStorage(this.#student().students);
        })
      );
  }

  public getAllStudents(): void {
    this.#student.set({
      loading: true,
      students: this.#student().students,
    });
    this.http.get<Student[]>(`${environment.url_api}/students/`).subscribe(
      (res) => {
        this.#student.set({
          loading: false,
          students: res,
        });
      },
      (error) => {
        this.#student.set({
          loading: false,
          students: [],
        });
      }
    );
  }

  public getOneStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${environment.url_api}/students/${id}`);
  }

  public getOneStudentByToken(token: string): Observable<UserResponse> {
    const tokenAuth = { token };
    return this.http.post<UserResponse>(
      `${environment.url_api}/auth/login/byToken`,
      tokenAuth
    );
  }

  public updateStudent(id: number, student: Partial<Student>) {
    return this.http
      .patch<Student>(`${environment.url_api}/students/${id}`, student)
      .pipe(
        tap((resStudent) => {
          const oldStudent = this.#student().students;
          const index = oldStudent.findIndex(
            (i) => i.id_student === resStudent.id_student
          );
          oldStudent[index] = resStudent;
          this.#student.set({
            loading: false,
            students: oldStudent,
          });
          this.saveStorage(this.#student().students);
        })
      );
  }

  public deleteStudent(id: number) {
    this.#student.set({
      loading: false,
      students: this.students().filter((i) => i.id_student !== id),
    });
    this.saveStorage(this.#student().students);
    return this.http.delete(`${environment.url_api}/students/${id}`);
  }

  public updateStudents(students: Student[]) {
    this.#student.set({
      loading: false,
      students,
    });
  }
}
