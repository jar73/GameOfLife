import { ApplicationRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Pattern } from '../../shared/model/pattern';
import { Board } from '../../shared/model/board';
import { PatternService } from '../../shared/service/patterns.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../shared/model/user';
import { RatingComponent } from '../../shared/rating/rating.component';
import { RatingService } from '../../shared/service/rating.service';
import { NotificationService } from '../../shared/service/notification.service';
import { AbstractRuleService } from '../../shared/service/rule/abstract-rule.service';
import { GameUtils } from '../../shared/service/game-utils';
import { RuleSet } from '../../shared/model/rule/rule-set';

@Component({
  selector: 'app-pattern-preview',
  templateUrl: './pattern-preview.component.html',
  styleUrls: ['./pattern-preview.component.scss'],
})
export class PatternPreviewComponent implements OnInit, OnChanges {
  @Input() ruleSet: RuleSet;
  @Input() animationEnabled = true;
  @Input() pattern: Pattern;
  @Input() showRating = true;

  user: User;
  board: Board;
  originalPattern: string;
  rating: number;
  id: any;

  @ViewChild('rating') ratingComponent: RatingComponent;

  constructor(
    private notificationService: NotificationService,
    private ratingService: RatingService,
    private patternService: PatternService,
    private authService: AuthService,
    private appRef: ApplicationRef,
    private ruleService: AbstractRuleService
  ) {}

  startAnimation(): void {
    if (this.animationEnabled && this.id == null) {
      this.id = setInterval(() => {
        this.play();
      }, 500);
    }
  }

  stopAnimation(): void {
    if (this.animationEnabled) {
      clearInterval(this.id);
      // restore original pattern
      this.pattern.pattern = this.originalPattern;
      this.id = null;
    }
  }
  play(): void {
    this.board.nextGeneration(this.ruleSet);
    this.appRef.tick();
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.ruleSet) {
      this.ruleService.getRuleSet('conway').subscribe((r) => (this.ruleSet = r));
    }
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    await this.pattern;
    await this.board;
    if (this.pattern) {
      this.originalPattern = JSON.parse(JSON.stringify(this.pattern.pattern));
      const x = this.pattern.sizeX;
      const y = this.pattern.sizeY;

      this.board = GameUtils.buildBoardWithPattern(x, y, this.pattern.pattern);
    }
  }
}
