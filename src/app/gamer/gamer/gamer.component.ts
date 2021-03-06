import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Game } from '../../game/model/game';
import { GameService } from '../../shared/service/game.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { map } from 'rxjs/operators';
import { User } from '../../shared/model/user';
import { ListUsersQuery } from '../../API.service';
import { UserService } from '../../users/services/users.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../../core/services/auth.service';
import { BreakpointService } from '../../shared/service/breakpoint.service';
import { ScreenSize } from '../../shared/service/screen-size.enum';
import { Orientation } from '../../shared/service/orientation.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gamer',
  templateUrl: './gamer.component.html',
  styleUrls: ['./gamer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GamerComponent implements OnInit, OnDestroy {
  private screenSizeSubscription: Subscription;
  private orientationSubscription: Subscription;
  get showSpinner(): boolean {
    return !(this.loadGamesFinished && this.loadUsersFinished);
  }

  constructor(
    private gameService: GameService,
    private userService: UserService,
    private authService: AuthService,
    private breakpointService: BreakpointService
  ) {}
  columnsToShow = [];
  expandedGame: Game | null;
  selectedView: string;
  privateGamesOnly = false;
  private loadUsersFinished = false;
  private loadGamesFinished = false;
  isHandSet: boolean;
  isPortrait: boolean;

  dataSource = new MatTableDataSource<Game>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private user: User;
  private users: { id: string; name: string }[];

  ngOnInit(): void {
    this.selectedView = 'carousel';
    this.loadGamesFiltered();
    this.user = this.authService.getCurrentUser();
    this.userService.getUsers().then((list: ListUsersQuery) => {
      this.users = list.items.map((item) => ({ id: item.id, name: item.username }));
      this.loadUsersFinished = true;
    });

    this.screenSizeSubscription = this.breakpointService.subscribeToScreenSizeChanges().subscribe((s) => {
      this.isHandSet = s === ScreenSize.HANDSET;
      this.updateColumnsToShow();
    });
    this.orientationSubscription = this.breakpointService.subscribeToOrientationChanges().subscribe((s) => {
      this.isPortrait = s === Orientation.PORTRAIT;
      this.updateColumnsToShow();
    });
  }

  updateColumnsToShow(): void {
    if (this.isHandSet && this.isPortrait) {
      this.columnsToShow = ['author', 'date', 'score'];
    } else {
      this.columnsToShow = ['author', 'date', 'ruleSet', 'size', 'generations', 'score', 'tags'];
    }
  }

  public onViewChange(view: string): void {
    this.selectedView = view;
    if (this.isListView()) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private loadGamesFiltered(): void {
    this.gameService
      .getAllGamesFiltered()
      .pipe(map((games) => games.filter((game) => (this.privateGamesOnly ? game.author === this.user.id : true))))
      .subscribe((games) => {
        this.dataSource.data = games;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'date':
              return item.dateAsString();
            case 'score':
              return item.score.overallScore;
            case 'author':
              return item.author;
            case 'ruleSet':
              return item.ruleSet.shortName;
            case 'size':
              return item.board.width * item.board.height;
            case 'generations':
              return item.generations;
            default:
              return item[property];
          }
        };
        this.loadGamesFinished = true;
      });
  }

  public isListView(): boolean {
    return this.selectedView === 'list';
  }

  showAndLoadPrivateGamesOnly(checked: boolean): void {
    if (checked !== this.privateGamesOnly) {
      this.loadGamesFiltered();
    }
    this.privateGamesOnly = checked;
  }

  toUserName(authorId: string): string {
    if (!this.users) {
      return null;
    }
    return this.users.find((user) => user.id === authorId).name;
  }

  ngOnDestroy(): void {
    this.screenSizeSubscription.unsubscribe();
    this.orientationSubscription.unsubscribe();
  }
}
