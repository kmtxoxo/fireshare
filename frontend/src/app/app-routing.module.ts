import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VotingComponent} from "./voting/voting.component";
import {HomeComponent} from "./home/home.component";
import {ChatComponent} from "./chat/chat.component";


const routes: Routes = [
  {
    path: 'voting',
    component: VotingComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
