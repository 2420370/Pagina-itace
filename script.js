// ==========================================
// ELEMENTOS PRINCIPALES
// ==========================================

const bienvenida = document.getElementById("bienvenida");
const portal = document.getElementById("portal");
const btnEntrar = document.getElementById("entrarPortal");


// ==========================================
// NAVEGACIÓN ENTRE SECCIONES
// ==========================================

function mostrarPantalla(id) {
    if (!id) return;

    id = id.replace("#", "");

    const pantallas = document.querySelectorAll(".screen");
    let encontrada = false;

    pantallas.forEach(function (pantalla) {
        const activa = pantalla.id === id;

        pantalla.classList.toggle("active", activa);
        pantalla.style.display = activa ? "block" : "none";

        if (activa) encontrada = true;
    });

    if (!encontrada) {
        console.warn("No se encontró la sección:", id);
        return;
    }

    document.querySelectorAll("[data-screen]").forEach(function (boton) {
        const destino = boton.dataset.screen.replace("#", "");
        boton.classList.toggle("active", destino === id);
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================================
// ENTRAR AL PORTAL
// ==========================================

function entrarAlPortal() {
    if (bienvenida) bienvenida.style.display = "none";

    if (portal) {
        portal.classList.remove("hidden");
        portal.style.display = "block";
    }

    mostrarPantalla("inicio");
}

if (btnEntrar) {
    btnEntrar.addEventListener("click", entrarAlPortal);
}


// ==========================================
// BOTONES DE NAVEGACIÓN
// ==========================================

document.querySelectorAll("[data-screen]").forEach(function (boton) {
    boton.addEventListener("click", function (e) {
        e.preventDefault();

        if (portal) {
            portal.classList.remove("hidden");
            portal.style.display = "block";
        }

        if (bienvenida) bienvenida.style.display = "none";

        mostrarPantalla(boton.dataset.screen);

        const nav = document.getElementById("nav");
        const menuToggle = document.getElementById("menuToggle");

        if (nav) nav.classList.remove("open");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menú");
        }
    });
});


// ==========================================
// MENÚ PARA CELULARES
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
        const abierto = nav.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(abierto));
        menuToggle.setAttribute(
            "aria-label",
            abierto ? "Cerrar menú" : "Abrir menú"
        );
    });
}


// ==========================================
// REPRODUCTORES DE AUDIO
// ==========================================

const audios = [
    {
        boton: document.getElementById("btnAudioItace"),
        audio: document.getElementById("audioItace"),
        nombre: "Audio del ITACE"
    },
    {
        boton: document.getElementById("btnAudioTamaulipas"),
        audio: document.getElementById("audioTamaulipas"),
        nombre: "Himno de Tamaulipas"
    }
];

audios.forEach(function (elemento) {
    if (!elemento.boton || !elemento.audio) return;

    elemento.boton.addEventListener("click", async function () {
        const audio = elemento.audio;

        audios.forEach(function (otro) {
            if (otro.audio && otro.audio !== audio) {
                otro.audio.pause();
                otro.audio.currentTime = 0;

                if (otro.boton) {
                    otro.boton.textContent = "▶️ " + otro.nombre;
                    otro.boton.classList.remove("reproduciendo");
                }
            }
        });

        if (audio.paused) {
            try {
                await audio.play();
                elemento.boton.textContent = "⏸ Pausar audio";
                elemento.boton.classList.add("reproduciendo");
            } catch (error) {
                alert("No se pudo reproducir el audio. Revisa el archivo.");
            }
        } else {
            audio.pause();
        }
    });

    elemento.audio.addEventListener("ended", function () {
        elemento.boton.textContent = "▶️ " + elemento.nombre;
        elemento.boton.classList.remove("reproduciendo");
    });

    elemento.audio.addEventListener("pause", function () {
        if (elemento.audio.ended) return;

        elemento.boton.textContent = "▶️ " + elemento.nombre;
        elemento.boton.classList.remove("reproduciendo");
    });
});


// ==========================================
// PAUSAR UN VIDEO CUANDO COMIENZA OTRO
// ==========================================

const videos = document.querySelectorAll("video");

videos.forEach(function (videoActual) {
    videoActual.addEventListener("play", function () {
        videos.forEach(function (otroVideo) {
            if (otroVideo !== videoActual) {
                otroVideo.pause();
            }
        });
    });
});


// ==========================================
// DIRECTORIO DOCENTE Y CATEGORÍAS
// ==========================================

