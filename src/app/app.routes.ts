import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { beforeloginGuard } from './core/guards/beforelogin.guard';
import { authGuard } from './core/guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [
    { component: DashboardComponent, path: '', canActivate: [authGuard], data: { roles: ['ADMIN', 'USER',] }, },
    { component: UserComponent, path: 'user', canActivate: [authGuard], data: { roles: ['USER',] }, },
    { component: AdminComponent, path: 'admin', canActivate: [authGuard], data: { roles: ['ADMIN',] }, },
    { component: LoginComponent, path: 'login', canActivate: [beforeloginGuard] }




];
