import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TelefonosService } from '../../../core/services/telefonos.service';
import { Telefono } from '../../../core/models/telefono.model';

@Component({
  selector: 'app-telefonos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './telefonos.html',
  styleUrl: './telefonos.css',
})
export class TelefonosComponent implements OnInit {
  telefonos: Telefono[] = [];
  telefonosFiltrados: Telefono[] = [];

  busqueda = '';
  cargando = false;
  mensajeError = '';

  modoEdicion = false;
  telefonoSeleccionado: Telefono | null = null;

  numeroTelefono = '';

  constructor(private telefonosService: TelefonosService) {}

  ngOnInit(): void {
    this.cargarTelefonos();
  }

  cargarTelefonos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.telefonosService.getTelefonos().subscribe({
      next: (data) => {
        this.telefonos = data;
        this.aplicarFiltro();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar teléfonos', err);
        this.mensajeError = 'Error al cargar los teléfonos.';
        this.cargando = false;
      },
    });
  }

  aplicarFiltro(): void {
    const term = this.busqueda.trim().toLowerCase();
    this.telefonosFiltrados = term
      ? this.telefonos.filter((t) => t.numero.toLowerCase().includes(term))
      : [...this.telefonos];
  }

  limpiarFiltro(): void {
    this.busqueda = '';
    this.aplicarFiltro();
  }

  nuevoTelefono(): void {
    this.modoEdicion = false;
    this.telefonoSeleccionado = null;
    this.numeroTelefono = '';
  }

  editar(t: Telefono): void {
    this.modoEdicion = true;
    this.telefonoSeleccionado = t;
    this.numeroTelefono = t.numero;
  }

  cancelar(): void {
    this.nuevoTelefono();
  }

  guardarTelefono(): void {
    const numero = this.numeroTelefono.trim();

    if (!numero) {
      this.mensajeError = 'El número de teléfono es obligatorio.';
      return;
    }

    this.mensajeError = '';

    const payload = { numero };

    if (this.modoEdicion && this.telefonoSeleccionado?.idTelefono != null) {
      this.telefonosService
        .updateTelefono(this.telefonoSeleccionado.idTelefono, payload)
        .subscribe({
          next: () => {
            this.cargarTelefonos();
            this.nuevoTelefono();
          },
          error: (err) => {
            console.error('Error al actualizar teléfono', err);
            this.mensajeError = 'Error al actualizar el teléfono.';
          },
        });
    } else {
      this.telefonosService.createTelefono(payload).subscribe({
        next: () => {
          this.cargarTelefonos();
          this.nuevoTelefono();
        },
        error: (err) => {
          console.error('Error al crear teléfono', err);
          this.mensajeError = 'Error al crear el teléfono.';
        },
      });
    }
  }

  eliminar(t: Telefono): void {
    if (!t.idTelefono) return;

    const confirmar = confirm(`¿Eliminar el teléfono "${t.numero}"?`);
    if (!confirmar) return;

    this.telefonosService.deleteTelefono(t.idTelefono).subscribe({
      next: () => this.cargarTelefonos(),
      error: (err) => {
        console.error('Error al eliminar teléfono', err);
        this.mensajeError = 'Error al eliminar el teléfono.';
      },
    });
  }
}