const buscador = document.getElementById("buscarDocente");
const listaDocentes = document.getElementById("listaDocentes");
const contadorDocentes = document.getElementById("contadorDocentes");
const sinDocentes = document.getElementById("sinDocentes");

let categoriaSeleccionada = "todos";

// Clasificación basada en la información que aparece
// en las tarjetas del directorio.

const categoriasDocentes = {
    "Felipe Hernández González": ["modulos"],
    "José López Vázquez": ["modulos"],
    "José Luis González López": ["modulos", "materias"],
    "Javier Alfonso Acosta García": ["modulos", "materias"],
    "Mario Alonso Santoyo Arroyo": ["modulos", "materias"],

    "Juan Pablo Torres Adame": ["materias", "clubes"],
    "Diana Janeth Uriegas Garza": ["materias", "clubes"],
    "Walter Allan Barrera Cerda": ["materias", "clubes"]
};

function obtenerCategorias(docente) {
    const nombre = docente.querySelector("h3");

    if (!nombre) return ["materias"];

    const nombreDocente = nombre.textContent.trim();

    if (categoriasDocentes[nombreDocente]) {
        return categoriasDocentes[nombreDocente];
    }

    return ["materias"];
}


// Coloca las categorías correspondientes en cada tarjeta.

function prepararCategoriasDocentes() {
    if (!listaDocentes) return;

    const docentes = listaDocentes.querySelectorAll(".docente");

    docentes.forEach(function (docente) {
        const categorias = obtenerCategorias(docente);
        docente.dataset.categoria = categorias.join(" ");
    });
}


// Crea los botones de categorías automáticamente.

function crearFiltrosDocentes() {
    const herramientas = document.querySelector(".directory-tools");

    if (!herramientas || document.getElementById("filtrosDocentes")) return;

    const contenedor = document.createElement("div");

    contenedor.id = "filtrosDocentes";
    contenedor.className = "teacher-filters";
    contenedor.setAttribute("aria-label", "Categorías del personal docente");

    const filtros = [
        { id: "todos", texto: "Directorio completo" },
        { id: "modulos", texto: "Docentes de módulos profesionales" },
        { id: "materias", texto: "Docentes de asignaturas" },
        { id: "clubes", texto: "Instructores de clubes y actividades" }
    ];

    filtros.forEach(function (filtro) {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "teacher-filter";
        boton.textContent = filtro.texto;
        boton.dataset.categoria = filtro.id;
        boton.setAttribute("aria-pressed", String(filtro.id === "todos"));

        if (filtro.id === "todos") {
            boton.classList.add("active");
        }

        boton.addEventListener("click", function () {
            categoriaSeleccionada = filtro.id;

            document.querySelectorAll(".teacher-filter").forEach(function (otro) {
                const activo = otro.dataset.categoria === filtro.id;

                otro.classList.toggle("active", activo);
                otro.setAttribute("aria-pressed", String(activo));
            });

            filtrarDocentes();
        });

        contenedor.appendChild(boton);
    });

    if (contadorDocentes) {
        herramientas.insertBefore(contenedor, contadorDocentes);
    } else {
        herramientas.appendChild(contenedor);
    }
}


// Combina la búsqueda con la categoría seleccionada.

function filtrarDocentes() {
    if (!listaDocentes) return;

    const texto = buscador
        ? buscador.value.toLowerCase().trim()
        : "";

    const docentes = listaDocentes.querySelectorAll(".docente");

    let visibles = 0;

    docentes.forEach(function (docente) {
        const contenido = docente.textContent.toLowerCase();

        const categorias = (
            docente.dataset.categoria || "materias"
        ).split(" ");

        const coincideTexto = contenido.includes(texto);

        const coincideCategoria =
            categoriaSeleccionada === "todos" ||
            categorias.includes(categoriaSeleccionada);

        const mostrar = coincideTexto && coincideCategoria;

        docente.style.display = mostrar ? "" : "none";

        if (mostrar) visibles++;
    });

    if (contadorDocentes) {
        contadorDocentes.textContent =
            visibles + (visibles === 1
                ? " docente encontrado"
                : " docentes encontrados");
    }

    if (sinDocentes) {
        sinDocentes.style.display = visibles === 0 ? "block" : "none";
    }
}

if (buscador) {
    buscador.addEventListener("input", filtrarDocentes);
}

prepararCategoriasDocentes();
crearFiltrosDocentes();
filtrarDocentes();


