import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  form = {
    email: '',
    password: '',
  };

  loading = false;
  errorMessage = '';
  infoMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.infoMessage = '';

    const email = this.form.email.trim();
    const password = this.form.password.trim();

    if (!email || !password) {
      this.errorMessage = 'Debe ingresar correo y contraseña.';
      return;
    }

    this.loading = true;
    this.infoMessage =
      'Conectando con el servidor... la primera vez puede tardar algunos segundos.';

    this.authService.login(email, password).subscribe({
      next: (resp) => {
        const token = resp.accessToken;

        const usuarioNombre = email;

        if (token) {
          localStorage.setItem('token', token);
        }
        if (usuarioNombre) {
          localStorage.setItem('username', usuarioNombre);
        }

        this.loading = false;
        this.infoMessage = '';
        this.router.navigate(['/panel']);
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
          this.infoMessage = '';
        } else if (err.status === 0) {
          this.infoMessage =
            'No se pudo contactar el servidor. Espera unos segundos y vuelve a intentar.';
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo más tarde.';
          this.infoMessage = '';
        }

        console.error('Error al iniciar sesión', err);
      },
    });
  }
}
