import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { CiudadesService } from '../../../core/services/ciudades.service';

import { Proveedor, ProveedorRequest } from '../../../core/models/proveedor.model';
import { Ciudad } from '../../../core/models/ciudad.model';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css',
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];

  ciudades: Ciudad[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  proveedorSeleccionado: Proveedor | null = null;

  form: {
    nombre: string;
    idCiudad: number | null;
    direccion: string;
    email: string;
    estado: 'ACTIVO' | 'INACTIVO';
    telefonos: string[];
    telefonoActual: string;
  } = this.getFormInicial();

  constructor(
    private proveedoresService: ProveedoresService,
    private ciudadesService: CiudadesService
  ) {}

  ngOnInit(): void {
    this.cargarCiudades();
    this.cargarProveedores();
  }

  private getFormInicial() {
    return {
      nombre: '',
      idCiudad: null,
      direccion: '',
      email: '',
      estado: 'ACTIVO' as 'ACTIVO' | 'INACTIVO',
      telefonos: [] as string[],
      telefonoActual: '',
    };
  }

  cargarCiudades(): void {
    this.ciudadesService.getCiudades().subscribe({
      next: (data) => (this.ciudades = data),
      error: (err) => {
        console.error('Error al cargar ciudades', err);
      },
    });
  }

  cargarProveedores(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.proveedoresService.getProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar proveedores', err);
        this.mensajeError = 'Error al cargar los proveedores.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.proveedoresFiltrados = term
      ? this.proveedores.filter(
          (p) => p.nombre.toLowerCase().includes(term) || p.email.toLowerCase().includes(term)
        )
      : [...this.proveedores];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevoProveedor(): void {
    this.modoEdicion = false;
    this.proveedorSeleccionado = null;
    this.form = this.getFormInicial();
  }

  editar(proveedor: Proveedor): void {
    this.modoEdicion = true;
    this.proveedorSeleccionado = proveedor;

    this.form = {
      nombre: proveedor.nombre,
      idCiudad: proveedor.ciudad?.idCiudad ?? null,
      direccion: proveedor.direccion ?? '',
      email: proveedor.email ?? '',
      estado: (proveedor.estado as 'ACTIVO' | 'INACTIVO') ?? 'ACTIVO',
      telefonos: proveedor.telefonos ? [...proveedor.telefonos] : [],
      telefonoActual: '',
    };
  }

  cancelarEdicion(): void {
    this.nuevoProveedor();
  }

  agregarTelefono(): void {
    const tel = this.form.telefonoActual.trim();
    if (!tel) return;

    if (!this.form.telefonos.includes(tel)) {
      this.form.telefonos.push(tel);
    }
    this.form.telefonoActual = '';
  }

  eliminarTelefono(index: number): void {
    this.form.telefonos.splice(index, 1);
  }

  guardarProveedor(): void {
    if (!this.form.nombre.trim() || !this.form.idCiudad || !this.form.email.trim()) {
      this.mensajeError = 'Nombre, ciudad y email son obligatorios.';
      return;
    }

    this.mensajeError = '';

    const req: ProveedorRequest = {
      nombre: this.form.nombre.trim(),
      idCiudad: this.form.idCiudad!,
      direccion: this.form.direccion.trim(),
      email: this.form.email.trim(),
      estado: this.form.estado,
      telefonos: this.form.telefonos,
    };

    if (this.modoEdicion && this.proveedorSeleccionado?.idProveedor != null) {
      this.proveedoresService
        .updateProveedor(this.proveedorSeleccionado.idProveedor, req)
        .subscribe({
          next: () => {
            this.cargarProveedores();
            this.nuevoProveedor();
          },
          error: (err) => {
            console.error('Error al actualizar proveedor', err);
            this.mensajeError = 'Error al actualizar el proveedor.';
          },
        });
    } else {
      this.proveedoresService.createProveedor(req).subscribe({
        next: () => {
          this.cargarProveedores();
          this.nuevoProveedor();
        },
        error: (err) => {
          console.error('Error al crear proveedor', err);
          this.mensajeError = 'Error al crear el proveedor.';
        },
      });
    }
  }

  eliminarProveedor(proveedor: Proveedor): void {
    if (!proveedor.idProveedor) return;

    const confirmar = confirm(`¿Eliminar el proveedor "${proveedor.nombre}"?`);
    if (!confirmar) return;

    this.proveedoresService.deleteProveedor(proveedor.idProveedor).subscribe({
      next: () => this.cargarProveedores(),
      error: (err) => {
        console.error('Error al eliminar proveedor', err);
        this.mensajeError = 'Error al eliminar el proveedor.';
      },
    });
  }
}
