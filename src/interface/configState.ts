export type Command = 'linear' | 'vibrate' | 'linear+rotate';
export type FunscriptType = 'stroker' | 'vibrate';
export type PowerLevels = [0.0,100]
export type invertFunscript = false
export interface ConfigState {
  command: Command;
  funscriptType: FunscriptType;
  powerLevels: PowerLevels;
  invertFunscript: invertFunscript;
}