// ==========================================
// VISOR DE IMÁGENES
// ==========================================

const visor = document.getElementById("visorImagen");
const imagenGrande = document.getElementById("imagenAmpliada");
const textoImagen = document.getElementById("textoImagen");
const cerrarVisor = document.getElementById("cerrarVisor");

function abrirVisor(imagen) {
    if (!visor || !imagenGrande) return;

    imagenGrande.src = imagen.src;
    imagenGrande.alt = imagen.alt || "Imagen ampliada";

    if (textoImagen) {
        textoImagen.textContent = imagen.alt || "";
    }

    visor.classList.add("open");
    visor.style.display = "flex";
    visor.setAttribute("aria-hidden", "false");

    if (cerrarVisor) cerrarVisor.focus();
}

function cerrarVisorImagen() {
    if (!visor) return;

    visor.classList.remove("open");
    visor.style.display = "none";
    visor.setAttribute("aria-hidden", "true");

    if (imagenGrande) {
        imagenGrande.src = "";
    }
}

const imagenesAmpliables = document.querySelectorAll(
    ".photo-grid img, " +
    ".evento-card img, " +
    ".place-card img, " +
    ".career-card img, " +
    ".club-card img, " +
    ".tarjeta-proyecto img, " +
    ".noticia-card img, " +
    ".intro-layout img, " +
    ".hero-photo img, " +
    ".contact-photo"
);

imagenesAmpliables.forEach(function (imagen) {
    imagen.style.cursor = "zoom-in";

    imagen.addEventListener("click", function () {
        abrirVisor(imagen);
    });
});

if (cerrarVisor) {
    cerrarVisor.addEventListener("click", cerrarVisorImagen);
}

if (visor) {
    visor.addEventListener("click", function (e) {
        if (e.target === visor) {
            cerrarVisorImagen();
        }
    });
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && visor && visor.classList.contains("open")) {
        cerrarVisorImagen();
    }
});


// ==========================================
// VOLVER A LA BIENVENIDA
// ==========================================

const volverBienvenida = document.getElementById("volverBienvenida");

if (volverBienvenida) {
    volverBienvenida.addEventListener("click", function () {
        if (portal) {
            portal.classList.add("hidden");
            portal.style.display = "none";
        }

        if (bienvenida) {
            bienvenida.style.display = "flex";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// ==========================================
// BOTÓN FLOTANTE PARA VOLVER ARRIBA
// ==========================================

let volverArriba = document.getElementById("volverArriba");

if (!volverArriba) {
    volverArriba = document.createElement("button");
    volverArriba.id = "volverArriba";
    volverArriba.type = "button";
    volverArriba.textContent = "↑";
    volverArriba.setAttribute("aria-label", "Volver arriba");
    document.body.appendChild(volverArriba);
}

volverArriba.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

function actualizarBotonArriba() {
    const mostrar =
        window.scrollY > 300 &&
        portal &&
        portal.style.display !== "none";

    volverArriba.classList.toggle("visible", mostrar);
}

window.addEventListener("scroll", actualizarBotonArriba);


// ==========================================
// INICIAR EN LA PANTALLA DE BIENVENIDA
// ==========================================

if (bienvenida && portal) {
    bienvenida.style.display = "flex";
    portal.classList.add("hidden");
    portal.style.display = "none";
}
/* =================================
   ANIMACIÓN DE CONTADORES ITACE
================================= */

document.addEventListener("DOMContentLoaded", function () {

    const contadores = document.querySelectorAll(".contador");

    const iniciarContadores = () => {

        contadores.forEach(contador => {

            const meta = Number(contador.dataset.meta);
            const duracion = 1800;
            const inicio = performance.now();

            function actualizar(tiempoActual) {

                const progreso = Math.min(
                    (tiempoActual - inicio) / duracion,
                    1
                );

                const valor = Math.floor(meta * progreso);

                contador.textContent = valor;

                if (progreso < 1) {
                    requestAnimationFrame(actualizar);
                } else {
                    contador.textContent = meta;
                }
            }

            requestAnimationFrame(actualizar);
        });
    };

    const seccion = document.querySelector("#estadisticas");

    if (seccion) {

        const observador = new IntersectionObserver((entradas) => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {
                    iniciarContadores();
                    observador.disconnect();
                }

            });

        }, {
            threshold: 0.3
        });

        observador.observe(seccion);
    }

});