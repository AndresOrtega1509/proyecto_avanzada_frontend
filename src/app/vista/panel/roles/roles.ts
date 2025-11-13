import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolesService } from '../../../core/services/roles.service';
import { Rol } from '../../../core/models/rol.model';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class RolesComponent implements OnInit {
  roles: Rol[] = [];
  rolesFiltrados: Rol[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  rolSeleccionado: Rol | null = null;

  form = {
    nombre: '',
    descripcion: '',
  };

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar roles', err);
        this.mensajeError = 'Error al cargar los roles.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.rolesFiltrados = term
      ? this.roles.filter(
          (r) =>
            r.nombre.toLowerCase().includes(term) ||
            (r.descripcion ?? '').toLowerCase().includes(term)
        )
      : [...this.roles];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevoRol(): void {
    this.modoEdicion = false;
    this.rolSeleccionado = null;
    this.form = {
      nombre: '',
      descripcion: '',
    };
  }

  editar(rol: Rol): void {
    this.modoEdicion = true;
    this.rolSeleccionado = rol;
    this.form = {
      nombre: rol.nombre,
      descripcion: rol.descripcion ?? '',
    };
  }

  cancelar(): void {
    this.nuevoRol();
  }

  guardarRol(): void {
    const nombre = this.form.nombre.trim();
    const descripcion = this.form.descripcion.trim();

    if (!nombre) {
      this.mensajeError = 'El nombre del rol es obligatorio.';
      return;
    }

    this.mensajeError = '';

    const payload = { nombre, descripcion };

    if (this.modoEdicion && this.rolSeleccionado?.idRol != null) {
      this.rolesService.updateRol(this.rolSeleccionado.idRol, payload).subscribe({
        next: () => {
          this.cargarRoles();
          this.nuevoRol();
        },
        error: (err) => {
          console.error('Error al actualizar rol', err);
          this.mensajeError = 'Error al actualizar el rol.';
        },
      });
    } else {
      this.rolesService.createRol(payload).subscribe({
        next: () => {
          this.cargarRoles();
          this.nuevoRol();
        },
        error: (err) => {
          console.error('Error al crear rol', err);
          this.mensajeError = 'Error al crear el rol.';
        },
      });
    }
  }

  eliminar(rol: Rol): void {
    if (!rol.idRol) return;

    const confirmar = confirm(`¿Eliminar el rol "${rol.nombre}"?`);
    if (!confirmar) return;

    this.rolesService.deleteRol(rol.idRol).subscribe({
      next: () => this.cargarRoles(),
      error: (err) => {
        console.error('Error al eliminar rol', err);
        this.mensajeError = 'Error al eliminar el rol.';
      },
    });
  }
}
