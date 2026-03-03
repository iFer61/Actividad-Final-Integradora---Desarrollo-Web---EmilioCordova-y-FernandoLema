/* ============================================================
    GrooveVault — Validación del formulario de contacto
    Archivo: assets/js/script.js
   ============================================================ */


/* ------------------------------------------------------------
    SECCIÓN 1 — CONFIGURACIÓN
    Aquí puedes modificar los parámetros de validación sin
    necesidad de tocar la lógica del resto del archivo.
   ------------------------------------------------------------ */

const CONFIG = {

    // Mínimo de caracteres por campo
    minCaracteres: {
        nombre:      3,
        ciudad:      3,
        descripcion: 4
    },

    // Dominios de email permitidos.
    // Para agregar uno nuevo, añade una cadena a esta lista.
    // Para quitar uno, elimínalo.
    dominiosPermitidos: [
        "gmail.com",
        "googlemail.com",
        "outlook.com",
        "outlook.es",
        "hotmail.com",
        "hotmail.es",
        "live.com",
        "live.es",
        "msn.com",
        "icloud.com",
        "me.com",
        "mac.com",
        "yahoo.com",
        "yahoo.es",
        "duck.com",
        "proton.me",
        "protonmail.com",
        "pm.me"
    ],

    // Mensajes de error personalizados por campo y tipo de error.
    // Puedes editar el texto de cualquier mensaje aquí.
    mensajes: {
        nombre: {
            vacio:      "El nombre es obligatorio.",
            muyCorto:   "El nombre debe tener al menos 3 caracteres."
        },
        ciudad: {
            vacio:      "La ciudad es obligatoria.",
            muyCorto:   "La ciudad debe tener al menos 3 caracteres."
        },
        email: {
            vacio:      "El email es obligatorio.",
            formato:    "Ingresa un email con formato válido (ejemplo@dominio.com).",
            dominio:    "Por favor usa un correo de un proveedor conocido (Gmail, Outlook, iCloud, etc.)."
        },
        asunto: {
            vacio:      "Debes seleccionar un asunto antes de continuar."
        },
        descripcion: {
            vacio:      "La descripción es obligatoria.",
            muyCorto:   "La descripción debe tener al menos 4 caracteres."
        }
    }
};


/* ------------------------------------------------------------
    SECCIÓN 2 — REFERENCIAS AL HTML
    Obtiene cada elemento del formulario por su ID.
    Si cambias un ID en el HTML, actualízalo aquí también.
   ------------------------------------------------------------ */

const form        = document.getElementById("formulario-contacto");

const campos = {
    nombre:      document.getElementById("nombre"),
    ciudad:      document.getElementById("ciudad"),
    email:       document.getElementById("email"),
    asunto:      document.getElementById("asunto"),
    descripcion: document.getElementById("descripcion")
};


/* ------------------------------------------------------------
    SECCIÓN 3 — FUNCIONES DE VALIDACIÓN INDIVIDUALES
    Cada función recibe el valor del campo y devuelve
    un mensaje de error (string) o null si es válido.
   ------------------------------------------------------------ */

function validarNombre(valor) {
    if (valor.trim() === "")
        return CONFIG.mensajes.nombre.vacio;
    if (valor.trim().length < CONFIG.minCaracteres.nombre)
        return CONFIG.mensajes.nombre.muyCorto;
    return null;
}

function validarCiudad(valor) {
    if (valor.trim() === "")
        return CONFIG.mensajes.ciudad.vacio;
    if (valor.trim().length < CONFIG.minCaracteres.ciudad)
        return CONFIG.mensajes.ciudad.muyCorto;
    return null;
}

function validarEmail(valor) {
    // Verifica que el formato sea algo@algo.algo
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valor.trim() === "")
        return CONFIG.mensajes.email.vacio;
    if (!formatoEmail.test(valor.trim()))
        return CONFIG.mensajes.email.formato;

    // Extrae el dominio (lo que va después del @) y lo compara
    // con la lista de dominios permitidos en CONFIG
    const dominio = valor.trim().split("@")[1].toLowerCase();
    if (!CONFIG.dominiosPermitidos.includes(dominio))
        return CONFIG.mensajes.email.dominio;

    return null;
}

function validarAsunto(valor) {
    if (valor === "")
        return CONFIG.mensajes.asunto.vacio;
    return null;
}

function validarDescripcion(valor) {
    if (valor.trim() === "")
        return CONFIG.mensajes.descripcion.vacio;
    if (valor.trim().length < CONFIG.minCaracteres.descripcion)
        return CONFIG.mensajes.descripcion.muyCorto;
    return null;
}


