export default function Login() {
  return `
    <div class="login-wrapper">
      <h2>Iniciar Sesión</h2>
      <form id="loginForm" class="login-form">
        <div class="form-group">
          <label for="username">Usuario</label>
          <input type="text" name="username" id="username" required>
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" name="password" id="password" required>
        </div>
        <button type="submit">Ingresar</button>
        <p style="text-align:center; margin-top:10px;">
  ¿No tienes cuenta? <a href="#/register">Regístrate</a>
</p>  
      </form>
    </div>
  `;
}
