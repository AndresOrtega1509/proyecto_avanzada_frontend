import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuariosService } from '../../../core/services/usuarios.service';
import { RolesService } from '../../../core/services/roles.service';

import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioRequest } from '../../../core/models/usuario-request.model';
import { Rol } from '../../../core/models/rol.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  roles: Rol[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  usuarioSeleccionado: Usuario | null = null;

  form = {
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    rolNombre: '',
  };

  constructor(private usuariosService: UsuariosService, private rolesService: RolesService) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarUsuarios();
  }

  cargarRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Error al cargar roles', err),
    });
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.mensajeError = 'Error al cargar los usuarios.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.usuariosFiltrados = term
      ? this.usuarios.filter(
          (u) =>
            u.nombre.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.rol?.nombre.toLowerCase().includes(term)
        )
      : [...this.usuarios];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevoUsuario(): void {
    this.modoEdicion = false;
    this.usuarioSeleccionado = null;
    this.form = {
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      rolNombre: '',
    };
  }

  editar(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioSeleccionado = usuario;

    this.form = {
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono ?? '',
      password: '', // se debe ingresar nuevo password
      rolNombre: usuario.rol?.nombre ?? '',
    };
  }

  cancelar(): void {
    this.nuevoUsuario();
  }

  guardarUsuario(): void {
    const nombre = this.form.nombre.trim();
    const email = this.form.email.trim();
    const telefono = this.form.telefono.trim();
    const password = this.form.password.trim();
    const rolNombre = this.form.rolNombre.trim();

    if (!nombre || !email || !telefono || !password || !rolNombre) {
      this.mensajeError = 'Nombre, email, teléfono, contraseña y rol son obligatorios.';
      return;
    }

    this.mensajeError = '';

    const payload: UsuarioRequest = {
      nombre,
      email,
      telefono,
      password,
      rolNombre,
    };

    if (this.modoEdicion && this.usuarioSeleccionado?.idUsuario != null) {
      this.usuariosService.updateUsuario(this.usuarioSeleccionado.idUsuario, payload).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.nuevoUsuario();
        },
        error: (err) => {
          console.error('Error al actualizar usuario', err);
          this.mensajeError = 'Error al actualizar el usuario.';
        },
      });
    } else {
      this.usuariosService.createUsuario(payload).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.nuevoUsuario();
        },
        error: (err) => {
          console.error('Error al crear usuario', err);
          this.mensajeError = 'Error al crear el usuario.';
        },
      });
    }
  }

  eliminar(usuario: Usuario): void {
    if (!usuario.idUsuario) return;

    const confirmar = confirm(`¿Eliminar el usuario "${usuario.nombre}" (${usuario.email})?`);
    if (!confirmar) return;

    this.usuariosService.deleteUsuario(usuario.idUsuario).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => {
        console.error('Error al eliminar usuario', err);
        this.mensajeError = 'Error al eliminar el usuario.';
      },
    });
  }
}
