// variables globales
let imagenLogo = null;
let certificadosGuardados = [];
let contadorCertificados = parseInt(localStorage.getItem('contadorCertificados')) || 0;

// inicializar base de datos
const iniciarBaseDatos = () => {
    return new Promise((resolve, reject) => {
        const solicitud = indexedDB.open('certificadosDB', 1);
        
        solicitud.onerror = (evento) => {
            console.error('error al abrir base de datos:', evento.target.error);
            reject('no se pudo abrir la base de datos');
        };
        
        solicitud.onupgradeneeded = (evento) => {
            // crear la base de datos si no existe
            const db = evento.target.result;
            if (!db.objectStoreNames.contains('certificados')) {
                db.createObjectStore('certificados', { keyPath: 'id' });
                console.log('base de datos creada');
            }
        };
        
        solicitud.onsuccess = (evento) => {
            const db = evento.target.result;
            resolve(db);
        };
    });
};

// cuando se carga la pagina
document.addEventListener('DOMContentLoaded', () => {
    // inicializar la base de datos
    iniciarBaseDatos()
        .then(() => {
            console.log('base de datos inicializada');
            cargarHistorial();
        })
        .catch(error => console.error(error));
    
    // evento para el formulario
    document.getElementById('formularioCertificado').addEventListener('submit', (e) => {
        e.preventDefault();
        generarCertificado();
    });
    
    // evento para ver historial
    document.getElementById('btnVerHistorial').addEventListener('click', () => {
        const historialContainer = document.getElementById('historialContainer');
        if (historialContainer.style.display === 'none') {
            historialContainer.style.display = 'block';
            cargarHistorial();
        } else {
            historialContainer.style.display = 'none';
        }
    });
    
    // evento para descargar pdf
    document.getElementById('btnDescargarPDF').addEventListener('click', () => {
        descargarPDF();
    });
    
    // evento para guardar certificado
    document.getElementById('btnGuardar').addEventListener('click', () => {
        guardarCertificado();
    });
    
    // evento para buscar certificados
    document.getElementById('buscarCertificado').addEventListener('input', (e) => {
        const textoBusqueda = e.target.value.toLowerCase();
        filtrarCertificados(textoBusqueda);
    });
    
    // evento para cargar logo
    document.getElementById('logoEscuela').addEventListener('change', (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            const lector = new FileReader();
            lector.onload = (e) => {
                imagenLogo = e.target.result;
            };
            lector.readAsDataURL(archivo);
        } else {
            imagenLogo = null;
        }
    });
});

// funcion para generar el certificado
const generarCertificado = () => {
    // mostrar spinner
    document.getElementById('cargandoSpinner').style.display = 'block';
    
    // obtener datos del formulario
    const nombreEvento = document.getElementById('nombreEvento').value;
    const fechaEvento = formatearFecha(document.getElementById('fechaEvento').value);
    const lugarEvento = document.getElementById('lugarEvento').value;
    const nombreParticipante = document.getElementById('nombreParticipante').value;
    const rolParticipante = document.getElementById('rolParticipante').value;
    const duracionEvento = document.getElementById('duracionEvento').value;
    
    // crear texto segun el rol
    let textoRol = '';
    switch(rolParticipante) {
        case 'Jugador':
            textoRol = `participó como JUGADOR`;
            break;
        case 'Arbitro':
            textoRol = `participó como ÁRBITRO`;
            break;
        case 'Entrenador':
            textoRol = `participó como ENTRENADOR`;
            break;
        case 'Organizador':
            textoRol = `fue ORGANIZADOR`;
            break;
        default:
            textoRol = `participó`;
    }
    
    // crear contenido del certificado
    const contenidoCertificado = `
        <div class="certificado-fondo">
            <div class="certificado-titulo">
                CERTIFICADO DE PARTICIPACIÓN
            </div>
            <div class="certificado-contenido">
                <p>Se certifica que <strong>${nombreParticipante}</strong> ${textoRol} en el evento deportivo <strong>"${nombreEvento}"</strong> realizado el día ${fechaEvento} en ${lugarEvento}, con una duración de ${duracionEvento} horas.</p>
            </div>
            <div class="certificado-firma">
                <p>______________________</p>
                <p>Firma del Organizador</p>
            </div>
            <div class="certificado-footer">
                <p>Certificado #${contadorCertificados + 1} - Fecha de emisión: ${formatearFecha(new Date().toISOString().split('T')[0])}</p>
            </div>
        </div>
    `;
    
    // si hay logo, agregarlo al certificado
    if (imagenLogo) {
        setTimeout(() => {
            const certificadoElement = document.querySelector('.certificado-fondo');
            const logoElement = document.createElement('img');
            logoElement.src = imagenLogo;
            logoElement.className = 'certificado-logo';
            certificadoElement.appendChild(logoElement);
        }, 100);
    }
    
    // mostrar vista previa
    setTimeout(() => {
        document.getElementById('cargandoSpinner').style.display = 'none';
        document.getElementById('vistaPreviaContainer').style.display = 'block';
        document.getElementById('vistaPreviaContenido').innerHTML = contenidoCertificado;
    }, 1000);
};

