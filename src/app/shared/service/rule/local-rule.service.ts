import { Observable, of } from 'rxjs';
import { RuleSet } from '../../model/rule/RuleSet';
import { ConwaysRuleSet } from './conway/ConwaysRuleSet';
import { ReplicatorRuleSet } from './ReplicatorRuleSet';
import { AbstractRuleService } from './abstract-rule.service';
import { LiveFreeOrDieRuleSet } from './LiveFreeOrDieRuleSet';
import { LifeWithoutDeathRuleSet } from './LifeWithoutDeathRuleSet';
import { MazeRuleSet } from './MazeRuleSet';
import { PedestrianLifeRuleSet } from './PedestrianLifeRuleSet';
import { AntiLifeRuleSet } from './AntiLifeRuleSet';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalRuleService extends AbstractRuleService {
  private static ruleSets = [
    new ConwaysRuleSet(),
    new ReplicatorRuleSet(),
    new LiveFreeOrDieRuleSet(),
    new LifeWithoutDeathRuleSet(),
    new MazeRuleSet(),
    new PedestrianLifeRuleSet(),
    new AntiLifeRuleSet(),
  ];

  getRuleSets(): Observable<RuleSet[]> {
    return of(LocalRuleService.ruleSets);
  }

  getRuleSet(id: string): Observable<RuleSet> {
    return of(LocalRuleService.ruleSets.find((r) => r.id === id));
  }
}