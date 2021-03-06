import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CellState } from '../../shared/model/cell-state';
import { Board } from '../../shared/model/board';
import { NgForm } from '@angular/forms';
import { PatternUtils } from '../util/pattern-util';
import { GameUtils } from '../../shared/service/game-utils';

@Component({
  selector: 'app-pattern-editor',
  templateUrl: './pattern-editor.component.html',
  styleUrls: ['./pattern-editor.component.scss'],
})
export class PatternEditorComponent implements OnChanges, OnDestroy {
  @Input() sizeX: number;
  @Input() sizeY: number;
  @Input() pattern: string;
  @Input() form: NgForm;
  @Input() isErase: boolean;
  @Input() disabled: boolean;

  board: Board = null;

  constructor() {
    // Start in "Pen" mode
    this.isErase = false;
  }

  ngOnDestroy(): void {
    console.log('Saving pattern');
    //  this.save();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sizeX && this.sizeY) {
      const size = PatternUtils.getPatternSize(this.pattern);
      if (size.w !== this.sizeX && size.h !== this.sizeY) {
        // init with empty (in new mode)
        this.pattern = PatternUtils.initPattern(this.sizeX, this.sizeY);
      }
      this.board = GameUtils.buildBoardWithPattern(this.sizeX, this.sizeY, this.pattern);
    }
  }

  invert(): void {
    this.form.form.markAsDirty();
    this.pattern = this.save();
    this.pattern = PatternUtils.invert(this.pattern);
    this.board = GameUtils.buildBoardWithPattern(this.sizeX, this.sizeY, this.pattern);
    this.load();
  }

  clear(): void {
    this.form.form.markAsDirty();
    let emptyPattern = '';
    for (let y = 0; y < this.sizeY; y++) {
      for (let x = 0; x < this.sizeX; x++) {
        emptyPattern += '.';
      }
      emptyPattern += '\n';
    }
    this.pattern = emptyPattern.slice(0, -1);
    this.board = GameUtils.buildBoardWithPattern(this.sizeX, this.sizeY, this.pattern);
  }

  public save(): string {
    this.pattern = GameUtils.save(this.board);
    return this.pattern;
  }

  public load(pattern: string = null): void {
    if (pattern) {
      this.pattern = pattern;
    }
    GameUtils.load(this.board, this.pattern);
  }

  toggle(x: number, y: number, event: MouseEvent = null): void {
    if (!this.disabled) {
      if (event == null || event.buttons > 0) {
        this.form.form.markAsDirty();
        this.board.getCell(x, y).setState(this.isErase ? CellState.DEAD : CellState.ALIVE);
      }
    }
  }

  get tool(): 'format_color_reset' | 'brush' {
    return this.isErase ? 'format_color_reset' : 'brush';
  }
}
