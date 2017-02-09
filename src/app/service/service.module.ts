import {NgModule, ModuleWithProviders, SkipSelf, Optional} from '@angular/core';
import {RequestOptions, XHRBackend, Http} from '@angular/http';
import {Router} from '@angular/router';
import {ToastService} from '../shared/toast/toast.service';
import {AuthentificationStore} from './auth/authentification.store';
import {HttpService} from './http.service';
import {CanActivateAuthRoute} from './auth/canActivateAuthRoute';

@NgModule({})
export class ServicesModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        AuthentificationStore,
        CanActivateAuthRoute
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
  Http
}
