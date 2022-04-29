import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigRepository } from '../../../../state/config/config.repository';
import { ConfigService } from '../../../../state/config/config.service';
import { Command, FunscriptType, invertFunscript, PowerLevels } from '../../../../interface/configState';
import { Hotkeys } from '../../../core/services/hotkeys/hotkeys.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsModalComponent {
  hotkeysArr = Array.from(this.hotkeys.hotkeys);
  radioValue = this.configR.store.getValue().command;
  powerLevels = this.configR.store.getValue().powerLevels;
  funscriptType = this.configR.store.getValue().funscriptType;
  invertFunscript = this.configR.store.getValue().invertFunscript;

  constructor(
    private hotkeys: Hotkeys,
    private configR: ConfigRepository,
    private configS: ConfigService
  ) {}

  modelChange(event: Command): void {
    this.configS.patchConfig({
  command: event,
  funscriptType: this.configR.store.getValue().funscriptType,
  powerLevels: this.configR.store.getValue().powerLevels,
  invertFunscript: this.configR.store.getValue().invertFunscript
});
  }

  fsChange(event: FunscriptType): void {
    this.configS.patchConfig({
  command: this.configR.store.getValue().command,
  funscriptType: event,
  powerLevels: this.configR.store.getValue().powerLevels,
  invertFunscript: this.configR.store.getValue().invertFunscript
});

  }

  powerLevelChange(event: PowerLevels): void {
    this.configS.patchConfig({
  command: this.configR.store.getValue().command,
  funscriptType: this.configR.store.getValue().funscriptType,
  powerLevels: event,
  invertFunscript: this.configR.store.getValue().invertFunscript
  });
  }

  invertChange(event: invertFunscript): void {
    this.configS.patchConfig({
  command: this.configR.store.getValue().command,
  funscriptType: this.configR.store.getValue().funscriptType,
  powerLevels: this.configR.store.getValue().powerLevels,
  invertFunscript: event
  });
  }

  

}
