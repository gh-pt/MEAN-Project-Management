import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProjectsComponent } from './projects/projects.component';
import { AuthGuard } from './guards/auth-gurad.guard';
import { ProjectQueryComponent } from './project-query/project-query.component';
import { ReplyQueryComponent } from './reply-query/reply-query.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: SignInComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'queries/:id',
    component: ProjectQueryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reply/:id',
    component: ReplyQueryComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

