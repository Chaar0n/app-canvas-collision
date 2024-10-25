const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d"); 

// Obtiene el alto y el ancho de la ventana actual del navegador
const window_height = window.innerHeight;
const window_width = window.innerWidth;

// Ajusta el tamaño del canvas para ocupar todo el espacio de la ventana
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8"; // Establece el color de fondo del canvas a un tono amarillo claro

// Clase que define un círculo
class Circle {
    constructor(x, y, radius, color, text, speed) { // Constructor que inicializa las propiedades del círculo
        this.posX = x; // Posición X del círculo
        this.posY = y; // Posición Y del círculo
        this.radius = radius; // Radio del círculo
        this.color = color; // Color del borde del círculo
        this.originalColor = color; // Color original del círculo
        this.text = text; // Texto que se mostrará dentro del círculo
        this.speed = speed; // * Velocidad a la que se moverá el círculo
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed; // Dirección aleatoria en el eje X
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed; // Dirección aleatoria en el eje Y
    }

    // Método para dibujar el círculo en el canvas
    draw(context) {
        context.beginPath(); // Comienza el dibujo
        context.strokeStyle = this.color; // Define el color del borde del círculo
        context.textAlign = "center"; // Alinea el texto al centro
        context.textBaseline = "middle"; // Alinea verticalmente el texto en el centro
        context.font = "15px Arial"; // Define la fuente y tamaño del texto
        context.fillText(this.text, this.posX, this.posY); // Dibuja el texto en el círculo
        context.lineWidth = 2; // Define el grosor del borde del círculo
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false); // Dibuja el círculo
        context.stroke(); // Aplica el borde al círculo
        context.closePath(); // Termina el dibujo del círculo
    }

    // Método que actualiza la posición del círculo y lo redibuja
    update(context) {
        this.draw(context); // Llama al método draw para redibujar el círculo
        this.posX += this.dx; // Actualiza la posición X del círculo según la velocidad
        // Si el círculo toca el borde derecho o izquierdo del canvas, cambia de dirección
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        this.posY += this.dy; // Actualiza la posición Y del círculo según la velocidad
        // Si el círculo toca el borde superior o inferior del canvas, cambia de dirección
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

// Método para detectar colisiones con otro círculo
checkCollision(otherCircle) {
    // Calcula la distancia entre los centros de los dos círculos
    let distX = this.posX - otherCircle.posX;
    let distY = this.posY - otherCircle.posY;
    let distance = Math.sqrt(distX * distX + distY * distY);

    // Si la distancia es menor que la suma de los radios, hay colisión
    if (distance < this.radius + otherCircle.radius) {
        this.color = "#0000FF"; // Cambia el color a azul si hay colisión
            otherCircle.color = "#0000FF"; // Cambia el color del otro círculo a azul
        } else {
            // Si no hay colisión, vuelve al color original
            this.color = this.originalColor;
            otherCircle.color = otherCircle.originalColor;
        }
    }
}

let circles = []; // Crea un array vacío para almacenar varios círculos

// Función que genera 'n' círculos con propiedades aleatorias
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Genera un radio aleatorio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius; // Posición X aleatoria dentro del canvas
        let y = Math.random() * (window_height - radius * 2) + radius; // Posición Y aleatoria dentro del canvas
        let color = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Genera un color aleatorio en formato hexadecimal
        let speed = Math.random() * 4 + 1; // Velocidad aleatoria entre 1 y 5
        let text = `C${i + 1}`; // Texto dentro del círculo, por ejemplo "C1", "C2", etc.
        
        // Crea un nuevo círculo con las propiedades generadas y lo añade al array 'circles'
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función que anima los círculos en el canvas
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpia todo el canvas para evitar que los círculos anteriores se queden dibujados
    circles.forEach((circle, index) => {  // Itera sobre todos los círculos y actualiza su posición
        circle.update(ctx); // Llama al método update para cada círculo
    for (let j = index + 1; j < circles.length; j++) { // Verifica colisiones con los demás círculos
        circle.checkCollision(circles[j]); // Verifica colisión con otro círculo
    }
});
    requestAnimationFrame(animate); // Vuelve a llamar a la función 'animate' para crear un bucle de animación
}

// Genera 10 círculos y comienza la animación
generateCircles(10); // Llama a la función para generar círculos
animate(); // Inicia la animación