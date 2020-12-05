import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGame from './game.reducer';
import { GameState } from './game.reducer';

export const selectGameState = createFeatureSelector<fromGame.GameState>(fromGame.gameFeatureKey);
export const selectGame = createSelector(selectGameState, (state: GameState) => state.game);
export const selectControls = createSelector(selectGameState, (state: GameState) => state.controls);
export const selectGenerationStatistic = createSelector(selectGameState, (state: GameState) => state.generationStatistic);
export const selectAllPatterns = createSelector(selectGameState, (state: GameState) => state.allPatterns);
export const selectAllRuleSets = createSelector(selectGameState, (state: GameState) => state.allRuleSets);
export const selectPatternSelected = createSelector(selectGameState, (state: GameState) => state.patternSelected);
export const selectIsMasked = createSelector(selectGameState, (state: GameState) => state.masked);
export const selectIsEditable = createSelector(selectGameState, (state: GameState) => state.editable);
export const selectIsPaused = createSelector(selectGameState, (state: GameState) => state.paused);
export const selectIsLoading = createSelector(selectGameState, (state: GameState) => state.loading);
export const selectIsRunning = createSelector(selectGameState, (state: GameState) => state.running);
export const selectIsMaximized = createSelector(selectGameState, (state: GameState) => state.boardMaximized);
export const selectIsReadyToRun = createSelector(selectGameState, (state: GameState) => state.readyToRun);
export const selectIsReadyForAnalysis = createSelector(selectGameState, (state: GameState) => state.readyForAnalysis);
export const selectIsGameFinished = createSelector(selectGameState, (state: GameState) => state.gameFinished);
export const selectAllGames = createSelector(selectGameState, (state: GameState) => state.games);
export const selectAllGenerationStatistics = createSelector(selectGameState, (state: GameState) => state.allGenerationStatistics);

