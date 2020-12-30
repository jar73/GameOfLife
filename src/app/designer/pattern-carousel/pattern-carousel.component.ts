import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pattern } from '../../shared/model/pattern';
import { PatternService } from '../../shared/service/patterns.service';

@Component({
  selector: 'app-pattern-carousel',
  templateUrl: './pattern-carousel.component.html',
  styleUrls: ['./pattern-carousel.component.scss'],
})
export class PatternCarouselComponent implements OnInit {
  @Input() visiblePatterns = 5;
  public currentPatternIndex = 0;

  private innerIsSelected: boolean;

  @Input()
  set isSelected(isSelected: boolean) {
    isSelected ? this.onSelect(0) : this.onDeselect();
  }

  get isSelected(): boolean {
    return this.innerIsSelected;
  }

  @Input()
  public patterns: Pattern[];

  @Output()
  public doPatternSelected: EventEmitter<Pattern> = new EventEmitter();

  @Output()
  public doDeSelect: EventEmitter<void> = new EventEmitter();

  @Input()
  public autoLoadPatterns: boolean;

  @Input()
  public highLightSelection: boolean;
  public indices: Array<number> = new Array<number>();

  constructor(private patternService: PatternService) {}

  ngOnInit(): void {
    for (let i = 0; i < this.visiblePatterns; i++) {
      this.indices.push(i);
    }
    if (this.autoLoadPatterns) {
      this.loadPatterns();
    }
  }

  private onPreviousClick(): void {
    this.indices[0] === 0 ? this.indices.unshift(this.patterns.length - 1) : this.indices.unshift(this.indices[0] - 1);
    this.indices.pop();
  }

  private onNextClick(): void {
    this.indices[this.visiblePatterns - 1] === this.patterns.length - 1
      ? this.indices.push(0)
      : this.indices.push(this.indices[this.visiblePatterns - 1] + 1);
    this.indices.shift();
  }

  onSelect(index: number): void {
    this.innerIsSelected = true;
    this.doPatternSelected.emit(this.patterns[index]);
    this.currentPatternIndex = index;
  }

  onDeselect(): void {
    this.innerIsSelected = false;
    this.doDeSelect.emit();
    this.currentPatternIndex = -1;
  }

  private loadPatterns(): void {
    this.patternService.getPatternsObservable().subscribe((patterns) => {
      this.patterns = patterns;
      this.currentPatternIndex = 0;
    });
    // TODO Wie war das mit unsubscribe und memory leaks? besser async pipe im html und binding property?
  }
}
