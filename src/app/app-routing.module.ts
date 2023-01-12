import { TopicDiscussionComponent } from './topic-discussion/topic-discussion.component';
import { TopicsComponent } from './topics/topics.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'topics', component: TopicsComponent },
  { path: 'discussion/:id', component: TopicDiscussionComponent },
  { path: '',   redirectTo: '/topics', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
