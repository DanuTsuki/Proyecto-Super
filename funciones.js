import { getData, getDocumento, remove, save, update } from './firebase.js';
let id = 0;

document.getElementById('btnSave').addEventListener('click', async (event) => {
    event.preventDefault();
    document.querySelectorAll('.form-control').forEach(item => {
        verificar(item.id);
    });
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
            await save(producto);
            Swal.fire('Guardado', '', 'success');
        } else {
            await update(id, producto);
        }
        id = 0;
        limpiar();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    getData((datos) => {
        let tabla = '';
        datos.forEach((doc) => {
            const producto = doc.data();
            tabla += `<tr>
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.categoria}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>${producto.fecha_vencimiento}</td>
                <td><img src="${producto.imagenUrl}" alt="${producto.nombre}" style="width:50px;height:50px;"/></td>
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
                        remove(btn.id);
                        Swal.fire("Eliminado!", "Su registro ha sido eliminado", "success");
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

                id = doc.id;
                document.getElementById('codigo').readOnly = true;
                document.getElementById('btnSave').value = 'Editar';
            });
        });
    });
});