/* ------------------------------------------------------------
    SECCIÓN 4 — MOSTRAR Y OCULTAR ERRORES EN EL HTML
    Busca (o crea) un <span> de error junto a cada campo
    y muestra u oculta el mensaje según corresponda.
   ------------------------------------------------------------ */

function mostrarError(campo, mensaje) {
    // Busca un span de error ya existente junto al campo
    let spanError = campo.parentElement.querySelector(".error-mensaje");

    // Si no existe, lo crea y lo inserta debajo del campo
    if (!spanError) {
        spanError = document.createElement("span");
        spanError.classList.add("error-mensaje");

        // Estilo en línea mínimo para que sea visible sin CSS extra.
        spanError.style.color     = "#e05a2b";
        spanError.style.fontSize  = "0.82rem";
        spanError.style.marginTop = "4px";
        spanError.style.display   = "block";

        campo.insertAdjacentElement("afterend", spanError);
    }

    spanError.textContent = mensaje;
    campo.style.borderColor = "#e05a2b"; // borde rojo en el campo con error
}

function limpiarError(campo) {
    const spanError = campo.parentElement.querySelector(".error-mensaje");
    if (spanError) spanError.textContent = "";
    campo.style.borderColor = ""; // restaura el borde original del CSS
}


/* ------------------------------------------------------------
    SECCIÓN 5 — VALIDACIÓN COMPLETA DEL FORMULARIO
    Ejecuta todas las validaciones y devuelve true solo si
    todos los campos son válidos.
   ------------------------------------------------------------ */

function validarFormulario() {
    const errores = {
        nombre:      validarNombre(campos.nombre.value),
        ciudad:      validarCiudad(campos.ciudad.value),
        email:       validarEmail(campos.email.value),
        asunto:      validarAsunto(campos.asunto.value),
        descripcion: validarDescripcion(campos.descripcion.value)
    };

    // Muestra u oculta el error de cada campo según el resultado
    for (const campo in errores) {
        if (errores[campo] !== null) {
            mostrarError(campos[campo], errores[campo]);
        } else {
            limpiarError(campos[campo]);
        }
    }

    // El formulario es válido solo si no hay ningún error
    const formularioValido = Object.values(errores).every(e => e === null);
    return formularioValido;
}


/* ------------------------------------------------------------
    SECCIÓN 6 — VALIDACIÓN EN TIEMPO REAL (al salir del campo)
    Cada campo se valida individualmente cuando el usuario
    lo abandona (evento "blur"), para dar retroalimentación
    inmediata sin esperar al envío.
   ------------------------------------------------------------ */

campos.nombre.addEventListener("blur", () => {
    const error = validarNombre(campos.nombre.value);
    error ? mostrarError(campos.nombre, error) : limpiarError(campos.nombre);
});

campos.ciudad.addEventListener("blur", () => {
    const error = validarCiudad(campos.ciudad.value);
    error ? mostrarError(campos.ciudad, error) : limpiarError(campos.ciudad);
});

campos.email.addEventListener("blur", () => {
    const error = validarEmail(campos.email.value);
    error ? mostrarError(campos.email, error) : limpiarError(campos.email);
});

campos.asunto.addEventListener("blur", () => {
    const error = validarAsunto(campos.asunto.value);
    error ? mostrarError(campos.asunto, error) : limpiarError(campos.asunto);
});

campos.descripcion.addEventListener("blur", () => {
    const error = validarDescripcion(campos.descripcion.value);
    error ? mostrarError(campos.descripcion, error) : limpiarError(campos.descripcion);
});


/* ------------------------------------------------------------
    SECCIÓN 7 — EVENTO DE ENVÍO
    Intercepta el submit del formulario, ejecuta la validación
    completa y solo permite el envío si todo es válido.
   ------------------------------------------------------------ */

form.addEventListener("submit", function (evento) {

    // Siempre previene el envío por defecto primero
    evento.preventDefault();

    // Ejecuta la validación completa
    const formularioValido = validarFormulario();

    if (!formularioValido) {
        // Bloquea el envío y desplaza la vista al primer campo con error
        const primerError = document.querySelector(".error-mensaje:not(:empty)");
        if (primerError) {
            primerError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return; // detiene la ejecución aquí
    }

    // Si llegamos aquí, el formulario es válido.
    alert("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.");
    form.reset();

    // Limpia los bordes de todos los campos tras el reset
    for (const campo in campos) {
        limpiarError(campos[campo]);
    }
});