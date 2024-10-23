import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Student } from '@interfaces/student';
import { Task } from '@interfaces/task';
import { Observable, tap } from 'rxjs';

interface TaskService {
  tasks: Task[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);
  #task = signal<TaskService>({
    tasks: [],
    loading: true,
  });

  public tasks = computed(() => this.#task().tasks);
  public loading = computed(() => this.#task().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(tasks: Task[]) {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(this.#task().tasks));
    } else {
      localStorage.removeItem('tasks');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('tasks')) {
      this.#task.set({
        loading: false,
        tasks: JSON.parse(localStorage.getItem('tasks')!),
      });
    } else {
      this.getAllTasks();
    }
  }

  public postTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${environment.url_api}/tasks/`, task).pipe(
      tap((resTask) => {
        const oldTask = this.#task().tasks;
        oldTask.push(resTask);
        this.#task.set({
          loading: false,
          tasks: oldTask,
        });
        this.saveStorage(this.#task().tasks);
      })
    );
  }

  public getAllTasks(): void {
    this.#task.set({
      loading: true,
      tasks: this.#task().tasks,
    });
    this.http.get<Task[]>(`${environment.url_api}/tasks/`).subscribe(
      (res) => {
        this.#task.set({
          loading: false,
          tasks: res,
        });
      },
      (error) => {
        this.#task.set({
          loading: false,
          tasks: [],
        });
      }
    );
  }

  public getAllTasksByStudent(id: number): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${environment.url_api}/tasks/byStudent/${id}`
    );
  }

  public updateTask(id: number, task: Partial<Task>) {
    return this.http
      .patch<Task>(`${environment.url_api}/tasks/${id}`, task)
      .pipe(
        tap((resTask) => {
          const oldTask = this.#task().tasks;
          const index = oldTask.findIndex((i) => i.id_task === resTask.id_task);
          oldTask[index] = resTask;
          this.#task.set({
            loading: false,
            tasks: oldTask,
          });
          this.saveStorage(this.#task().tasks);
        })
      );
  }

  public deleteTask(id: number) {
    this.#task.set({
      loading: false,
      tasks: this.tasks().filter((i) => i.id_task !== id),
    });
    this.saveStorage(this.#task().tasks);
    return this.http.delete(`${environment.url_api}/tasks/${id}`);
  }

  public updateTasks(tasks: Task[]) {
    this.#task.set({
      loading: false,
      tasks,
    });
  }
}
