﻿import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Auth } from '@aws-amplify/auth';
import { fromPromise } from 'rxjs/internal-compatibility';
import { APIService } from '../../API.service';
import { User } from '../../shared/model/user';
import { Role } from '../../shared/model/role';
import { UserUtils } from '../../users/utils/user-utils';
import { UserService } from '../../users/services/users.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userSource: BehaviorSubject<User> = new BehaviorSubject<User>({} as any);
  user = this.userSource.asObservable();

  constructor(private router: Router, private api: APIService, private userService: UserService) {}

  public getUser(): User {
    Auth.currentAuthenticatedUser()
      .then(
        (u) => {
          const user = new User();
          user.username = u.username;
          user.email = u.attributes.email;
          return user;
        },
        (reason) => {
          console.log('Error getting user ' + reason);
          return null;
        }
      )
      .catch(console.error);
    return null;
  }
  /** signup */
  public register(user, pwd, mail): Observable<any> {
    return fromPromise(
      Auth.signUp({
        username: user,
        password: pwd,
        attributes: {
          email: mail,
        },
      })
        .then((response) => {
          if (response.userConfirmed) {
            const userDB = new User();
            userDB.username = user;
            userDB.email = mail;
            this.userService.createUser(userDB).catch((error) => console.log('User create error ' + error));
          }
        })
        .catch((error) => {
          console.log('Error' + JSON.stringify(error));
        })
    );
  }

  /** confirm code */
  public verify(username, code): Promise<any> {
    return Auth.confirmSignUp(username, code);
  }

  /** signin */
  public login(username, password): Observable<any> {
    return fromPromise(Auth.signIn(username, password)).pipe(
      tap((cognitoUser) => {
        this.authenticated.next(true);

        let user: User;
        this.userService
          .getUser(cognitoUser.attributes.sub)
          .then((value) => {
            if (value) {
              user = UserUtils.fromAws(value);
              if (user) {
                this.userSource.next(user);
              }
            } else {
              // for some reason user was not yet created
              user = new User();
              user.id = cognitoUser.attributes.sub;
              user.username = username;
              user.email = cognitoUser.attributes.email;
              this.userService.createUser(user).catch((anotherError) => console.log('Error user create' + JSON.stringify(anotherError)));
            }
          })
          .catch((error) => {
            console.log('Error login' + JSON.stringify(error));
          });
      })
    );
  }

  /** get authenticate state */
  public isAuthenticated(): Observable<boolean> {
    return fromPromise(Auth.currentAuthenticatedUser()).pipe(
      map(() => {
        console.log('isAuthenticated: true');
        this.authenticated.next(true);
        return true;
      }),
      catchError(() => {
        console.log('isAuthenticated: false');
        this.authenticated.next(false);
        return of(false);
      })
    );
  }

  /** signout */
  public logout(): boolean {
    this.userService.updateLastLogin(this.userSource.value).catch((err) => console.log(err));
    fromPromise(Auth.signOut()).subscribe(
      () => {
        this.authenticated.next(false);
        this.userSource.next(null);
        return true;
      },
      (error) => {
        console.log(error);
        return false;
      }
    );
    return true;
  }

  public async updateUser(mail: string, role: string) {
    const user = await Auth.currentAuthenticatedUser();
    const result = await Auth.updateUserAttributes(user, {
      'custom:role': role,
      email: mail,
    });
    this.userSource.next(user);
  }

  public getToken(): string {
    Auth.currentUserPoolUser().then((pool) => {
      return pool.signInUserSession.idToken.jwtToken;
    });
    return null;
  }

  public isAdmin(): boolean {
    return this.isAuthenticated() && this.getUser().role === Role.Admin;
  }

  public isDesigner(): boolean {
    return this.isAuthenticated() && this.getUser().role === Role.Designer;
  }

  public isLoggedIn(): boolean {
    return this.getToken() != null;
  }
}
