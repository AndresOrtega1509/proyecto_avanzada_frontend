import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  username = '';
  password = '';
  mensajeError = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.mensajeError = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (resp) => {
        localStorage.setItem('token', resp.accessToken);
        localStorage.setItem('username', this.username);

        this.router.navigate(['/panel']);
      },
      error: (err) => {
        console.error('Error en login', err);
        this.mensajeError = 'Credenciales incorrectas';
      },
    });
  }
}
