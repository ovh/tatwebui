import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: 'app/views/message/message.module#MessageModule' },
  { path: 'user', loadChildren: 'app/views/user/user.module#UserModule' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  initialNavigation: true,
  preloadingStrategy: PreloadAllModules
});
