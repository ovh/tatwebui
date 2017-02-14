import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastService} from './toast/toast.service';
import {NgSemanticModule} from 'ng-semantic/ng-semantic';
import {TranslateModule} from 'ng2-translate';
import {SidebarComponent} from './sidebar/sidebar.component';
import {TopicListComponent} from './topic/list/topic.list.component';
import {MessageSendComponent} from './message/send/message.send.component';

@NgModule({
  imports: [ CommonModule, FormsModule, NgSemanticModule, ReactiveFormsModule, TranslateModule ],
  declarations: [
    MessageSendComponent,
    SidebarComponent,
    TopicListComponent
  ],
  providers: [
    ToastService
  ],
  schemas: [
  ],
  exports: [
    CommonModule,
    FormsModule,
    MessageSendComponent,
    NgSemanticModule,
    ReactiveFormsModule,
    SidebarComponent,
    TopicListComponent,
    TranslateModule
  ]
})
export class SharedModule {
}
