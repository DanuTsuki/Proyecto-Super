import { getData, getDocumento, remove, save, update, getStorageRef, verificarCodigoUnico } from './firebase.js';

let id = 0;


document.getElementById('btnSave').addEventListener('click', async (event) => {
    event.preventDefault();
    document.querySelectorAll('.form-control').forEach(item => {
        verificar(item.id);
    });

    const categoria = document.getElementById('categoria');
    verificar(categoria.id);
    
    if (document.querySelectorAll('.is-invalid').length == 0) {
        const producto = {
            codigo: document.getElementById('codigo').value,
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
            categoria: document.getElementById('categoria').value,
            precio: document.getElementById('precio').value,
            stock: document.getElementById('stock').value,
            fecha_vencimiento: document.getElementById('fecha_vencimiento').value,
            imagen: document.getElementById('imagen').files[0] || ''
        };

        if (id == 0) {
            // Verificar si el código ya existe antes de guardar
            const codigoDuplicado = await verificarCodigoUnico(producto.codigo);
            if (codigoDuplicado) {
                Swal.fire('Error', 'El código ya está en uso', 'error');
                document.getElementById('codigo').classList.add('is-invalid');
                document.getElementById('e-codigo').innerHTML = '<span class="badge bg-danger">El código ya está en uso</span>';
                return;
            }
            await save(producto);
            Swal.fire('Guardado', '', 'success');
        } else {
            await update(id, producto);
            Swal.fire('Editado', '', 'success');
        }
        id = 0;
        limpiar();
    }
});

async function uploadImage(file) {
    const storageRef = getStorageRef(); 
    const imageName = file.name;
    const imageRef = ref(storageRef, imageName);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef); 
}

window.addEventListener('DOMContentLoaded', () => {
    getData((datos) => {
        let tabla = '';
        datos.forEach((doc) => {
            const producto = doc.data();
            tabla += `<tr>
                <td><img src="${producto.imagenUrl}" alt="${producto.nombre}" style="width:50px;height:50px;"/></td>
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.categoria}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>${producto.fecha_vencimiento}</td>
                <td nowrap>
                    <button class="btn btn-warning" id="${doc.id}">Editar</button>
                    <button class="btn btn-danger" id="${doc.id}">Eliminar</button>
                </td>
            </tr>`;
        });
        document.getElementById('contenido').innerHTML = tabla;

        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => {
                Swal.fire({
                    title: "¿Estás seguro de eliminar el registro?",
                    text: "No podrás revertir los cambios",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Eliminar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        remove(btn.id).then(() => { 
                            Swal.fire("Eliminado!", "Su registro ha sido eliminado", "success"); 
                        }).catch(error => {
                            console.error("Error al eliminar el registro:", error);
                            Swal.fire("Error", "No se pudo eliminar el registro", "error");
                        });
                    }
                });
            });
        });

        document.querySelectorAll('.btn-warning').forEach(btn => {
            btn.addEventListener('click', async () => {
                const doc = await getDocumento(btn.id);
                const producto = doc.data();

                document.getElementById('codigo').value = producto.codigo;
                document.getElementById('nombre').value = producto.nombre;
                document.getElementById('descripcion').value = producto.descripcion;
                document.getElementById('categoria').value = producto.categoria;
                document.getElementById('precio').value = producto.precio;
                document.getElementById('stock').value = producto.stock;
                document.getElementById('fecha_vencimiento').value = producto.fecha_vencimiento;
                document.getElementById('imagen').value = producto.imagen;

                id = doc.id;
                document.getElementById('codigo').readOnly = true;
                document.getElementById('btnSave').value = 'Editar';
            });
        });
    });
});

const limpiar = () => {
    document.querySelector('form').reset()
    document.querySelectorAll('.form-control').forEach(item => {
        item.classList.remove('is-invalid')
        item.classList.remove('is-valid')
        const errorDiv = document.getElementById('e-' + item.id);
        if (errorDiv) {
            errorDiv.innerHTML = '';
        }
    });
    const codigoInput = document.getElementById('codigo');
    if (codigoInput) {
        codigoInput.readOnly = false;
    }
    const btnSave = document.getElementById('btnSave');
    if (btnSave) {
        btnSave.value = 'Guardar';
    }
}

window.verificarCodigoRepetido = async (input) => {
    const codigo = input.value.trim();
    if (codigo === "") {
        input.classList.add('is-invalid');
        document.getElementById('e-codigo').innerHTML = '<span class="badge bg-danger">El campo es obligatorio</span>';
        return;
    }
    
    const codigoDuplicado = await verificarCodigoUnico(codigo);
    if (codigoDuplicado) {
        input.classList.add('is-invalid');
        document.getElementById('e-codigo').innerHTML = '<span class="badge bg-danger">El código ya está en uso</span>';
    } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        document.getElementById('e-codigo').innerHTML = '';
    }
}