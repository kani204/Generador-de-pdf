# Generador de Certificados para Eventos Deportivos

Este proyecto es un generador de certificados para eventos deportivos escolares, donde podes crear, guardar y descargar certificados en formato PDF.

## Funcionalidades

- Crear certificados personalizados
- Guardar certificados en la base de datos local
- Ver historial de certificados generados
- Buscar certificados por nombre, evento o rol
- Descargar certificados en formato PDF
- Subir logo personalizado (opcional)

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- jsPDF (para generar PDFs)
- IndexedDB (para almacenamiento local)

## Estructura del proyecto

- **index.html**: Archivo principal con la estructura de la página
- **estilos.css**: Estilos personalizados adicionales a Bootstrap
- **app.js**: Lógica de la aplicación

## Cómo funciona

1. Completa el formulario con todos los datos del evento y participante
2. Opcionalmente, sube un logo para personalizar el certificado
3. Presiona "generar certificado" para ver una vista previa
4. Descarga el PDF con el botón "descargar pdf"
5. Guarda el certificado en la base de datos local con "guardar certificado"
6. Accede al historial para ver, descargar o eliminar certificados anteriores

## Cómo ejecutar el proyecto

Solo necesitas abrir el archivo index.html en tu navegador web favorito. Todas las dependencias se cargan desde CDNs, por lo que no necesitas instalar nada adicional.

## Instalación en servidor web

Si quieres subir el proyecto a un servidor web:

1. Sube los archivos index.html, estilos.css y app.js a tu servidor
2. No se requiere ninguna configuración adicional

## Notas importantes

- Los certificados se guardan localmente en tu navegador usando IndexedDB
- Si borras el historial de navegación, perderás los certificados guardados
- El proyecto funciona sin conexión a internet una vez cargado
- Los certificados incluyen un número único para mayor seguridad
- El diseño es responsive, funciona en celulares y computadoras

## Mejoras futuras

- Agregar opción para firmar el certificado digitalmente
- Personalizar colores y diseño del certificado
- Agregar más tipos de roles y eventos
- Exportar todos los certificados juntos

## Creado por

Este proyecto fue creado por Fernandez Devicenzi Franco de 7mo año de la EEST N.º 1 – "Eduardo Ader" de Vicente López para la materia de Proyecto de Implementación de Sitios web Dinámicos.
