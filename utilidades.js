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

    if (input.value.trim() == '' && id !== 'fecha_vencimiento') { // Cambia 'fecha_ingreso' por 'fecha_vencimiento'
        input.classList.add('is-invalid');
        div.innerHTML = '<span class="badge bg-danger">El campo es obligatorio</span>';
    } else {
        if (id !== 'fecha_vencimiento') { // Cambia 'fecha_ingreso' por 'fecha_vencimiento'
            input.classList.add('is-valid');
            div.innerHTML = '';
        } else {
            if (input.value.trim() === '') {
                input.classList.add('is-invalid');
                div.innerHTML = '<span class="badge bg-danger">La fecha de vencimiento es obligatoria</span>';
            } else {
                const fechaVencimiento = new Date(input.value);
                const ahora = new Date();
                ahora.setHours(0, 0, 0, 0); // Establece la hora actual a las 00:00:00 para que solo se compare la fecha
                
                if (fechaVencimiento < ahora) {
                    input.classList.add('is-invalid');
                    div.innerHTML = '<span class="badge bg-danger">La fecha de vencimiento no puede ser una fecha pasada</span>';
                } else {
                    input.classList.add('is-valid');
                    div.innerHTML = '';
                }
            }
        }
    }
}