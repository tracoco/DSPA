import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    BrowserModule,
    AppComponent,
    RouterModule.forRoot([
      { path: '**', component: EmptyRouteComponent }
    ])
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }