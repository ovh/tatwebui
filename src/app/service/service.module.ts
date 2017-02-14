import {NgModule, ModuleWithProviders, SkipSelf, Optional} from '@angular/core';
import {RequestOptions, XHRBackend, Http} from '@angular/http';
import {Router} from '@angular/router';
import {ToastService} from '../shared/toast/toast.service';
import {AuthentificationStore} from './auth/authentification.store';
import {HttpService} from './http.service';
import {CanActivateAuthRoute} from './auth/canActivateAuthRoute';
import {UserService} from './user/user.service';
import {TopicService} from './topic/topic.service';
import {MessageSendService} from './message/message.send.service';
import {SidebarService} from './sidebar/sidebar.service';

@NgModule({})
export class ServicesModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        AuthentificationStore,
        CanActivateAuthRoute,
        MessageSendService,
        SidebarService,
        TopicService,
        UserService,
        {
          provide: Http,
          useFactory: (httpFactory),
          deps: [XHRBackend, RequestOptions, ToastService, AuthentificationStore, Router]
        }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ServicesModule) {
    if (parentModule) {
      throw new Error(
          'ServicesModule is already loaded. Import it in the AppModule only');
    }
  }
}

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions,
                            toast: ToastService, authStore: AuthentificationStore, router: Router) {
  return new HttpService(backend, defaultOptions, toast, authStore, router);
}

export {
  AuthentificationStore,
  CanActivateAuthRoute,
  Http,
  MessageSendService,
  SidebarService,
  TopicService,
  UserService
}
