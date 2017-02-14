import {NgModule} from '@angular/core';
import {MessageComponent} from './message.component';
import {messageRouting} from './message.routing';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    SharedModule,
    messageRouting
  ]
})
export class MessageModule {
}
