// common.js podría tener funciones compartidas, pero no debe declarar `API_URL` nuevamente.
function showView(viewId) {
    const views = document.querySelectorAll('#app > div');
    views.forEach(view => {
        if (view.id === viewId) {
            view.classList.remove('hidden');
        } else {
            view.classList.add('hidden');
        }
    });
}
