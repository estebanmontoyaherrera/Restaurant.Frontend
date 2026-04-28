🥗 El Buen Sazón - Frontend (Angular 21)
Interfaz moderna desarrollada en Angular 21 para la gestión operativa del restaurante, conectada de forma eficiente al backend en .NET 10.

🚀 Alcance de la Solución
El frontend se centra en la resolución de los dos pilares críticos solicitados:

Módulo de Identity: Interfaz de autenticación y gestión de acceso. Implementa el flujo de seguridad basado en JWT, asegurando que solo usuarios autorizados puedan operar el sistema.

Módulo de Ordering (Pedidos): Pantalla principal para la creación y seguimiento de pedidos. Permite la asignación de mesas, gestión de platos por pedido y el control de la máquina de estados (Abierto, En Preparación, etc.) en tiempo real.

🛠️ Tecnologías Clave
Angular 21: Uso de Signals para una reactividad ligera y eficiente.

Interceptors: Gestión automática de tokens de seguridad para el módulo de Identity.

HttpClient: Comunicación optimizada con el API REST.

📦 Instalación y Ejecución
Instalar dependencias:

Bash
npm install
Correr el proyecto:

Bash
ng serve
Acceso: http://localhost:4200

🔄 Solución a Requerimientos del Legacy
Validaciones de Negocio: El frontend respeta las reglas del backend, como no permitir pedidos en mesas ocupadas o avanzar estados sin platos.

Seguridad: Integración total con el sistema de roles definido en el backend.

Mantenibilidad: Código estructurado por servicios y componentes desacoplados, facilitando el mantenimiento a largo plazo.