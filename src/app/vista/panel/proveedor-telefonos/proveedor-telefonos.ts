import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProveedorTelefonosService } from '../../../core/services/proveedor-telefonos.service';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { TelefonosService } from '../../../core/services/telefonos.service';

import { ProveedorTelefono } from '../../../core/models/proveedor-telefono.model';
import { ProveedorTelefonoRequest } from '../../../core/models/proveedor-telefono-request.model';
import { Proveedor } from '../../../core/models/proveedor.model';
import { Telefono } from '../../../core/models/telefono.model';

@Component({
  selector: 'app-proveedor-telefonos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor-telefonos.html',
  styleUrl: './proveedor-telefonos.css',
})
export class ProveedorTelefonosComponent implements OnInit {
  registros: ProveedorTelefono[] = [];
  registrosFiltrados: ProveedorTelefono[] = [];

  proveedores: Proveedor[] = [];
  telefonos: Telefono[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  registroSeleccionado: ProveedorTelefono | null = null;

  form = {
    idProveedor: null as number | null,
    idTelefono: null as number | null,
  };

  constructor(
    private proveedorTelefonosService: ProveedorTelefonosService,
    private proveedoresService: ProveedoresService,
    private telefonosService: TelefonosService
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarTelefonos();
    this.cargarRegistros();
  }

  cargarProveedores(): void {
    this.proveedoresService.getProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: (err) => console.error('Error al cargar proveedores', err),
    });
  }

  cargarTelefonos(): void {
    this.telefonosService.getTelefonos().subscribe({
      next: (data) => (this.telefonos = data),
      error: (err) => console.error('Error al cargar teléfonos', err),
    });
  }

  cargarRegistros(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.proveedorTelefonosService.getProveedorTelefonos().subscribe({
      next: (data) => {
        this.registros = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar teléfonos de proveedor', err);
        this.mensajeError = 'Error al cargar teléfonos de proveedor.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.registrosFiltrados = term
      ? this.registros.filter(
          (r) =>
            r.telefono?.numero.toLowerCase().includes(term) ||
            r.proveedor?.nombre.toLowerCase().includes(term)
        )
      : [...this.registros];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevo(): void {
    this.modoEdicion = false;
    this.registroSeleccionado = null;
    this.form = {
      idProveedor: null,
      idTelefono: null,
    };
  }

  editar(registro: ProveedorTelefono): void {
    this.modoEdicion = true;
    this.registroSeleccionado = registro;

    this.form = {
      idProveedor: registro.idProveedor ?? registro.proveedor?.idProveedor ?? null,
      idTelefono: registro.idTelefono ?? registro.telefono?.idTelefono ?? null,
    };
  }

  cancelar(): void {
    this.nuevo();
  }

  guardar(): void {
    const idProveedor = this.form.idProveedor;
    const idTelefono = this.form.idTelefono;

    if (!idProveedor || !idTelefono) {
      this.mensajeError = 'Proveedor y teléfono son obligatorios.';
      return;
    }

    this.mensajeError = '';

    const payload: ProveedorTelefonoRequest = {
      idProveedor,
      idTelefono,
    };

    if (this.modoEdicion && this.registroSeleccionado?.idProveedoresTelefonos != null) {

      this.proveedorTelefonosService
        .updateProveedorTelefono(this.registroSeleccionado.idProveedoresTelefonos, payload)
        .subscribe({
          next: () => {
            this.cargarRegistros();
            this.nuevo();
          },
          error: (err) => {
            console.error('Error al actualizar teléfono de proveedor', err);
            this.mensajeError = 'Error al actualizar el teléfono.';
          },
        });
    } else {
      this.proveedorTelefonosService.createProveedorTelefono(payload).subscribe({
        next: () => {
          this.cargarRegistros();
          this.nuevo();
        },
        error: (err) => {
          console.error('Error al crear teléfono de proveedor', err);
          this.mensajeError = 'Error al crear el teléfono.';
        },
      });
    }
  }

  eliminar(registro: ProveedorTelefono): void {
    if (!registro.idProveedoresTelefonos) return;

    const confirmar = confirm(
      `¿Eliminar la relación del teléfono "${registro.telefono?.numero}" con el proveedor "${registro.proveedor?.nombre}"?`
    );
    if (!confirmar) return;

    this.proveedorTelefonosService
    .deleteProveedorTelefono(registro.idProveedoresTelefonos)
    .subscribe({
      next: () => this.cargarRegistros(),
      error: (err) => {
        console.error('Error al eliminar teléfono de proveedor', err);
        this.mensajeError = 'Error al eliminar el teléfono.';
      },
    });
  }
}
