#  SEIA Studio - POS & Financial Dashboard

SEIA Studio es una aplicación web integral de Punto de Venta (POS) y gestión financiera, diseñada específicamente para barberías. Su enfoque principal es la **"fricción cero"**, permitiendo a los profesionales registrar ingresos y gastos en segundos, mientras un motor matemático calcula y grafica el rendimiento del negocio en tiempo real.

##  Características Principales

* **Caja Registradora Ágil:** Registro de ventas de servicios (catálogo) o ingresos manuales (Monto Libre) con solo dos clics.
* **Sistema de Pago Híbrido:** Capacidad inteligente para dividir y calcular pagos mixtos (Ej: parte en Efectivo y parte por Transferencia) manteniendo la cuadratura exacta de la caja física y bancaria.
* **Control de Egresos:** Registro categorizado de gastos operativos (insumos, alquiler, etc.) para mantener un control estricto del presupuesto.
* **Dashboard Financiero en Tiempo Real:**
  * KPIs automáticos: Ingresos del mes, Gastos del mes, Ganancia Neta y Caja Total Acumulada.
  * Comparativas porcentuales automáticas contra el mes anterior.
  * Gráfico de tendencias (Recharts) que agrupa transacciones diarias.
  * Historial con los últimos 5 movimientos.
* **Diseño UI/UX Profesional:** Interfaz Dark Mode responsiva, alertas mediante Toasts flotantes asíncronos y experiencia adaptada tanto para móviles como para escritorio.

##  Tecnologías Utilizadas (Tech Stack)

**Frontend:**
* [React](https://reactjs.org/) (Vite)
* [Tailwind CSS](https://tailwindcss.com/) (Estilos utilitarios)
* [Recharts](https://recharts.org/) (Gráficos estadísticos interactivos)
* [Lucide React](https://lucide.dev/) (Iconografía)

**Backend & Base de Datos:**
* [Node.js](https://nodejs.org/) con [Express](https://expressjs.com/) (API REST)
* [PostgreSQL](https://www.postgresql.org/) alojado en [Neon.tech](https://neon.tech/) (Serverless DB)

##  Instalación y Ejecución Local

Si deseas correr este proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/CamiloAnania-utn/seia-studio.git](https://github.com/CamiloAnania-utn/seia-studio.git)
