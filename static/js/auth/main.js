import { createApp, ref, onMounted } from 'vue';

const app = createApp({
    setup() {
        const currentView = ref('surveys');
        const isAdmin = ref(false); // Esto debería determinarse basado en la autenticación del usuario
        const surveys = ref([]);
        const currentSurvey = ref({
            name: '',
            description: '',
            chapters: []
        });

        // Funciones para manejar encuestas
        const fetchSurveys = async () => {
            // Aquí iría la llamada a la API para obtener las encuestas
            // surveys.value = await fetch('/api/surveys').then(res => res.json())
        };

        const viewSurvey = (id) => {
            // Aquí iría la llamada a la API para obtener los detalles de la encuesta
            // currentSurvey.value = await fetch(`/api/surveys/${id}`).then(res => res.json())
            currentView.value = 'view-survey';
        };

        const editSurvey = (id) => {
            // Similar a viewSurvey, pero cambia la vista a 'edit-survey'
            currentView.value = 'edit-survey';
        };

        const deleteSurvey = async (id) => {
            // Aquí iría la llamada a la API para eliminar la encuesta
            // await fetch(`/api/surveys/${id}`, { method: 'DELETE' })
            await fetchSurveys();
        };

        const saveSurvey = async () => {
            // Aquí iría la llamada a la API para guardar o actualizar la encuesta
            // const method = currentSurvey.value.id ? 'PUT' : 'POST'
            // await fetch('/api/surveys', { method, body: JSON.stringify(currentSurvey.value) })
            currentView.value = 'surveys';
            await fetchSurveys();
        };

        // Funciones para manejar capítulos y preguntas
        const addChapter = () => {
            currentSurvey.value.chapters.push({ title: '', questions: [] });
        };

        const removeChapter = (index) => {
            currentSurvey.value.chapters.splice(index, 1);
        };

        const addQuestion = (chapter) => {
            chapter.questions.push({ text: '', type: 'text', options: [] });
        };

        const removeQuestion = (chapter, index) => {
            chapter.questions.splice(index, 1);
        };

        const addOption = (question) => {
            question.options.push({ text: '' });
        };

        const removeOption = (question, index) => {
            question.options.splice(index, 1);
        };

        const submitSurvey = async () => {
            // Aquí iría la lógica para enviar las respuestas de la encuesta
            alert('Encuesta enviada con éxito');
            currentView.value = 'surveys';
        };

        const logout = (e) => {
            console.log('Logout');
            e.preventDefault();
            console.log('Logout');
            alert('Sesión cerrada');
            localStorage.removeItem('authToken');
            
            window.location.href='../../index.html';
        };

        onMounted(() => {
            fetchSurveys();
        });

        return {
            currentView,
            isAdmin,
            surveys,
            currentSurvey,
            viewSurvey,
            editSurvey,
            deleteSurvey,
            saveSurvey,
            addChapter,
            removeChapter,
            addQuestion,
            removeQuestion,
            addOption,
            removeOption,
            submitSurvey,
            logout
        };
    }
});

app.mount(document.getElementById('app'));

document.getElementById('logout').addEventListener('click', () => console.log('Logout'));
