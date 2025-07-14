export default function Register() {
  return `
    <div class="login-container">
      <form id="registerForm" class="login-form">
        <h2>Registro</h2>

        <div class="form-group">
          <label for="username">Nombre</label>
          <input type="text" name="username" required />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" name="password" required />
        </div>

        <div class="form-group">
          <label for="image">URL de foto de perfil</label>
          <input type="url" name="image" placeholder="https://..." />
        </div>

        <button type="submit" class="btn">Registrarme</button>
        <button type="button" id="cancelBtn" class="btn cancel-btn">Cancelar</button>
      </form>
    </div>
  `;
}