// formatear fecha de YYYY-MM-DD a DD/MM/YYYY
const formatearFecha = (fechaStr) => {
    const partes = fechaStr.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return fechaStr;
};

// descargar el certificado como pdf
const descargarPDF = () => {
    // mostrar spinner
    document.getElementById('cargandoSpinner').style.display = 'block';
    
    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape', 'mm', 'a4');
            
            // datos para el certificado
            const nombreEvento = document.getElementById('nombreEvento').value;
            const fechaEvento = formatearFecha(document.getElementById('fechaEvento').value);
            const lugarEvento = document.getElementById('lugarEvento').value;
            const nombreParticipante = document.getElementById('nombreParticipante').value;
            const rolParticipante = document.getElementById('rolParticipante').value;
            const duracionEvento = document.getElementById('duracionEvento').value;
            
            // crear texto segun el rol
            let textoRol = '';
            switch(rolParticipante) {
                case 'Jugador':
                    textoRol = `participó como JUGADOR`;
                    break;
                case 'Arbitro':
                    textoRol = `participó como ÁRBITRO`;
                    break;
                case 'Entrenador':
                    textoRol = `participó como ENTRENADOR`;
                    break;
                case 'Organizador':
                    textoRol = `fue ORGANIZADOR`;
                    break;
                default:
                    textoRol = `participó`;
            }
            
            // configuracion del pdf
            doc.setFontSize(25);
            doc.setTextColor(13, 110, 253); // color azul de bootstrap
            doc.text('CERTIFICADO DE PARTICIPACIÓN', 150, 30, { align: 'center' });
            
            // contenido del certificado
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text(`Se certifica que ${nombreParticipante} ${textoRol} en el evento deportivo`, 150, 60, { align: 'center' });
            doc.text(`"${nombreEvento}" realizado el día ${fechaEvento} en ${lugarEvento},`, 150, 70, { align: 'center' });
            doc.text(`con una duración de ${duracionEvento} horas.`, 150, 80, { align: 'center' });
            
            // firma
            doc.setFontSize(12);
            doc.text('______________________', 150, 120, { align: 'center' });
            doc.text('Firma del Organizador', 150, 130, { align: 'center' });
            
            // footer
            doc.setFontSize(10);
            doc.setTextColor(108, 117, 125); // color gris de bootstrap
            doc.text(`Certificado #${contadorCertificados + 1} - Fecha de emisión: ${formatearFecha(new Date().toISOString().split('T')[0])}`, 150, 150, { align: 'center' });
            
            // borde
            doc.setDrawColor(13, 110, 253); // color azul de bootstrap
            doc.setLineWidth(0.5);
            doc.rect(10, 10, 277, 190);
            
            // logo si existe
            if (imagenLogo) {
                doc.addImage(imagenLogo, 'PNG', 240, 20, 40, 40);
            }
            
            // descargar pdf
            doc.save(`Certificado_${nombreParticipante}_${nombreEvento}.pdf`);
            
            // ocultar spinner
            document.getElementById('cargandoSpinner').style.display = 'none';
        } catch (error) {
            console.error('error al generar pdf:', error);
            alert('hubo un problema al generar el pdf');
            document.getElementById('cargandoSpinner').style.display = 'none';
        }
    }, 1000);
};

// guardar certificado en indexedDB
const guardarCertificado = () => {
    // mostrar spinner
    document.getElementById('cargandoSpinner').style.display = 'block';
    
    // obtener datos del formulario
    const nombreEvento = document.getElementById('nombreEvento').value;
    const fechaEvento = document.getElementById('fechaEvento').value;
    const lugarEvento = document.getElementById('lugarEvento').value;
    const nombreParticipante = document.getElementById('nombreParticipante').value;
    const rolParticipante = document.getElementById('rolParticipante').value;
    const duracionEvento = document.getElementById('duracionEvento').value;
    
    // incrementar contador
    contadorCertificados++;
    localStorage.setItem('contadorCertificados', contadorCertificados);
    
    // datos del certificado
    const certificado = {
        id: Date.now(),
        nombre: nombreParticipante,
        evento: nombreEvento,
        fecha: fechaEvento,
        lugar: lugarEvento,
        rol: rolParticipante,
        duracion: duracionEvento,
        numeroCertificado: contadorCertificados,
        fechaEmision: new Date().toISOString().split('T')[0],
        logo: imagenLogo
    };
    
    // guardar en indexedDB
    iniciarBaseDatos()
        .then(db => {
            return new Promise((resolve, reject) => {
                const transaccion = db.transaction(['certificados'], 'readwrite');
                const almacen = transaccion.objectStore('certificados');
                const solicitud = almacen.add(certificado);
                
                solicitud.onsuccess = () => {
                    resolve();
                };
                
                solicitud.onerror = (evento) => {
                    console.error('error al guardar certificado:', evento.target.error);
                    reject('no se pudo guardar el certificado');
                };
            });
        })
        .then(() => {
            // actualizar historial
            cargarHistorial();
            
            // ocultar spinner
            document.getElementById('cargandoSpinner').style.display = 'none';
            
            // mostrar mensaje
            alert('certificado guardado exitosamente');
        })
        .catch(error => {
            console.error(error);
            document.getElementById('cargandoSpinner').style.display = 'none';
            alert('hubo un problema al guardar el certificado');
        });
};

