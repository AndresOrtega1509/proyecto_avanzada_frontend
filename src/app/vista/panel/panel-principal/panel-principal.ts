import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BarraLateral } from '../componentes/barra-lateral/barra-lateral';
import { Encabezado } from '../componentes/encabezado/encabezado';

@Component({
  selector: 'app-panel-principal',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BarraLateral, Encabezado],
  templateUrl: './panel-principal.html',
  styleUrl: './panel-principal.css',
})
export class PanelPrincipal {}
