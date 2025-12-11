// Estructura de datos para los escenarios de aprendizaje
// ... (El array 'lessons' se mantiene exactamente igual)
const lessons = [
    {
        id: 'variables',
        title: '1. Variables y Asignación',
        theory: 'En Python, una **variable** es como una caja con un nombre donde puedes almacenar datos. Para crear una variable, simplemente le das un nombre y usas el signo igual (`=`) para asignarle un valor.',
        prompt: 'Desafío: Declara una variable llamada **edad** y asígnale el valor entero **25**.',
        validate: (code) => {
            const cleanCode = code.trim().replace(/\s/g, '').toLowerCase();
            let edad = null;
            
            if (cleanCode.includes('edad=25')) {
                edad = 25; 
            }

            if (edad === 25) {
                return { success: true, message: '¡Excelente! Has declarado correctamente la variable **edad** con el valor 25.' };
            } else {
                return { 
                    success: false, 
                    message: 'Error: Asegúrate de que el nombre de la variable sea **exactamente** `edad` y que el valor asignado sea el número `25`.' 
                };
            }
        }
    },
    {
        id: 'datatypes',
        title: '2. Tipos de Datos (String)',
        theory: 'El tipo de dato **String (cadena de texto)** se usa para almacenar texto y siempre va encerrado entre comillas dobles (`"`) o simples (`\'`). Para mostrar algo en pantalla se usa la función `print()`. Puedes unir strings (concatenar) con el operador `+`.',
        prompt: 'Desafío: Declara una variable llamada **nombre** con el valor **"Alex"**. Luego, usa la función `print()` para mostrar en la consola la concatenación de la palabra "Hola, " y la variable **nombre**.',
        validate: (code) => {
            const cleanCode = code.trim().replace(/\s/g, '');
            const nameAssigned = cleanCode.includes('nombre="Alex"') || cleanCode.includes("nombre='Alex'");
            const printExecuted = cleanCode.includes('print("Hola," + nombre)') || cleanCode.includes("print('Hola,' + nombre)");

            if (nameAssigned && printExecuted) {
                return { success: true, message: '¡Perfecto! Declaraste la variable correctamente y usaste `print()` para concatenar el saludo. La salida simulada sería: **Hola, Alex**.' };
            } else if (!nameAssigned) {
                return { 
                    success: false, 
                    message: 'Error en la variable: Asegúrate de declarar **nombre** y asignarle el valor `"Alex"` (con comillas).' 
                };
            } else {
                return { 
                    success: false, 
                    message: 'Error en el `print()`: Revisa que estés usando `print("Hola, " + nombre)` correctamente.' 
                };
            }
        }
    },
    {
        id: 'conditionals',
        title: '3. Condicionales (if/else)',
        theory: 'Las estructuras **condicionales** (`if`, `elif`, `else`) permiten que tu programa tome decisiones. La sintaxis básica es: `if condicion: ... else: ...`. Recuerda la **indentación** (espacios o tabulaciones) después de los dos puntos (`:`) para el bloque de código.',
        prompt: 'Desafío: Tienes una variable predefinida llamada **numero** (con valor 15). Escribe un código que use una estructura **if/else** para imprimir la frase **"Es un número grande"** si **numero** es mayor que 10, o la frase **"Es un número pequeño"** en cualquier otro caso.',
        validate: (code) => {
            const cleanCode = code.trim().replace(/\s/g, '').toLowerCase();

            const ifCondition = cleanCode.includes('ifnumero>10:');
            const printIf = cleanCode.includes('print("esunnúmerogrande")') || cleanCode.includes("print('esunnúmerogrande')");
            const elseStatement = cleanCode.includes('else:');
            const printElse = cleanCode.includes('print("esunnúmeropequeño")') || cleanCode.includes("print('esunnúmeropequeño')");


            if (ifCondition && printIf && elseStatement && printElse) {
                return { 
                    success: true, 
                    message: '¡Genial! Tu estructura `if/else` es correcta. Dado que `numero` es 15, la salida simulada es: **Es un número grande**.' 
                };
            } else if (!ifCondition) {
                return { 
                    success: false, 
                    message: 'Error en la condición `if`: Asegúrate de usar `if numero > 10:` correctamente.' 
                };
            } else if (!printIf || !printElse) {
                return { 
                    success: false, 
                    message: 'Error en los mensajes `print`: Revisa que imprimas exactamente **"Es un número grande"** en el `if` y **"Es un número pequeño"** en el `else`.' 
                };
            } else {
                 return { 
                    success: false, 
                    message: 'Error: Revisa la sintaxis general del `if/else`, incluyendo los dos puntos (`:`) y las palabras clave.' 
                };
            }
        }
    }
];
// Fin del array 'lessons'
// ---------------------------------------------------------------------

// Variables de estado global
let currentLessonIndex = 0;
// Estado clave: Rastrea hasta qué índice ha completado el usuario.
let unlockedLessonIndex = 0; 

