import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {routing} from './app.routing';
import {SharedModule} from './shared/shared.module';
import {ServicesModule} from './service/service.module';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';
import {Http} from '@angular/http';
import {ToasterModule} from 'angular2-toaster';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ServicesModule.forRoot(),
    SharedModule,
    ToasterModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    routing
  ],
  exports: [
    ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
