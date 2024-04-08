import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'addTrack',
        children: [
          {
            path: '',
            loadChildren: '../add-track/add-track.module#AddTrackPageModule'
          }
        ]
      },
      {
        path: 'voting',
        children: [
          {
            path: '',
            loadChildren: '../voting/voting.module#VotingPageModule'
          }
        ]
      },
      {
        path: 'chat',
        children: [
          {
            path: '',
            loadChildren: '../chat/chat.module#ChatPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/add-track',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/voting',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
