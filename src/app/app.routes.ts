import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { PanelPrincipal } from './vista/panel/panel-principal/panel-principal';
import { CategoriasComponent } from './vista/panel/categorias/categorias.component';
import { ProductosComponent } from './vista/panel/productos/productos.component';
import { CiudadesComponent } from './vista/panel/ciudades/ciudades.component';
import { ProveedoresComponent } from './vista/panel/proveedores/proveedores.component';
import { ImpuestosComponent } from './vista/panel/impuestos/impuestos.component';
import { ComprasComponent } from './vista/panel/compras/compras.component';
import { DetalleComprasComponent } from './vista/panel/detalle-compras/detalle-compras';
import { MarcasComponent } from './vista/panel/marcas/marcas';
import { RolesComponent } from './vista/panel/roles/roles';
import { UsuariosComponent } from './vista/panel/usuarios/usuarios';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'panel',
    component: PanelPrincipal,
    children: [
      { path: 'categorias', component: CategoriasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'ciudades', component: CiudadesComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'impuestos', component: ImpuestosComponent },
      { path: 'compras', component: ComprasComponent },
      { path: 'detalle-compras', component: DetalleComprasComponent },
      { path: 'marcas', component: MarcasComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: '', redirectTo: 'categorias', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