// Referencias del DOM
const lessonListUl = document.getElementById('lesson-list');
const lessonTitleH2 = document.getElementById('lesson-title');
const theoryTextP = document.getElementById('theory-text');
const scenarioPromptP = document.getElementById('scenario-prompt');
const userCodeTextarea = document.getElementById('user-code');
const runButton = document.getElementById('run-button');
const nextButton = document.getElementById('next-button');
const resultsFeedbackDiv = document.getElementById('results-feedback');

/**
 * Carga el contenido de la lección actual en la interfaz.
 */
function loadLesson(index) {
    // Solo permitir cargar lecciones que ya están desbloqueadas o la que se está haciendo actualmente.
    if (index < 0 || index > unlockedLessonIndex) {
        // Prevenir la carga de lecciones futuras no desbloqueadas.
        return; 
    }

    currentLessonIndex = index;
    const lesson = lessons[currentLessonIndex];

    // Actualizar el contenido principal
    lessonTitleH2.textContent = lesson.title;
    theoryTextP.innerHTML = lesson.theory;
    scenarioPromptP.textContent = lesson.prompt;
    userCodeTextarea.value = ''; // Limpiar el editor
    userCodeTextarea.disabled = false;
    
    // Resetear el feedback y botones
    resultsFeedbackDiv.style.display = 'none';
    resultsFeedbackDiv.className = 'feedback';
    resultsFeedbackDiv.innerHTML = '';
    
    // El botón de Ejecutar siempre visible, Siguiente oculto hasta completar
    runButton.style.display = 'inline-block';
    nextButton.style.display = 'none';

    // Resaltar la lección actual en la sidebar
    updateSidebarActiveState();
}

/**
 * Genera la lista de lecciones en la barra lateral, mostrando solo las desbloqueadas.
 */
function createLessonList() {
    lessonListUl.innerHTML = '';
    // Iterar solo sobre las lecciones que el usuario ha desbloqueado (incluyendo la actual)
    for (let i = 0; i <= unlockedLessonIndex && i < lessons.length; i++) {
        const lesson = lessons[i];
        const li = document.createElement('li');
        li.textContent = lesson.title;
        li.setAttribute('data-index', i);
        // Manejador de evento para cambiar de lección (si está desbloqueada)
        li.addEventListener('click', () => loadLesson(i));
        lessonListUl.appendChild(li);
    }
}

/**
 * Resalta la lección activa en la barra lateral.
 */
function updateSidebarActiveState() {
    document.querySelectorAll('#lesson-list li').forEach((li, index) => {
        li.classList.toggle('active', index === currentLessonIndex);
    });
}

/**
 * Maneja el clic en el botón "Ejecutar/Verificar".
 */
function handleRunCode() {
    const userCode = userCodeTextarea.value;
    const lesson = lessons[currentLessonIndex];
    
    // Obtener el resultado de la validación simulada
    const result = lesson.validate(userCode); 

    // Mostrar el feedback
    resultsFeedbackDiv.style.display = 'block';
    resultsFeedbackDiv.innerHTML = `<p>${result.message}</p>`;

    if (result.success) {
        resultsFeedbackDiv.classList.remove('error');
        resultsFeedbackDiv.classList.add('success');
        userCodeTextarea.disabled = true; // Desactivar el editor al completar

        // Lógica de Desbloqueo: Si la lección actual es la última desbloqueada, avanzamos el índice
        if (currentLessonIndex === unlockedLessonIndex && currentLessonIndex < lessons.length - 1) {
            unlockedLessonIndex++;
            // Regeneramos la lista para mostrar la nueva lección
            createLessonList(); 
            
            // Mostrar botón para avanzar a la nueva lección
            runButton.style.display = 'none';
            nextButton.style.display = 'inline-block';
            nextButton.disabled = false;
            nextButton.textContent = `Siguiente Tema (${lessons[unlockedLessonIndex].title}) →`;
        } else if (currentLessonIndex === lessons.length - 1) {
            // Última lección completada
            runButton.style.display = 'none';
            nextButton.style.display = 'none';
            resultsFeedbackDiv.innerHTML += '<p>¡Felicidades! Has completado todos los temas iniciales.</p>';
        } else {
             // Ya completada, pero no es la última desbloqueada
             runButton.style.display = 'none';
             nextButton.style.display = 'none';
        }

    } else {
        resultsFeedbackDiv.classList.remove('success');
        resultsFeedbackDiv.classList.add('error');
        // Mantener el botón de ejecutar visible para reintentar
        runButton.style.display = 'inline-block';
        nextButton.style.display = 'none';
    }
}

/**
 * Avanza a la siguiente lección desbloqueada (solo se llama si se completó la anterior).
 */
function handleNextLesson() {
    // La siguiente lección es el índice que acabamos de desbloquear
    if (unlockedLessonIndex < lessons.length) {
        loadLesson(unlockedLessonIndex);
    }
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Al cargar, solo mostramos la primera lección (índice 0)
    createLessonList(); 
    loadLesson(0); 

    // Asignar manejadores de eventos a los botones
    runButton.addEventListener('click', handleRunCode);
    nextButton.addEventListener('click', handleNextLesson);
});
