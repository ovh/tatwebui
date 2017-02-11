import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastService} from './toast/toast.service';
import {NgSemanticModule} from 'ng-semantic/ng-semantic';
import {TranslateModule} from 'ng2-translate';

@NgModule({
  imports: [ CommonModule, FormsModule, NgSemanticModule, ReactiveFormsModule, TranslateModule ],
  declarations: [
  ],
  providers: [
    ToastService
  ],
  schemas: [
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgSemanticModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class SharedModule {
}
