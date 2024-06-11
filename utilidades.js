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
const verificar = (id) => {
    const input = document.getElementById(id);
    const div = document.getElementById('e-' + id);
    if (!input || !div) return;

    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');

    if (input.value.trim() == '' && id !== 'fecha_ingreso') {
        input.classList.add('is-invalid');
        div.innerHTML = '<span class="badge bg-danger">El campo es obligatorio</span>';
    } else {
        input.classList.add('is-valid');
        div.innerHTML = '';
            if (id !== 'fecha_ingreso') {
                if (id === 'codigo') {
                } else if (id === 'cantidad' || id === 'precio') {
                }
            } else {
                if (input.value.trim() === '') {
                    input.classList.add('is-invalid');
                    div.innerHTML = '<span class="badge bg-danger">La fecha de ingreso es obligatoria</span>';
                } else {
                    const fechaIngreso = new Date(input.value);
                    const ahora = new Date();
                    
                    if (fechaIngreso > ahora) {
                        input.classList.add('is-invalid');
                        div.innerHTML = '<span class="badge bg-danger">La fecha de ingreso no puede ser posterior a la fecha de hoy</span>';
                    }
                }
            }
        }
    }

