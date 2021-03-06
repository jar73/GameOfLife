import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Game } from '../../game/model/game';
import { Cell } from '../model/cell';
import { APIService } from '../../API.service';
import { AbstractRuleService } from './rule/abstract-rule.service';
import { GameUtils } from './game-utils';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private api: APIService, private ruleService: AbstractRuleService, private authService: AuthService) {}

  private static cellStatesAsDotOString(cells: Array<Cell>): string {
    return cells.map((cell) => (cell.state ? 'O' : '.')).join('');
  }

  private static toAwsGame(isPublic: boolean, game: Game): any {
    return {
      name: game.name,
      userId: game.author,
      description: JSON.stringify({ description: game.description, isPublic }),
      generations: game.generations,
      id: game.id,
      pattern: GameService.cellStatesAsDotOString(game.board.cells),
      sizeX: game.board.width,
      sizeY: game.board.height,
      ruleSetId: game.ruleSet.id,
      creationDate: game.date,
      score: game.score.overallScore,
      scoreTags: JSON.stringify(game.score.tags),
    };
  }

  getAllGames(): Observable<Game[]> {
    return from(this.api.ListGames().then((result) => result.items.map((item) => this.fromAwsGame(item))));
  }

  getAllGamesFiltered(): Observable<Game[]> {
    return from(
      this.api
        .ListGames()
        .then((result) =>
          result.items
            .filter((awsgame) => awsgame.userId === this.authService.getCurrentUser().id || JSON.parse(awsgame.description).isPublic)
            .map((item) => this.fromAwsGame(item))
        )
    );
  }

  getGame(id: string): Observable<Game> {
    return from(this.api.GetGame(id).then((result) => this.fromAwsGame(result)));
  }

  addGame(isPublic: boolean, game: Game): Observable<Game> {
    const input: any = GameService.toAwsGame(isPublic, game);
    delete input.id;
    return from(this.api.CreateGame(input).then((result) => this.fromAwsGame(result)));
  }

  private fromAwsGame(awsGame): Game {
    const game = new Game(GameUtils.build(awsGame.sizeX, awsGame.sizeY), awsGame.generations, awsGame.userId);
    GameUtils.applyPatternFromString(game.board, 0, 0, awsGame.pattern, awsGame.sizeX, awsGame.sizeY);
    game.id = awsGame.id;
    this.ruleService.getRuleSet(awsGame.ruleSetId).subscribe((r) => (game.ruleSet = r));
    game.date = new Date(awsGame.creationDate);
    game.score = { overallScore: awsGame.score, tags: JSON.parse(awsGame.scoreTags) };
    game.isPublic = JSON.parse(awsGame.description).isPublic;
    return game;
  }
}
