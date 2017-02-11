import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastService} from './toast/toast.service';
import {NgSemanticModule} from 'ng-semantic/ng-semantic';
import {TranslateModule} from 'ng2-translate';
import {SidebarComponent} from './sidebar/sidebar.component';
import {SidebarService} from './sidebar/sidebar.service';

@NgModule({
  imports: [ CommonModule, FormsModule, NgSemanticModule, ReactiveFormsModule, TranslateModule ],
  declarations: [
    SidebarComponent
  ],
  providers: [
    SidebarService,
    ToastService
  ],
  schemas: [
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgSemanticModule,
    ReactiveFormsModule,
    SidebarComponent,
    TranslateModule
  ]
})
export class SharedModule {
}
