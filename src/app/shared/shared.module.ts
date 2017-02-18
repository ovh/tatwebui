import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastService} from './toast/toast.service';
import {NgSemanticModule} from 'ng-semantic/ng-semantic';
import {TranslateModule} from 'ng2-translate';
import {SidebarComponent} from './sidebar/sidebar.component';
import {TopicListComponent} from './topic/sidebar/topic.list.component';
import {MessageSendComponent} from './message/send/message.send.component';
import {MessageListComponent} from './message/list/message.list.component';
import {MessageSingleComponent} from './message/single/message.single.component';
import {MomentModule} from 'angular2-moment';

@NgModule({
  imports: [ MomentModule, CommonModule, FormsModule, NgSemanticModule, ReactiveFormsModule, TranslateModule ],
  declarations: [
    MessageSendComponent,
    MessageListComponent,
    MessageSingleComponent,
    SidebarComponent,
    TopicListComponent
  ],
  providers: [
    ToastService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MessageListComponent,
    MessageSendComponent,
    MessageSingleComponent,
    NgSemanticModule,
    ReactiveFormsModule,
    SidebarComponent,
    TopicListComponent,
    TranslateModule
  ]
})
export class SharedModule {
}
