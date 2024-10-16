import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Teacher } from '@interfaces/teacher';
import { Observable, tap } from 'rxjs';

interface TeacherService {
  teachers: Teacher[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  private http = inject(HttpClient);
  #teacher = signal<TeacherService>({
    teachers: [],
    loading: true,
  });

  public teachers = computed(() => this.#teacher().teachers);
  public loading = computed(() => this.#teacher().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(teachers: Teacher[]) {
    if (teachers.length > 0) {
      localStorage.setItem(
        'teachers',
        JSON.stringify(this.#teacher().teachers)
      );
    } else {
      localStorage.removeItem('teachers');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('teachers')) {
      this.#teacher.set({
        loading: false,
        teachers: JSON.parse(localStorage.getItem('teachers')!),
      });
    } else {
      this.getAllTeachers();
    }
  }

  public postTeacher(teacher: Partial<Teacher>): Observable<Teacher> {
    return this.http
      .post<Teacher>(`${environment.url_api}/teachers/`, teacher)
      .pipe(
        tap((resTeacher) => {
          const oldTeacher = this.#teacher().teachers;
          oldTeacher.push(resTeacher);
          this.#teacher.set({
            loading: false,
            teachers: oldTeacher,
          });
          this.saveStorage(this.#teacher().teachers);
        })
      );
  }

  public getAllTeachers(): void {
    this.#teacher.set({
      loading: true,
      teachers: this.#teacher().teachers,
    });
    this.http.get<Teacher[]>(`${environment.url_api}/teachers/`).subscribe(
      (res) => {
        this.#teacher.set({
          loading: false,
          teachers: res,
        });
      },
      (error) => {
        this.#teacher.set({
          loading: false,
          teachers: [],
        });
      }
    );
  }

  public updateTeacher(id: number, teacher: Partial<Teacher>) {
    return this.http
      .patch<Teacher>(`${environment.url_api}/teachers/${id}`, teacher)
      .pipe(
        tap((resTeacher) => {
          const oldTeacher = this.#teacher().teachers;
          const index = oldTeacher.findIndex(
            (i) => i.id_teacher === resTeacher.id_teacher
          );
          oldTeacher[index] = resTeacher;
          this.#teacher.set({
            loading: false,
            teachers: oldTeacher,
          });
          this.saveStorage(this.#teacher().teachers);
        })
      );
  }

  public deleteTeacher(id: number) {
    this.#teacher.set({
      loading: false,
      teachers: this.teachers().filter((i) => i.id_teacher !== id),
    });
    this.saveStorage(this.#teacher().teachers);
    return this.http.delete(`${environment.url_api}/teachers/${id}`);
  }

  public updateTeachers(teachers: Teacher[]) {
    this.#teacher.set({
      loading: false,
      teachers,
    });
  }
}