// cargar historial de certificados
const cargarHistorial = () => {
    iniciarBaseDatos()
        .then(db => {
            return new Promise((resolve, reject) => {
                const transaccion = db.transaction(['certificados'], 'readonly');
                const almacen = transaccion.objectStore('certificados');
                const solicitud = almacen.getAll();
                
                solicitud.onsuccess = (evento) => {
                    certificadosGuardados = evento.target.result;
                    resolve(certificadosGuardados);
                };
                
                solicitud.onerror = (evento) => {
                    console.error('error al cargar certificados:', evento.target.error);
                    reject('no se pudieron cargar los certificados');
                };
            });
        })
        .then(certificados => {
            // actualizar lista en pantalla
            mostrarCertificados(certificados);
        })
        .catch(error => console.error(error));
};

// mostrar certificados en la lista
const mostrarCertificados = (certificados) => {
    const listaCertificados = document.getElementById('listaCertificados');
    listaCertificados.innerHTML = '';
    
    if (certificados.length === 0) {
        listaCertificados.innerHTML = '<p class="text-center">no hay certificados guardados</p>';
        return;
    }
    
    certificados.forEach(cert => {
        const elemento = document.createElement('a');
        elemento.className = 'list-group-item list-group-item-action';
        elemento.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${cert.nombre}</h5>
                <small>Certificado #${cert.numeroCertificado}</small>
            </div>
            <p class="mb-1">${cert.evento} - ${formatearFecha(cert.fecha)}</p>
            <small>Rol: ${cert.rol}</small>
            <div class="mt-2">
                <button class="btn btn-sm btn-primary btnVerCertificado" data-id="${cert.id}">ver</button>
                <button class="btn btn-sm btn-danger btnEliminarCertificado" data-id="${cert.id}">eliminar</button>
            </div>
        `;
        listaCertificados.appendChild(elemento);
    });
    
    // agregar eventos para botones
    document.querySelectorAll('.btnVerCertificado').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            verCertificado(id);
        });
    });
    
    document.querySelectorAll('.btnEliminarCertificado').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            eliminarCertificado(id);
        });
    });
};

// ver certificado guardado
const verCertificado = (id) => {
    const certificado = certificadosGuardados.find(cert => cert.id === id);
    if (!certificado) return;
    
    // actualizar datos en el formulario
    document.getElementById('nombreEvento').value = certificado.evento;
    document.getElementById('fechaEvento').value = certificado.fecha;
    document.getElementById('lugarEvento').value = certificado.lugar;
    document.getElementById('nombreParticipante').value = certificado.nombre;
    document.getElementById('rolParticipante').value = certificado.rol;
    document.getElementById('duracionEvento').value = certificado.duracion;
    
    // actualizar logo
    imagenLogo = certificado.logo;
    
    // generar vista previa
    generarCertificado();
    
    // desplazar hacia arriba
    window.scrollTo(0, 0);
};

// eliminar certificado
const eliminarCertificado = (id) => {
    if (!confirm('¿estas seguro de eliminar este certificado?')) return;
    
    iniciarBaseDatos()
        .then(db => {
            return new Promise((resolve, reject) => {
                const transaccion = db.transaction(['certificados'], 'readwrite');
                const almacen = transaccion.objectStore('certificados');
                const solicitud = almacen.delete(id);
                
                solicitud.onsuccess = () => {
                    resolve();
                };
                
                solicitud.onerror = (evento) => {
                    console.error('error al eliminar certificado:', evento.target.error);
                    reject('no se pudo eliminar el certificado');
                };
            });
        })
        .then(() => {
            // actualizar historial
            cargarHistorial();
            
            // mostrar mensaje
            alert('certificado eliminado exitosamente');
        })
        .catch(error => {
            console.error(error);
            alert('hubo un problema al eliminar el certificado');
        });
};

// filtrar certificados
const filtrarCertificados = (texto) => {
    if (!texto) {
        mostrarCertificados(certificadosGuardados);
        return;
    }
    
    const certificadosFiltrados = certificadosGuardados.filter(cert => 
        cert.nombre.toLowerCase().includes(texto) ||
        cert.evento.toLowerCase().includes(texto) ||
        cert.rol.toLowerCase().includes(texto)
    );
    
    mostrarCertificados(certificadosFiltrados);
};