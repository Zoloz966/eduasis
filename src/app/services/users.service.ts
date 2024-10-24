import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  MenuItem,
  User,
  UserLog,
  UserLogin,
  UserResponse,
} from '@interfaces/user';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';

interface State {
  user: User | undefined;
  token: string | undefined;
  access: MenuItem[];
  loading: boolean;
}

interface StateUsers {
  users: User[];
  loadingUsers: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private router = inject(Router);

  public env = environment;

  private http = inject(HttpClient);

  #state = signal<State>({
    loading: true,
    user: undefined,
    token: undefined,
    access: [],
  });

  #stateUsers = signal<StateUsers>({
    loadingUsers: true,
    users: [],
  });

  public user = computed(() => this.#state().user);
  public loading = computed(() => this.#state().loading);
  public token = computed(() => this.#state().token);
  public access = computed(() => this.#state().access);

  public users = computed(() => this.#stateUsers().users);
  public loadingUsers = computed(() => this.#stateUsers().loadingUsers);

  constructor() {
    this.loadStorage();
  }

  public authLoginUser(
    credentials: UserLogin,
    remember: boolean
  ): Observable<UserResponse> {
    if (remember) {
      localStorage.setItem('email', credentials.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http
      .post<UserResponse>(`${environment.url_api}/auth/login`, credentials)
      .pipe(
        tap((res) => {
          this.saveStorage(res);

          this.#state.set({
            loading: false,
            user: res.user,
            token: res.access_token,
            access: res.user.role!.access,
          });
        })
      );
  }
  public authLoginTeacher(
    credentials: UserLogin,
    remember: boolean
  ): Observable<UserResponse> {
    if (remember) {
      localStorage.setItem('email', credentials.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http
      .post<UserResponse>(`${environment.url_api}/auth/login/teacher`, credentials)
      .pipe(
        tap((res) => {
          this.saveStorage(res);

          this.#state.set({
            loading: false,
            user: res.user,
            token: res.access_token,
            access: res.user.role!.access,
          });
        })
      );
  }
 
  public authLoginStudent(
    credentials: UserLogin,
    remember: boolean
  ): Observable<UserResponse> {
    if (remember) {
      localStorage.setItem('email', credentials.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http
      .post<UserResponse>(`${environment.url_api}/auth/login/student`, credentials)
      .pipe(
        tap((res) => {
          this.saveStorage(res);

          this.#state.set({
            loading: false,
            user: res.user,
            token: res.access_token,
            access: res.user.role!.access,
          });
        })
      );
  }

  private saveStorage(resUser: UserResponse) {
    localStorage.setItem('user', JSON.stringify(resUser.user));
    localStorage.setItem('token', resUser.access_token.toString());
    localStorage.setItem('access', JSON.stringify(resUser.user.role!.access));
  }

  private saveStorageUsers(users: User[]) {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(this.#stateUsers().users));
    } else {
      localStorage.removeItem('users');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('token')) {
      this.#state.set({
        loading: false,
        user: JSON.parse(localStorage.getItem('user')!),
        token: localStorage.getItem('token')!,
        access: JSON.parse(localStorage.getItem('access')!),
      });
      if (this.router.url.includes('/auth')) {
        this.router.navigateByUrl('');
      }
    } else {
      this.#state.set({
        loading: true,
        user: undefined,
        token: undefined,
        access: [],
      });
      this.router.navigateByUrl('/auth');
    }

    if (localStorage.getItem('users')) {
      this.#stateUsers.set({
        loadingUsers: false,
        users: JSON.parse(localStorage.getItem('users')!),
      });
    } else {
      this.getUsers();
    }
  }

  public closeSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.#state.set({
      loading: true,
      user: undefined,
      token: undefined,
      access: [],
    });
    this.router.navigateByUrl('/auth');
  }

  public postUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.env.url_api}/users`, user).pipe(
      tap((resUser) => {
        const oldUser = this.#stateUsers().users;
        oldUser.push(resUser);
        this.#stateUsers.set({
          loadingUsers: false,
          users: oldUser,
        });
        this.saveStorageUsers(this.#stateUsers().users);
      })
    );
  }

  public getUsers(): void {
    this.#stateUsers.set({
      loadingUsers: true,
      users: this.#stateUsers().users,
    });
    this.http.get<User[]>(`${this.env.url_api}/users`).subscribe(
      (res) => {
        this.#stateUsers.set({
          loadingUsers: false,
          users: res,
        });
        localStorage.setItem('users', JSON.stringify(this.#stateUsers().users));
      },
      (error) => {
        this.#stateUsers.set({
          loadingUsers: false,
          users: [],
        });
      }
    );
  }

  public getUserLogs(id: number, limit: number, offset: number) {
    const params = new HttpParams()
      .set('id_user', id)
      .set('limit', limit)
      .set('offset', offset);

    return this.http.get<UserLog[]>(`${environment.url_api}/users/logs`, {
      params,
    });
  }

  public getOneUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.env.url_api}/users/${id}`);
  }

  public getBasicPrompt(prompt: string): Observable<any> {
    return this.http.get(`${this.env.url_api}/openAi/test/${prompt}`);
  }

  public deleteUser(id: number) {
    return this.http.delete(`${this.env.url_api}/users/${id}`).pipe(
      tap((_) => {
        this.#stateUsers.set({
          loadingUsers: false,
          users: this.users().filter((i) => i.id_user !== id),
        });
        this.saveStorageUsers(this.#stateUsers().users);
      })
    );
  }

  public updateUser(id: number, user: Partial<User>) {
    if (this.user()!.id_user === id) {
      const updateUser = { ...this.user()!, ...user };
      localStorage.setItem('user', JSON.stringify(updateUser));
      this.#state.set({
        loading: false,
        user: updateUser,
        token: localStorage.getItem('token')!,
        access: JSON.parse(localStorage.getItem('access')!),
      });
    }
    return this.http.patch<User>(`${this.env.url_api}/users/${id}`, user).pipe(
      tap((resUser) => {
        const oldUser = this.#stateUsers().users;
        const index = oldUser.findIndex((i) => i.id_user === resUser.id_user);
        oldUser[index] = resUser;
        this.#stateUsers.set({
          loadingUsers: false,
          users: oldUser,
        });
        this.saveStorageUsers(this.#stateUsers().users);
      })
    );
  }

  public updateUsers(users: User[]) {
    this.#stateUsers.set({
      loadingUsers: false,
      users,
    });
  }

  public getInitials(userName: string): string {
    const words = userName.split(' ');
    if (words.length === 1) {
      return words[0].slice(0, 2);
    }
    if (words.length === 2) {
      return words[0].charAt(0) + words[1].charAt(0);
    }
    return words[0].slice(0, 2);
  }
}
