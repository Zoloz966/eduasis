import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Course } from '@interfaces/course';
import { Observable, tap } from 'rxjs';

interface CourseService {
  courses: Course[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private http = inject(HttpClient);
  #course = signal<CourseService>({
    courses: [],
    loading: true,
  });

  public courses = computed(() => this.#course().courses);
  public loading = computed(() => this.#course().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(courses: Course[]) {
    if (courses.length > 0) {
      localStorage.setItem(
        'courses',
        JSON.stringify(this.#course().courses)
      );
    } else {
      localStorage.removeItem('courses');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('courses')) {
      this.#course.set({
        loading: false,
        courses: JSON.parse(localStorage.getItem('courses')!),
      });
    } else {
      this.getAllCourses();
    }
  }

  public postCourse(course: Partial<Course>): Observable<Course> {
    return this.http
      .post<Course>(`${environment.url_api}/courses/`, course)
      .pipe(
        tap((resCourse) => {
          const oldCourse = this.#course().courses;
          oldCourse.push(resCourse);
          this.#course.set({
            loading: false,
            courses: oldCourse,
          });
          this.saveStorage(this.#course().courses);
        })
      );
  }

  public getAllCourses(): void {
    this.#course.set({
      loading: true,
      courses: this.#course().courses,
    });
    this.http.get<Course[]>(`${environment.url_api}/courses/`).subscribe(
      (res) => {
        this.#course.set({
          loading: false,
          courses: res,
        });
      },
      (error) => {
        this.#course.set({
          loading: false,
          courses: [],
        });
      }
    );
  }

  public updateCourse(id: number, course: Partial<Course>) {
    return this.http
      .patch<Course>(`${environment.url_api}/courses/${id}`, course)
      .pipe(
        tap((resCourse) => {
          const oldCourse = this.#course().courses;
          const index = oldCourse.findIndex(
            (i) => i.id_course === resCourse.id_course
          );
          oldCourse[index] = resCourse;
          this.#course.set({
            loading: false,
            courses: oldCourse,
          });
          this.saveStorage(this.#course().courses);
        })
      );
  }

  public deleteCourse(id: number) {
    this.#course.set({
      loading: false,
      courses: this.courses().filter((i) => i.id_course !== id),
    });
    this.saveStorage(this.#course().courses);
    return this.http.delete(`${environment.url_api}/courses/${id}`);
  }

  public updateCourses(courses: Course[]) {
    this.#course.set({
      loading: false,
      courses,
    });
  }
}
