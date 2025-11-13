import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { PanelPrincipal } from './vista/panel/panel-principal/panel-principal';
import { CategoriasComponent } from './vista/panel/categorias/categorias.component';
import { ProductosComponent } from './vista/panel/productos/productos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'panel',
    component: PanelPrincipal,
    children: [
      { path: 'categorias', component: CategoriasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: '', redirectTo: 'categorias', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
