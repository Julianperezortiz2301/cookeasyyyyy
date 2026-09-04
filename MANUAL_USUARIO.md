# Manual de usuario — CookEasy

**Sitio en vivo:** https://cookeasyyyyy.vercel.app

## Cuentas de prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| Usuario | `demo@cookeasy.com` | `password123` |
| Administrador | `admin@cookeasy.com` | `admin123` |

También podés crear tu propia cuenta desde **Registrarse** (botón "Login" → "Sign up").

---

## Para cualquier usuario

### Buscar recetas por ingredientes
En la página de inicio, escribí los ingredientes que tenés separados por coma (ej: "pollo,
arroz, tomate") y presioná **Search**. La app te muestra las recetas ordenadas por porcentaje de
coincidencia con lo que escribiste.

### Escanear un producto
Al lado de la barra de búsqueda hay un ícono de código de barras. Tocalo, apuntá la cámara al
código de barras de un producto real, y el nombre se agrega automáticamente a tu búsqueda.

### Ver el detalle de una receta
Al entrar a una receta ves: ingredientes (marcados en verde si ya los tenés, según lo que
buscaste), instrucciones paso a paso, calificación promedio, y recetas relacionadas.

### Calificar una receta
Abajo de cada receta hay un selector de estrellas (1 a 5) y un campo opcional de comentario.
Enviá tu calificación y va a aparecer junto a las de otros usuarios.

### Favoritos
Tocá el corazón sobre la imagen de cualquier receta para guardarla. Verlas todas en **My
Favorites** (menú del usuario, arriba a la derecha).

### Mis recetas — crear y editar
Andá a **My Recipes** → **New recipe**. Completá título, descripción, tiempo, dificultad,
categoría e instrucciones. Para la foto podés:
- Arrastrar una imagen o tocar para elegir un archivo (en el celular abre la cámara).
- O pegar una URL de imagen.

Para los ingredientes podés escribirlos a mano o tocar **Scan barcode** para escanear un
producto real y agregarlo automáticamente. Editá o borrá tus recetas desde **My Recipes**.

### Mi Despensa (`/pantry`)
Acá llevás el inventario de lo que tenés en tu cocina:
1. Escaneá un producto (esto solo completa el nombre) o escribilo a mano.
2. **Importante:** antes de tocar "Add to pantry", completá la cantidad y sobre todo la **fecha
   de vencimiento** — un código de barras es igual para todas las unidades de ese producto en el
   mundo, así que nunca puede saber cuándo vence el que compraste vos. Por eso esa fecha siempre
   se pone a mano (la app te lo recuerda con un aviso si la dejás vacía).
3. Cada ítem muestra una etiqueta: **Fresh** (fresco), **Expiring soon** (se vence pronto, 3 días
   o menos) o **Expired** (vencido). Podés cambiar la fecha en cualquier momento tocándola en la
   lista.
4. Más abajo, la app te muestra:
   - **"Cook these before they expire"**: recetas que usan lo que se te está por vencer.
   - **"Recipes you can make"**: todas las recetas posibles con tu despensa actual, indicando
     qué ingredientes te faltan para cada una.
5. Si te falta algo, tocá **"Add missing to shopping list"** y se agrega automáticamente a tu
   lista de compras.

> **Sobre el escaneo:** no todos los productos se encuentran. La app busca en Open Food Facts,
> una base de datos pública y gratuita mantenida por la comunidad, mucho más completa para
> productos europeos que para marcas locales colombianas. Si un código no aparece, tocá **"Close
> and enter it manually"** y escribilo vos — no es un error de la app, es que ese producto
> todavía no está cargado en esa base pública.

### Lista de compras (`/shopping-list`)
Agregá productos a mano, escaneándolos, o desde la despensa (como se explicó arriba). Marcá el
círculo para tachar lo que ya compraste, y borrá lo que no necesitás con el ícono de basura.

### Perfil y configuración
En **My Profile** podés cambiar tu nombre, email y foto (subida real o URL). En **Settings**
podés cambiar tu contraseña.

### Cerrar sesión
Menú del usuario (arriba a la derecha) → **Log Out**.

---

## Para administradores

Iniciá sesión con la cuenta de admin y entrá al panel desde el menú del usuario → **Admin
Dashboard**, o directo a `/admin`.

### Dashboard
Estadísticas generales (usuarios, recetas, categorías, favoritos, suscriptores al newsletter) y
accesos rápidos para crear una receta nueva o agregar un alimento por código de barras.

### Users (`/admin/users`)
Lista de todos los usuarios registrados, con su rol, cuántas recetas y favoritos tiene cada uno.
Podés eliminar cualquier cuenta que no sea de administrador.

### Recipes (`/admin/recipes`)
Todas las recetas de todos los usuarios (no solo las tuyas). Podés eliminarlas o crear una nueva
con **New recipe** (mismo formulario con foto y escáner que usan los usuarios).

### Categories (`/admin/categories`)
Ver, crear (elegí nombre, ícono y color) y borrar categorías. No se puede borrar una categoría
que todavía tenga recetas asignadas.

### Foods (`/admin/ingredients`)
Base central de alimentos/ingredientes que usa toda la app. Escaneá un producto o escribilo a
mano para agregarlo. Esto evita duplicados como "tomate" y "tomates" cargados por distintos
usuarios. No se puede borrar un alimento que ya esté usado en alguna receta.

---

## Notas importantes

- El **escaneo de código de barras** necesita permiso de cámara y una conexión segura. En el
  sitio en vivo (`https://cookeasyyyyy.vercel.app`) funciona sin problema en cualquier celular,
  porque ya tiene HTTPS real.
- No todos los productos escaneados se van a encontrar (ver la nota en la sección de Despensa)
  — siempre podés escribir el nombre a mano como alternativa.
- Las fotos que subís (recetas, avatar) pueden desaparecer si se vuelve a desplegar el sitio —
  es una limitación conocida de este tipo de hosting, documentada en el README para cuando se
  quiera resolver de forma definitiva.
