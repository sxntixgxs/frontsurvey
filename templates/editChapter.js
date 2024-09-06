document.addEventListener('DOMContentLoaded', function() {
    window.toggleEditChapter = function(surveyId, chapterId) {
        const formContainer = document.getElementById(`update-form-${surveyId}`);

        // Check if the form is already visible
        if (formContainer && !formContainer.classList.contains('hidden')) {
            // Hide the form if it is already shown
            formContainer.classList.add('hidden');
            formContainer.innerHTML = ''; // Clear the form content
            return;
        }

        // Fetch chapter details if the form is not visible
        if (formContainer) {
            fetch(`http://localhost:8080/api/chapters/${chapterId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(chapter => {
                formContainer.innerHTML = `
                    <div class="bg-gray-800 p-4 rounded-md shadow-lg border border-gray-700 mt-4">
                        <h3 class="text-lg font-semibold text-white mb-4">Edit Chapter</h3>
                        <form id="edit-chapter-form" class="space-y-4">
                            <div>
                                <label for="chapter-number" class="block text-sm font-medium text-gray-300">Chapter Number:</label>
                                <input type="text" id="chapter-number" name="chapter_number" value="" required
                                    class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon_violet focus:border-transparent">
                            </div>
                            <div>
                                <label for="chapter-title" class="block text-sm font-medium text-gray-300">Chapter Title:</label>
                                <input type="text" id="chapter-title" name="chapter_title" value="" required
                                    class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon_violet focus:border-transparent">
                            </div>
                            <div>
                                <label for="chapter-date" class="block text-sm font-medium text-gray-300">Date:</label>
                                <input type="text" id="chapter-date" name="created_at" value="2024-09-06T13:13:23.000+00:00" required
                                    class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon_violet focus:border-transparent">
                            </div>
                            <button type="submit" class="w-full bg-neon_violet hover:bg-lime_green text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime_green">
                                Save Changes
                            </button>
                        </form>
                    </div>
                `;
                formContainer.classList.remove('hidden');

                document.getElementById('edit-chapter-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const updatedChapter = {
                        chapter_number: document.getElementById('chapter-number').value,
                        chapter_title: document.getElementById('chapter-title').value,
                        created_at: new Date(document.getElementById('chapter-date').value).toISOString()
                    };
                    fetch(`http://localhost:8080/api/chapters/${surveyId}/${chapterId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(updatedChapter)
                    })
                    .then(response => {
                        if (response.ok) {
                            alert('Chapter updated successfully');
                            formContainer.classList.add('hidden');
                            window.location.reload();
                        } else {
                            alert('Failed to update chapter');
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching chapter data:', error);
                formContainer.innerHTML = '<p class="text-red-500">Error loading chapter data. Please try again.</p>';
            });
        }
    };
});
