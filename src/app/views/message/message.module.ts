import {NgModule} from '@angular/core';
import {MessageComponent} from './message.component';
import {messageRouting} from './message.routing';

@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    messageRouting
  ]
})
export class MessageModule {
}
