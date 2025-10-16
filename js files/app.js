// Links data storage (array to maintain order)
const links = [
    // { name: 'GitHub', url: 'https://github.com/username' },
    // { name: 'LinkedIn', url: 'https://linkedin.com/in/username' },
    // { name: 'Portfolio', url: 'https://yourwebsite.com' },
    // { name: 'Twitter', url: 'https://twitter.com/username' }
];

// Get container reference
const linksContainer = document.getElementById('links-container');

// Drag and drop state
let draggedItem = null;

/**
 * Create a link card element
 */
function createLinkCard(name, url, index) {
    const logoHTML = createLogoHTML(name, url, 'size-10');
    
    return `
        <div 
            class="flex items-center gap-4 bg-card-light dark:bg-card-dark p-4 rounded-lg border border-border-light dark:border-border-dark hover:shadow-lg transition-all duration-300 link-item cursor-move" 
            data-link-index="${index}"
            draggable="true"
            ondragstart="handleDragStart(event)"
            ondragend="handleDragEnd(event)"
            ondragover="handleDragOver(event)"
            ondrop="handleDrop(event)"
            ondragenter="handleDragEnter(event)"
            ondragleave="handleDragLeave(event)"
        >
            <div class="text-text-secondary-light dark:text-text-secondary-dark cursor-move">
                <span class="material-symbols-outlined text-3xl">drag_indicator</span>
            </div>
            ${logoHTML}
            <div class="flex-grow">
                <p class="font-medium text-base text-text-light dark:text-text-dark">
                    ${name}
                </p>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark break-all">
                    ${url}
                </p>
            </div>
            <div class="flex items-center gap-1">
                <button
                    onclick="editLink(${index}); event.stopPropagation();"
                    class="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark flex size-9 items-center justify-center transition-colors rounded-full hover:bg-border-light dark:hover:bg-border-dark"
                    title="Edit link"
                >
                    <span class="material-symbols-outlined text-xl">edit</span>
                </button>
                <button
                    onclick="deleteLink(${index}); event.stopPropagation();"
                    class="text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-400 flex size-9 items-center justify-center transition-colors rounded-full hover:bg-border-light dark:hover:bg-border-dark"
                    title="Delete link"
                >
                    <span class="material-symbols-outlined text-xl">delete</span>
                </button>
            </div>
        </div>
    `;
}

/**
 * Render all links to the container
 */
function renderLinks() {
    if (!linksContainer) return;
    
    linksContainer.innerHTML = '';
    const emptyState = document.getElementById('empty-state');
    
    // Check if there are any links
    if (links.length === 0) {
        // Show empty state
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        // Hide empty state and show links
        if (emptyState) emptyState.classList.add('hidden');
        
        links.forEach((link, index) => {
            linksContainer.innerHTML += createLinkCard(link.name, link.url, index);
        });
    }
}

/**
 * Drag and Drop Event Handlers
 */
function handleDragStart(e) {
    draggedItem = parseInt(e.target.getAttribute('data-link-index'));
    e.target.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    
    // Remove all drag-over styles
    document.querySelectorAll('.link-item').forEach(item => {
        item.classList.remove('border-primary-light', 'dark:border-primary-dark', 'scale-105');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    const target = e.target.closest('.link-item');
    if (target && target.getAttribute('data-link-index') !== null) {
        target.classList.add('border-primary-light', 'dark:border-primary-dark', 'scale-105');
    }
}

function handleDragLeave(e) {
    const target = e.target.closest('.link-item');
    if (target) {
        target.classList.remove('border-primary-light', 'dark:border-primary-dark', 'scale-105');
    }
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    const dropIndex = parseInt(e.target.closest('.link-item').getAttribute('data-link-index'));
    
    if (draggedItem !== dropIndex) {
        // Remove the dragged item from its position
        const draggedLink = links.splice(draggedItem, 1)[0];
        // Insert it at the new position
        links.splice(dropIndex, 0, draggedLink);
        
        // Re-render
        renderLinks();
        
        notify.success('Link order updated!');
    }
    
    return false;
}

/**
 * Open the Add Link modal
 */
function openAddLinkModal() {
    const modal = document.getElementById('add-link-modal');
    const form = document.getElementById('add-link-form');
    
    // Reset form
    form.reset();
    document.getElementById('modal-title').textContent = 'Add New Link';
    document.getElementById('link-name').value = '';
    document.getElementById('link-url').value = '';
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => document.getElementById('link-name').focus(), 100);
}

/**
 * Close the Add Link modal
 */
function closeAddLinkModal() {
    const modal = document.getElementById('add-link-modal');
    const form = document.getElementById('add-link-form');
    
    // Re-enable name field if it was disabled during edit
    document.getElementById('link-name').disabled = false;
    
    // Clear editing flag
    if (form.dataset.editingLinkIndex) {
        delete form.dataset.editingLinkIndex;
    }
    
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

/**
 * Add a new link
 */
function addLink(name, url) {
    // Validate inputs
    if (!name || !url) {
        notify.error('Please provide both name and URL');
        return;
    }
    
    // Check if link already exists
    const exists = links.some(link => link.name === name);
    if (exists) {
        notify.warning('A link with this name already exists');
        return;
    }
    
    // Add to links array
    links.push({ name, url });
    
    // Re-render links
    renderLinks();
    
    // Close modal
    closeAddLinkModal();
    
    // Show success notification
    notify.success(`Link "${name}" added successfully!`);
}

/**
 * Edit existing link
 */
function editLink(index) {
    const modal = document.getElementById('add-link-modal');
    const form = document.getElementById('add-link-form');
    const link = links[index];
    
    // Populate form with existing data
    document.getElementById('modal-title').textContent = 'Edit Link';
    document.getElementById('link-name').value = link.name;
    document.getElementById('link-url').value = link.url;
    document.getElementById('link-name').disabled = true; // Prevent changing name
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Store original index for update
    form.dataset.editingLinkIndex = index;
}

/**
 * Delete a link
 */
function deleteLink(index) {
    const link = links[index];
    
    showConfirmDialog(
        `This action cannot be undone. The link "${link.name}" will be permanently removed.`,
        'Delete Link?',
        () => {
            // On confirm
            links.splice(index, 1);
            renderLinks();
            notify.success(`Link "${link.name}" deleted successfully!`);
        },
        () => {
            // On cancel - do nothing
        }
    );
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = document.getElementById('link-name').value.trim();
    const url = document.getElementById('link-url').value.trim();
    
    if (form.dataset.editingLinkIndex !== undefined) {
        // Update existing link
        const index = parseInt(form.dataset.editingLinkIndex);
        links[index].url = url;
        
        // Re-enable name field
        document.getElementById('link-name').disabled = false;
        delete form.dataset.editingLinkIndex;
        
        renderLinks();
        closeAddLinkModal();
        notify.success(`Link "${name}" updated successfully!`);
    } else {
        // Add new link
        addLink(name, url);
        return; // addLink handles modal closing and notification
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderLinks();
    
    // Setup form submission
    const form = document.getElementById('add-link-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Close modal on backdrop click
    const modal = document.getElementById('add-link-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAddLinkModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAddLinkModal();
        }
    });
});