import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Funscript } from 'funscript-utils/lib/types';
import { UserInputService } from '../load-video/user-input.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NotificationsService } from '../../../notifications.service';
import { FormBuilder } from '@angular/forms';
import { ConfigRepository } from '../../../../state/config/config.repository';
import { LoadVideoComponent } from '../load-video/load-video.component';

@UntilDestroy()
@Component({
  selector: 'app-load-funscript',
  templateUrl: './load-funscript.component.html',
  styleUrls: ['./load-funscript.component.scss'],
})
export class LoadFunscriptComponent implements OnInit {
  constructor(
    public userInputService: UserInputService,
    private notifications: NotificationsService,
    private formBuilder: FormBuilder,
    private configR: ConfigRepository,
    public cdr: ChangeDetectorRef
  ) {}

  @ViewChild('fsFileInput')
  fsFileInput: any;

  private observeFunscriptFile(): void {
    this.userInputService.funscriptFile
      .pipe(untilDestroyed(this))
      .subscribe((val) => {
        if (val) {
          this.userInputService.urlForm.controls.url.enable();
          this.cdr.markForCheck();
        }
      });
  }

  ngOnInit(): void {
    this.observeFunscriptFile();
  }

  public async onFunscriptSelected(): Promise<void> {
    if (this.fsFileInput.nativeElement.files.length > 0) {
      const files: { [key: string]: File } =
        this.fsFileInput.nativeElement.files;

      return this.fileToJSON(files[0])
        .catch(() => {
          return false;
        })
        .then((r: Record<string, unknown> | boolean) => {
          if (typeof r === 'object') {
            const funscript: Funscript = r as unknown as Funscript;
            // console.log(this.strokeToVibe(funscript.actions));
            
            const fsType = this.configR.store.getValue().funscriptType;
            if (fsType==='vibrate'){
              funscript.actions = this.strokeToVibe(funscript.actions);
            }  
            
            console.log("loading")
            this.userInputService.updateFunscript(funscript, files[0].name);
            
          }
        });
    } else {
      return this.notifications.showToast(
        `Failed to load funscript file.`,
        'error'
      );
    }
  }

  public onClickFunscriptInputButton(): void {
    this.fsFileInput.nativeElement.click();
  }

  // load user uploaded JSON file
  private fileToJSON(file: any): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      // @ts-ignore
      fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });
  }

  arrayLength<T>(myArray:T[]): number {
    return myArray.length;
}

  private strokeToVibe(actions: any){
    var a = [0,0];
    var b = [0,0];
    var maxValue = 0;
    var slopeArray = []
    var vibePos = []
    for (var i = 0; i < actions.length; i++) {
      // console.log(actions[i]);
      b = [actions[i].at, actions[i].pos];
      // console.log(b)
      // console.log((b[1]-a[1]))
      // console.log(b[0]-a[0])
      
      slopeArray.push(Math.abs( ((b[1]-a[1])/(b[0]-a[0]))) );
      // console.log(slopeArray[i])
      if (isFinite(slopeArray[i])){
        maxValue = Math.max(maxValue, slopeArray[i])
      }
      else{
        slopeArray[i] = 0
      }

      
      
      a =[actions[i].at, actions[i].pos];
    }
    
    for (var i = 0; i < actions.length; i++) {
      vibePos.push( Math.ceil((slopeArray[i]*100)/maxValue) );
      actions[i].pos=Math.ceil((slopeArray[i]*100)/maxValue)
    }
    console.log(actions.length, slopeArray.length, vibePos.length);
    console.log(maxValue);
    console.log(vibePos)
    return actions
  }
}
