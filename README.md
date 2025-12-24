# Borja Gramaje - Portfolio

Portfolio personal con interfaz de terminal interactiva, construido con Vite, React, TypeScript y Tailwind CSS.

## 🚀 Despliegue en GitHub Pages

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

### Configuración inicial

1. **Habilita GitHub Pages en tu repositorio:**
   - Ve a `Settings` > `Pages` en tu repositorio de GitHub
   - En `Source`, selecciona `GitHub Actions`
   - Guarda los cambios

2. **Haz push del código:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Verifica el despliegue:**
   - Ve a la pestaña `Actions` en tu repositorio
   - Deberías ver el workflow ejecutándose
   - Una vez completado, tu sitio estará disponible en `https://bgramaje.github.io`

### Despliegue automático

Cada vez que hagas push a la rama `main`, el workflow de GitHub Actions:
1. Construirá el proyecto
2. Desplegará automáticamente a GitHub Pages

### Desarrollo local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 📁 Estructura del proyecto

- `src/pages/` - Páginas principales (HomePage, BlogPage)
- `src/components/` - Componentes reutilizables
- `src/blogs/` - Archivos MDX de los posts del blog
- `src/data/` - Datos del portfolio (jobs, publications, etc.)
- `src/lib/` - Utilidades y lógica de comandos

## 🛠️ Tecnologías

- **Vite** - Build tool
- **React** - Framework UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **MDX** - Contenido de blog
- **React Router** - Navegación
- **Framer Motion** - Animaciones

