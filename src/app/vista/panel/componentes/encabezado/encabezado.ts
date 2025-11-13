import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.css',
})
export class Encabezado implements OnInit {
  usuarioNombre = 'Usuario';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (username) {
      // si quieres mostrar solo antes del @:
      const nombreCorto = username.split('@')[0];
      this.usuarioNombre = nombreCorto;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
