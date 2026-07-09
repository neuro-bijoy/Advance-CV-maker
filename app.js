/* ==========================================================================
   CRAFTCV APPLICATION LOGIC (VANILLA JS)
   ========================================================================== */

// --- Global Application State ---
let cvState = {
    selectedTemplate: 'classic-executive',
    photo: '',
    fullName: '',
    jobTitle: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    linkedin: '',
    github: '',
    portfolio: '',
    careerSummary: '',
    techSkills: [],
    softSkills: [],
    education: [],
    work: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    hobbies: []
};

// Current Zoom Scale for Preview Page
let previewZoom = 1.0;

// --- Demo Data / Quick Start Data ---
const demoData = {
    selectedTemplate: 'classic-executive',
    photo: '', // will be set to placeholder or left empty
    fullName: 'Riya Sharma',
    jobTitle: 'Computer Science Graduate',
    phone: '+91-98765432XX',
    email: 'riya.sharma@email.com',
    address: 'Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    linkedin: 'linkedin.com/in/riyasharma',
    github: 'github.com/riyasharma',
    portfolio: 'riyasharma.dev',
    careerSummary: 'Motivated Computer Science graduate eager to apply programming and analytical skills in a dynamic organization to contribute to impactful projects.',
    techSkills: ['Programming: Python, Java, C++', 'Data Analysis: Excel, SQL, Power BI', 'Frontend: HTML, CSS, JavaScript'],
    softSkills: ['Communication & Teamwork', 'Problem-Solving & Critical Thinking', 'Time Management'],
    education: [
        {
            degree: 'B.Tech in Computer Science',
            institution: 'XYZ University',
            board: 'University Board',
            year: '2024',
            score: 'CGPA: 8.5/10'
        }
    ],
    work: [
        {
            title: 'Technical Intern',
            company: 'TechSolutions Pvt Ltd',
            location: 'New Delhi',
            duration: 'June 2023 - August 2023',
            desc: 'Assisted in developing client-side web components.\nCollaborated on database query optimization tasks, reducing load times by 15%.\nParticipated in daily agile stand-ups and code reviews.'
        }
    ],
    projects: [
        {
            name: 'Library Management System (Java)',
            tech: 'Java, Swing, MySQL',
            desc: 'Developed a desktop application for student records management.\nImplemented user authentication, book issue/return tracking, and search functionalities.',
            github: 'github.com/riyasharma/library-system',
            demo: ''
        },
        {
            name: 'Data Visualization Dashboard',
            tech: 'Power BI, Excel',
            desc: 'Built an interactive dashboard to analyze student performance metrics.\nCreated charts for grade trends, attendance, and graduation rates.',
            github: '',
            demo: 'dashboards.riyasharma.dev'
        }
    ],
    certifications: [
        'Google Data Analytics Professional Certificate',
        'Advanced Excel (Microsoft)'
    ],
    achievements: [
        'Secured 1st Place in College Hackathon (2023)',
        'Class Representative for the CSE Department'
    ],
    languages: [
        'English (Fluent)',
        'Hindi (Fluent)'
    ],
    hobbies: [
        'Coding & Open Source contribution',
        'Reading Tech Blogs',
        'Playing Chess'
    ]
};

// ==========================================================================
// DOM CONTENT LOADED INITIALIZER
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// ==========================================================================
// SCROLL FIX: Directly set editor panel height via JS — bypasses all CSS
// height-chain inheritance issues with flex/grid/overflow combinations.
// ==========================================================================
function fixEditorScrollHeight() {
    const header = document.querySelector('.app-header');
    const editorHeader = document.querySelector('.editor-header');
    const editorForm = document.querySelector('.editor-form');
    const previewToolbar = document.querySelector('.preview-toolbar');
    const downloaderBar = document.querySelector('.downloader-bar');
    const previewScrollContainer = document.querySelector('.preview-scroll-container');

    if (!editorForm) return;

    const headerH = header ? header.offsetHeight : 70;
    const editorHeaderH = editorHeader ? editorHeader.offsetHeight : 60;
    const availableH = window.innerHeight - headerH;

    // Directly force the form height so it scrolls regardless of CSS chain
    editorForm.style.height = (availableH - editorHeaderH) + 'px';
    editorForm.style.maxHeight = (availableH - editorHeaderH) + 'px';
    editorForm.style.overflowY = 'scroll';
    editorForm.style.overflowX = 'hidden';

    // Also fix preview scroll container
    if (previewScrollContainer && previewToolbar && downloaderBar) {
        const used = previewToolbar.offsetHeight + downloaderBar.offsetHeight;
        previewScrollContainer.style.height = (availableH - used) + 'px';
        previewScrollContainer.style.maxHeight = (availableH - used) + 'px';
        previewScrollContainer.style.overflowY = 'auto';
    }
}

function initApp() {
    setupViewNavigation();
    setupThemeToggle();
    setupPhotoHandler();
    setupAccordion();
    setupDynamicFields();
    setupInputListeners();
    setupZoomControls();
    setupExportHandlers();

    // Apply scroll fix immediately and on every resize
    fixEditorScrollHeight();
    window.addEventListener('resize', fixEditorScrollHeight);
    
    // Load from LocalStorage or show Landing Page
    const savedData = localStorage.getItem('craftcv_data');
    if (savedData) {
        try {
            cvState = JSON.parse(savedData);
            populateFormFromState();
            updatePreview();
        } catch (e) {
            console.error('Error loading saved data', e);
        }
    } else {
        // Render initial blank state
        updatePreview();
    }
}

// ==========================================================================
// VIEW SWITCHING & NAVIGATION
// ==========================================================================
function setupViewNavigation() {
    const btnHome = document.getElementById('nav-btn-home');
    const btnEditor = document.getElementById('nav-btn-editor');
    const logoHome = document.getElementById('logo-home');
    
    const viewHome = document.getElementById('view-home');
    const viewEditor = document.getElementById('view-editor');
    
    const switchToHome = () => {
        btnHome.classList.add('active');
        btnEditor.classList.remove('active');
        viewHome.classList.add('active-view');
        viewEditor.classList.remove('active-view');
        document.querySelector('.app-footer').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const switchToEditor = () => {
        btnHome.classList.remove('active');
        btnEditor.classList.add('active');
        viewHome.classList.remove('active-view');
        viewEditor.classList.add('active-view');
        document.querySelector('.app-footer').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Recalculate zoom fitting
        fitZoomToContainer();
        // SCROLL FIX: Recalculate editor/preview panel heights after view switch
        setTimeout(fixEditorScrollHeight, 50);
    };

    btnHome.addEventListener('click', switchToHome);
    logoHome.addEventListener('click', switchToHome);
    btnEditor.addEventListener('click', switchToEditor);
    
    // Quick Start & Template Selection buttons
    document.getElementById('btn-quick-start').addEventListener('click', () => {
        loadDemoData();
        switchToEditor();
    });

    // Template Cards Click Events
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        const btnUse = card.querySelector('.btn-use-template');
        const templateId = card.getAttribute('data-template');
        
        const selectTemplateAndGo = () => {
            cvState.selectedTemplate = templateId;
            document.getElementById('template-select').value = templateId;
            saveStateToLocalStorage();
            updatePreview();
            switchToEditor();
        };

        btnUse.addEventListener('click', (e) => {
            e.stopPropagation();
            selectTemplateAndGo();
        });
        card.addEventListener('click', selectTemplateAndGo);
    });

    // Form select element for template switching in preview panel
    const templateSelect = document.getElementById('template-select');
    templateSelect.addEventListener('change', (e) => {
        cvState.selectedTemplate = e.target.value;
        saveStateToLocalStorage();
        updatePreview();
    });
}

// ==========================================================================
// ACCORDION TOGGLES
// ==========================================================================
function setupAccordion() {
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const arrow = item.querySelector('.arrow-icon');
        
        header.addEventListener('click', () => {
            const isExpanded = item.classList.contains('expanded');
            
            // Collapse all others (optional, but clean)
            accordions.forEach(acc => {
                acc.classList.remove('expanded');
                const accArrow = acc.querySelector('.arrow-icon');
                if (accArrow) {
                    accArrow.className = 'fa-solid fa-chevron-down arrow-icon';
                }
            });
            
            if (!isExpanded) {
                item.classList.add('expanded');
                arrow.className = 'fa-solid fa-chevron-up arrow-icon';
            } else {
                item.classList.remove('expanded');
                arrow.className = 'fa-solid fa-chevron-down arrow-icon';
            }
        });
    });
}

// ==========================================================================
// DARK/LIGHT THEME CONTROLLER
// ==========================================================================
function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('craftcv_theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('craftcv_theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// ==========================================================================
// PROFILE PHOTO HANDLER (Base64)
// ==========================================================================
function setupPhotoHandler() {
    const photoInput = document.getElementById('profile-photo');
    const previewImg = document.getElementById('photo-preview-img');
    const placeholderIcon = document.getElementById('photo-placeholder-icon');
    const removeBtn = document.getElementById('btn-remove-photo');
    
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('File is too large. Maximum size is 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Data = event.target.result;
            cvState.photo = base64Data;
            
            // Update form elements
            previewImg.src = base64Data;
            previewImg.classList.remove('hidden');
            placeholderIcon.classList.add('hidden');
            removeBtn.classList.remove('hidden');
            
            saveStateToLocalStorage();
            updatePreview();
        };
        reader.readAsDataURL(file);
    });
    
    removeBtn.addEventListener('click', () => {
        cvState.photo = '';
        photoInput.value = '';
        
        previewImg.src = '';
        previewImg.classList.add('hidden');
        placeholderIcon.classList.remove('hidden');
        removeBtn.classList.add('hidden');
        
        saveStateToLocalStorage();
        updatePreview();
    });
}

// ==========================================================================
// ZOOM ENGINE
// ==========================================================================
function setupZoomControls() {
    const wrapper = document.querySelector('.cv-scale-wrapper');
    const zoomVal = document.getElementById('zoom-percentage');
    
    const setZoom = (zoom) => {
        previewZoom = Math.max(0.4, Math.min(1.5, zoom));
        wrapper.style.transform = `scale(${previewZoom})`;
        zoomVal.innerText = `${Math.round(previewZoom * 100)}%`;
        
        // Correct height of container to avoid overflow blank spaces
        const container = document.querySelector('.preview-scroll-container');
        const docHeight = 1123 * previewZoom;
        wrapper.parentElement.style.height = `${docHeight + 80}px`;
    };
    
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
        setZoom(previewZoom + 0.1);
    });
    
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        setZoom(previewZoom - 0.1);
    });
    
    document.getElementById('btn-zoom-reset').addEventListener('click', () => {
        setZoom(1.0);
    });
    
    window.addEventListener('resize', fitZoomToContainer);
}

function fitZoomToContainer() {
    const container = document.querySelector('.preview-scroll-container');
    if (!container || container.clientWidth === 0) return;
    
    // Fit to container width if container is smaller than A4 (794px) plus padding
    const padding = 40;
    const targetWidth = container.clientWidth - padding;
    
    if (targetWidth < 794) {
        const scale = targetWidth / 794;
        previewZoom = Math.max(0.4, scale);
    } else {
        previewZoom = 1.0;
    }
    
    const wrapper = document.querySelector('.cv-scale-wrapper');
    const zoomVal = document.getElementById('zoom-percentage');
    if (wrapper && zoomVal) {
        wrapper.style.transform = `scale(${previewZoom})`;
        zoomVal.innerText = `${Math.round(previewZoom * 100)}%`;
        wrapper.parentElement.style.height = `${(1123 * previewZoom) + 80}px`;
    }
}

// ==========================================================================
// DYNAMIC FIELDS MANAGEMENT
// ==========================================================================
function setupDynamicFields() {
    // Simple Badge Lists
    setupSimpleList('tech-skills-list', 'btn-add-tech-skill', 'techSkills', 'Python, Java, etc.');
    setupSimpleList('soft-skills-list', 'btn-add-soft-skill', 'softSkills', 'Communication, Leadership');
    setupSimpleList('certifications-list', 'btn-add-certification', 'certifications', 'Google Data Analytics Certificate');
    setupSimpleList('achievements-list', 'btn-add-achievement', 'achievements', '1st Position in Hackathon');
    setupSimpleList('languages-list', 'btn-add-language', 'languages', 'English (Fluent)');
    setupSimpleList('hobbies-list', 'btn-add-hobby', 'hobbies', 'Playing Chess');

    // Complex Blocks
    setupBlockList('education-blocks', 'btn-add-education', 'education', {
        degree: { label: 'Degree', placeholder: 'B.Tech / MBA' },
        institution: { label: 'Institution / School', placeholder: 'XYZ University' },
        board: { label: 'University / Board', placeholder: 'State Board' },
        year: { label: 'Passing Year', placeholder: '2024' },
        score: { label: 'CGPA / Percentage', placeholder: '8.5 CGPA or 85%' }
    });

    setupBlockList('work-blocks', 'btn-add-work', 'work', {
        title: { label: 'Job Title', placeholder: 'Software Engineer' },
        company: { label: 'Company Name', placeholder: 'Google LLC' },
        location: { label: 'Location', placeholder: 'New York, NY' },
        duration: { label: 'Duration', placeholder: 'Jan 2022 - Present' },
        desc: { label: 'Description', placeholder: 'Responsibilities, technologies used...', textarea: true }
    });

    setupBlockList('project-blocks', 'btn-add-project', 'projects', {
        name: { label: 'Project Name', placeholder: 'E-Commerce Platform' },
        tech: { label: 'Technologies Used', placeholder: 'React, Node.js, MongoDB' },
        desc: { label: 'Description', placeholder: 'Brief explanation of the project features...', textarea: true },
        github: { label: 'GitHub Link (Optional)', placeholder: 'github.com/user/project' },
        demo: { label: 'Live Demo Link (Optional)', placeholder: 'project.live' }
    });

    // Reset Form button
    document.getElementById('btn-clear-form').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all details? This cannot be undone.')) {
            clearForm();
        }
    });
}

/* Setup dynamic simple list string arrays (e.g. skills, certifications) */
function setupSimpleList(containerId, addBtnId, stateKey, placeholder) {
    const container = document.getElementById(containerId);
    const addBtn = document.getElementById(addBtnId);

    const renderItem = (value = '') => {
        const row = document.createElement('div');
        row.className = 'dynamic-item-row';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.placeholder = placeholder;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-text-danger';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        
        row.appendChild(input);
        row.appendChild(deleteBtn);
        container.appendChild(row);
        
        // Listeners
        input.addEventListener('input', () => {
            collectSimpleListData(container, stateKey);
        });
        
        deleteBtn.addEventListener('click', () => {
            row.remove();
            collectSimpleListData(container, stateKey);
        });
    };

    addBtn.addEventListener('click', () => {
        renderItem();
    });

    // Store renderer on container so we can call it when populating state
    container.renderItem = renderItem;
}

function collectSimpleListData(container, stateKey) {
    const inputs = container.querySelectorAll('.dynamic-item-row input');
    cvState[stateKey] = [];
    inputs.forEach(input => {
        const val = input.value.trim();
        if (val) {
            cvState[stateKey].push(val);
        }
    });
    saveStateToLocalStorage();
    updatePreview();
}

/* Setup dynamic complex blocks lists (e.g. Education, Work, Projects) */
function setupBlockList(containerId, addBtnId, stateKey, fieldsSchema) {
    const container = document.getElementById(containerId);
    const addBtn = document.getElementById(addBtnId);

    const renderBlock = (data = {}) => {
        const block = document.createElement('div');
        block.className = 'dynamic-block-item';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove-block';
        removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        block.appendChild(removeBtn);
        
        const grid = document.createElement('div');
        grid.className = 'form-grid';
        
        Object.keys(fieldsSchema).forEach(fieldKey => {
            const field = fieldsSchema[fieldKey];
            const group = document.createElement('div');
            group.className = 'form-group';
            
            // Make descriptions full span
            if (fieldKey === 'desc') {
                group.className = 'form-group col-span-2';
            }
            
            const label = document.createElement('label');
            label.innerText = field.label;
            
            let input;
            if (field.textarea) {
                input = document.createElement('textarea');
                input.rows = 3;
            } else {
                input = document.createElement('input');
                input.type = 'text';
            }
            
            input.value = data[fieldKey] || '';
            input.placeholder = field.placeholder;
            input.dataset.key = fieldKey;
            
            group.appendChild(label);
            group.appendChild(input);
            grid.appendChild(group);
            
            input.addEventListener('input', () => {
                collectBlockListData(container, stateKey);
            });
        });
        
        block.appendChild(grid);
        container.appendChild(block);
        
        removeBtn.addEventListener('click', () => {
            block.remove();
            collectBlockListData(container, stateKey);
        });
    };

    addBtn.addEventListener('click', () => {
        renderBlock();
    });

    container.renderBlock = renderBlock;
}

function collectBlockListData(container, stateKey) {
    const blocks = container.querySelectorAll('.dynamic-block-item');
    cvState[stateKey] = [];
    
    blocks.forEach(block => {
        const fields = block.querySelectorAll('input, textarea');
        let blockObj = {};
        let hasValues = false;
        
        fields.forEach(field => {
            const val = field.value.trim();
            const key = field.dataset.key;
            blockObj[key] = val;
            if (val) hasValues = true;
        });
        
        if (hasValues) {
            cvState[stateKey].push(blockObj);
        }
    });
    
    saveStateToLocalStorage();
    updatePreview();
}

// ==========================================================================
// VALUE INPUT SYNC ENGINE
// ==========================================================================
function setupInputListeners() {
    const textInputs = [
        { id: 'full-name', key: 'fullName' },
        { id: 'job-title', key: 'jobTitle' },
        { id: 'phone-number', key: 'phone' },
        { id: 'email-address', key: 'email' },
        { id: 'street-address', key: 'address' },
        { id: 'city', key: 'city' },
        { id: 'state', key: 'state' },
        { id: 'country', key: 'country' },
        { id: 'linkedin-url', key: 'linkedin' },
        { id: 'github-url', key: 'github' },
        { id: 'portfolio-url', key: 'portfolio' },
        { id: 'career-summary', key: 'careerSummary' }
    ];

    textInputs.forEach(item => {
        const element = document.getElementById(item.id);
        element.addEventListener('input', (e) => {
            // BUG FIX: Do not trim on every keystroke — trimming live breaks typing spaces.
            // Trim only when reading values for export/preview, not during user input.
            cvState[item.key] = e.target.value;
            saveStateToLocalStorage();
            updatePreview();
        });
    });
}

// ==========================================================================
// STATE SAVE & LOADING MANAGEMENT
// ==========================================================================
function saveStateToLocalStorage() {
    localStorage.setItem('craftcv_data', JSON.stringify(cvState));
}

function populateFormFromState() {
    // Basic text fields
    document.getElementById('full-name').value = cvState.fullName || '';
    document.getElementById('job-title').value = cvState.jobTitle || '';
    document.getElementById('phone-number').value = cvState.phone || '';
    document.getElementById('email-address').value = cvState.email || '';
    document.getElementById('street-address').value = cvState.address || '';
    document.getElementById('city').value = cvState.city || '';
    document.getElementById('state').value = cvState.state || '';
    document.getElementById('country').value = cvState.country || '';
    document.getElementById('linkedin-url').value = cvState.linkedin || '';
    document.getElementById('github-url').value = cvState.github || '';
    document.getElementById('portfolio-url').value = cvState.portfolio || '';
    document.getElementById('career-summary').value = cvState.careerSummary || '';
    document.getElementById('template-select').value = cvState.selectedTemplate || 'classic-executive';

    // Profile photo preview loading
    const previewImg = document.getElementById('photo-preview-img');
    const placeholderIcon = document.getElementById('photo-placeholder-icon');
    const removeBtn = document.getElementById('btn-remove-photo');
    
    if (cvState.photo) {
        previewImg.src = cvState.photo;
        previewImg.classList.remove('hidden');
        placeholderIcon.classList.add('hidden');
        removeBtn.classList.remove('hidden');
    } else {
        previewImg.src = '';
        previewImg.classList.add('hidden');
        placeholderIcon.classList.remove('hidden');
        removeBtn.classList.add('hidden');
    }

    // Dynamic Lists (Clear container first, then draw items)
    const listMap = [
        { id: 'tech-skills-list', key: 'techSkills' },
        { id: 'soft-skills-list', key: 'softSkills' },
        { id: 'certifications-list', key: 'certifications' },
        { id: 'achievements-list', key: 'achievements' },
        { id: 'languages-list', key: 'languages' },
        { id: 'hobbies-list', key: 'hobbies' }
    ];

    listMap.forEach(mapItem => {
        const container = document.getElementById(mapItem.id);
        container.innerHTML = '';
        if (cvState[mapItem.key] && cvState[mapItem.key].length > 0) {
            cvState[mapItem.key].forEach(val => {
                container.renderItem(val);
            });
        }
    });

    // Dynamic Blocks
    const blockMap = [
        { id: 'education-blocks', key: 'education' },
        { id: 'work-blocks', key: 'work' },
        { id: 'project-blocks', key: 'projects' }
    ];

    blockMap.forEach(mapItem => {
        const container = document.getElementById(mapItem.id);
        container.innerHTML = '';
        if (cvState[mapItem.key] && cvState[mapItem.key].length > 0) {
            cvState[mapItem.key].forEach(val => {
                container.renderBlock(val);
            });
        }
    });
}

function clearForm() {
    cvState = {
        selectedTemplate: 'classic-executive',
        photo: '',
        fullName: '',
        jobTitle: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: '',
        linkedin: '',
        github: '',
        portfolio: '',
        careerSummary: '',
        techSkills: [],
        softSkills: [],
        education: [],
        work: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: [],
        hobbies: []
    };
    
    // Clear inputs in DOM
    const formInputs = document.querySelectorAll('#cv-form input, #cv-form textarea');
    formInputs.forEach(input => input.value = '');
    
    // Clear photo DOM elements
    document.getElementById('profile-photo').value = '';
    document.getElementById('photo-preview-img').src = '';
    document.getElementById('photo-preview-img').classList.add('hidden');
    document.getElementById('photo-placeholder-icon').classList.remove('hidden');
    document.getElementById('btn-remove-photo').classList.add('hidden');
    
    // Re-initialize lists
    document.getElementById('tech-skills-list').innerHTML = '';
    document.getElementById('soft-skills-list').innerHTML = '';
    document.getElementById('education-blocks').innerHTML = '';
    document.getElementById('work-blocks').innerHTML = '';
    document.getElementById('project-blocks').innerHTML = '';
    document.getElementById('certifications-list').innerHTML = '';
    document.getElementById('achievements-list').innerHTML = '';
    document.getElementById('languages-list').innerHTML = '';
    document.getElementById('hobbies-list').innerHTML = '';
    
    localStorage.removeItem('craftcv_data');
    updatePreview();
}

function loadDemoData() {
    cvState = JSON.parse(JSON.stringify(demoData));
    populateFormFromState();
    updatePreview();
    saveStateToLocalStorage();
}

// ==========================================================================
// RENDERING LIVE PREVIEW ENGINE (Pixel-Perfect Matching)
// ==========================================================================
function updatePreview() {
    const previewContainer = document.getElementById('cv-preview-document');
    if (!previewContainer) return;

    // Reset container classes
    previewContainer.className = `cv-preview-container template-${cvState.selectedTemplate}`;
    previewContainer.innerHTML = '';

    // Choose layout generator based on active template
    switch (cvState.selectedTemplate) {
        case 'classic-executive':
            renderClassicTemplate(previewContainer);
            break;
        case 'elegant-minimalist':
            renderMinimalistTemplate(previewContainer);
            break;
        case 'creative-tech':
            renderCreativeTemplate(previewContainer);
            break;
        case 'warm-slate':
            renderWarmSlateTemplate(previewContainer);
            break;
    }
}

// Helpers for check availability of fields
function hasContactInfo() {
    return cvState.phone || cvState.email || cvState.address || cvState.city || cvState.state || cvState.country || cvState.linkedin || cvState.github || cvState.portfolio;
}

function getFormattedLocation() {
    let loc = [];
    if (cvState.address) loc.push(cvState.address);
    if (cvState.city) loc.push(cvState.city);
    if (cvState.state) loc.push(cvState.state);
    if (cvState.country) loc.push(cvState.country);
    return loc.join(', ');
}

// RENDER: TEMPLATE 1 - CLASSIC EXECUTIVE
function renderClassicTemplate(container) {
    // Left Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';

    // Sidebar Photo
    if (cvState.photo) {
        const photoContainer = document.createElement('div');
        photoContainer.className = 'cv-photo-circle';
        photoContainer.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        sidebar.appendChild(photoContainer);
    }

    // Sidebar Contact Section
    if (hasContactInfo()) {
        const sec = document.createElement('div');
        sec.className = 'sidebar-section';
        sec.innerHTML = `<h3>Contact</h3>`;
        
        const list = document.createElement('div');
        list.className = 'sidebar-contact';
        
        if (cvState.phone) list.innerHTML += `<div><i class="fa-solid fa-phone"></i> ${cvState.phone}</div>`;
        if (cvState.email) list.innerHTML += `<div><i class="fa-solid fa-envelope"></i> ${cvState.email}</div>`;
        
        const location = getFormattedLocation();
        if (location) list.innerHTML += `<div><i class="fa-solid fa-location-dot"></i> ${location}</div>`;
        
        if (cvState.linkedin) list.innerHTML += `<div><i class="fa-brands fa-linkedin"></i> ${cvState.linkedin}</div>`;
        if (cvState.github) list.innerHTML += `<div><i class="fa-brands fa-github"></i> ${cvState.github}</div>`;
        if (cvState.portfolio) list.innerHTML += `<div><i class="fa-solid fa-globe"></i> ${cvState.portfolio}</div>`;
        
        sec.appendChild(list);
        sidebar.appendChild(sec);
    }

    // Sidebar Certifications
    if (cvState.certifications && cvState.certifications.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'sidebar-section';
        sec.innerHTML = `<h3>Certifications</h3>`;
        
        const list = document.createElement('ul');
        list.className = 'sidebar-list';
        cvState.certifications.forEach(cert => {
            list.innerHTML += `<li>${cert}</li>`;
        });
        
        sec.appendChild(list);
        sidebar.appendChild(sec);
    }

    // Sidebar Languages
    if (cvState.languages && cvState.languages.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'sidebar-section';
        sec.innerHTML = `<h3>Languages</h3>`;
        
        const list = document.createElement('ul');
        list.className = 'sidebar-list';
        cvState.languages.forEach(lang => {
            list.innerHTML += `<li>${lang}</li>`;
        });
        
        sec.appendChild(list);
        sidebar.appendChild(sec);
    }

    // Sidebar Hobbies
    if (cvState.hobbies && cvState.hobbies.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'sidebar-section';
        sec.innerHTML = `<h3>Hobbies</h3>`;
        
        const list = document.createElement('ul');
        list.className = 'sidebar-list';
        cvState.hobbies.forEach(hobby => {
            list.innerHTML += `<li>${hobby}</li>`;
        });
        
        sec.appendChild(list);
        sidebar.appendChild(sec);
    }

    // Right Main Pane
    const main = document.createElement('div');
    main.className = 'main-content';

    // Main Header
    if (cvState.fullName || cvState.jobTitle) {
        const header = document.createElement('div');
        header.className = 'main-header';
        header.innerHTML = `
            ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
            ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
        `;
        main.appendChild(header);
    }

    // Career Summary Section
    if (cvState.careerSummary) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-bullseye"></i> Career Objective</div>
            <p class="cv-item-desc">${cvState.careerSummary}</p>
        `;
        main.appendChild(sec);
    }

    // Tech Skills
    if (cvState.techSkills && cvState.techSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-laptop-code"></i> Key Skills</div>
        `;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.techSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        main.appendChild(sec);
    }

    // Soft Skills
    if (cvState.softSkills && cvState.softSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-people-arrows"></i> Soft Skills</div>
        `;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.softSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        main.appendChild(sec);
    }

    // Education
    if (cvState.education && cvState.education.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-graduation-cap"></i> Education</div>
        `;
        cvState.education.forEach(edu => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${edu.degree}</span>
                        <span>${edu.year}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${edu.institution}${edu.board ? ` | ${edu.board}` : ''}</span>
                        <span>${edu.score}</span>
                    </div>
                </div>
            `;
        });
        main.appendChild(sec);
    }

    // Work Experience
    if (cvState.work && cvState.work.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-briefcase"></i> Work Experience</div>
        `;
        cvState.work.forEach(job => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${job.title}</span>
                        <span>${job.duration}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${job.company}</span>
                        <span>${job.location}</span>
                    </div>
                    ${job.desc ? `<p class="cv-item-desc">${job.desc}</p>` : ''}
                </div>
            `;
        });
        main.appendChild(sec);
    }

    // Academic Projects
    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-diagram-project"></i> Academic Projects</div>
        `;
        cvState.projects.forEach(proj => {
            let links = [];
            if (proj.github) links.push(`GitHub: <a href="https://${proj.github}" target="_blank">${proj.github}</a>`);
            if (proj.demo) links.push(`Live: <a href="https://${proj.demo}" target="_blank">${proj.demo}</a>`);
            // BUG FIX: Was building linksStr as " | link1 | link2" then calling .substring(3)
            // to strip the leading " | " — fragile and off-by-one if links is empty.
            // Now just joining directly without the erroneous leading separator.
            const linksStr = links.join(' | ');
            
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${proj.name} ${proj.tech ? `(${proj.tech})` : ''}</span>
                    </div>
                    ${linksStr ? `<div class="cv-item-subheader">${linksStr}</div>` : ''}
                    ${proj.desc ? `<p class="cv-item-desc">${proj.desc}</p>` : ''}
                </div>
            `;
        });
        main.appendChild(sec);
    }

    // Achievements
    if (cvState.achievements && cvState.achievements.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-trophy"></i> Achievements</div>
        `;
        const list = document.createElement('ul');
        list.className = 'cv-list-items';
        cvState.achievements.forEach(ach => {
            list.innerHTML += `<li>${ach}</li>`;
        });
        sec.appendChild(list);
        main.appendChild(sec);
    }

    container.appendChild(sidebar);
    container.appendChild(main);
}

// RENDER: TEMPLATE 2 - ELEGANT MINIMALIST
function renderMinimalistTemplate(container) {
    // Header block
    const headerBlock = document.createElement('div');
    headerBlock.className = 'header-block';

    // Circular Photo
    // BUG FIX: Must append photo element BEFORE setting innerHTML on headerBlock.
    // Using innerHTML += after appendChild serializes & re-creates child nodes,
    // destroying event listeners and causing subtle DOM bugs.
    // Solution: build name/title in a separate wrapper div, then append both.
    if (cvState.photo) {
        const photoContainer = document.createElement('div');
        photoContainer.className = 'cv-photo-circle';
        photoContainer.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        headerBlock.appendChild(photoContainer);
    }

    const headerText = document.createElement('div');
    headerText.innerHTML = `
        ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
        ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
    `;
    headerBlock.appendChild(headerText);

    // Horizontal Contact row
    if (hasContactInfo()) {
        const contactRow = document.createElement('div');
        contactRow.className = 'contact-horizontal';
        
        if (cvState.phone) contactRow.innerHTML += `<span><i class="fa-solid fa-phone"></i> ${cvState.phone}</span>`;
        if (cvState.email) contactRow.innerHTML += `<span><i class="fa-solid fa-envelope"></i> ${cvState.email}</span>`;
        
        const location = getFormattedLocation();
        if (location) contactRow.innerHTML += `<span><i class="fa-solid fa-location-dot"></i> ${location}</span>`;
        
        if (cvState.linkedin) contactRow.innerHTML += `<span><i class="fa-brands fa-linkedin"></i> ${cvState.linkedin}</span>`;
        if (cvState.github) contactRow.innerHTML += `<span><i class="fa-brands fa-github"></i> ${cvState.github}</span>`;
        if (cvState.portfolio) contactRow.innerHTML += `<span><i class="fa-solid fa-globe"></i> ${cvState.portfolio}</span>`;
        
        headerBlock.appendChild(contactRow);
    }
    container.appendChild(headerBlock);

    // Body content wrapper
    const bodyContent = document.createElement('div');
    bodyContent.className = 'body-content';

    // Summary
    if (cvState.careerSummary) {
        bodyContent.innerHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Career Summary</div>
                <p class="cv-item-desc" style="font-family: Georgia, serif; font-style: italic;">${cvState.careerSummary}</p>
            </div>
        `;
    }

    // Skills Grid (Combined)
    if ((cvState.techSkills && cvState.techSkills.length > 0) || (cvState.softSkills && cvState.softSkills.length > 0)) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Skills Overview</div>`;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        
        if (cvState.techSkills) {
            cvState.techSkills.forEach(skill => {
                grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
            });
        }
        if (cvState.softSkills) {
            cvState.softSkills.forEach(skill => {
                grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
            });
        }
        sec.appendChild(grid);
        bodyContent.appendChild(sec);
    }

    // Education
    if (cvState.education && cvState.education.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Education</div>`;
        
        cvState.education.forEach(edu => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${edu.degree}</span>
                        <span>${edu.year}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${edu.institution}${edu.board ? `, ${edu.board}` : ''}</span>
                        <span>${edu.score}</span>
                    </div>
                </div>
            `;
        });
        bodyContent.appendChild(sec);
    }

    // Work Experience
    if (cvState.work && cvState.work.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Professional Experience</div>`;
        
        cvState.work.forEach(job => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${job.title}</span>
                        <span>${job.duration}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${job.company} &mdash; ${job.location}</span>
                    </div>
                    ${job.desc ? `<p class="cv-item-desc">${job.desc}</p>` : ''}
                </div>
            `;
        });
        bodyContent.appendChild(sec);
    }

    // Projects
    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Academic & Personal Projects</div>`;
        
        cvState.projects.forEach(proj => {
            let links = [];
            if (proj.github) links.push(`GitHub: ${proj.github}`);
            if (proj.demo) links.push(`Demo: ${proj.demo}`);
            const linksStr = links.length > 0 ? ` (${links.join(', ')})` : '';

            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${proj.name} &ndash; <i>${proj.tech}</i></span>
                    </div>
                    ${linksStr ? `<div class="cv-item-subheader">${linksStr}</div>` : ''}
                    ${proj.desc ? `<p class="cv-item-desc">${proj.desc}</p>` : ''}
                </div>
            `;
        });
        bodyContent.appendChild(sec);
    }

    // Certifications & Achievements
    if ((cvState.certifications && cvState.certifications.length > 0) || (cvState.achievements && cvState.achievements.length > 0)) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Certifications & Achievements</div>`;
        
        const list = document.createElement('ul');
        list.className = 'cv-list-items';
        
        if (cvState.certifications) {
            cvState.certifications.forEach(cert => {
                list.innerHTML += `<li>${cert} (Certificate)</li>`;
            });
        }
        if (cvState.achievements) {
            cvState.achievements.forEach(ach => {
                list.innerHTML += `<li>${ach}</li>`;
            });
        }
        sec.appendChild(list);
        bodyContent.appendChild(sec);
    }

    // Languages, Hobbies
    if ((cvState.languages && cvState.languages.length > 0) || (cvState.hobbies && cvState.hobbies.length > 0)) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Personal Details</div>`;
        
        let details = [];
        if (cvState.languages && cvState.languages.length > 0) {
            details.push(`<strong>Languages:</strong> ${cvState.languages.join(', ')}`);
        }
        if (cvState.hobbies && cvState.hobbies.length > 0) {
            details.push(`<strong>Interests:</strong> ${cvState.hobbies.join(', ')}`);
        }
        
        sec.innerHTML += `<p class="cv-item-desc">${details.join('<br>')}</p>`;
        bodyContent.appendChild(sec);
    }

    container.appendChild(bodyContent);
}

// RENDER: TEMPLATE 3 - CREATIVE TECH
function renderCreativeTemplate(container) {
    // Top banner
    const banner = document.createElement('div');
    banner.className = 'top-banner';
    
    const bannerInfo = document.createElement('div');
    bannerInfo.className = 'header-info';
    bannerInfo.innerHTML = `
        ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
        ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
    `;
    banner.appendChild(bannerInfo);

    // Profile Photo in Banner (circular overlap)
    if (cvState.photo) {
        const bannerPhoto = document.createElement('div');
        bannerPhoto.className = 'banner-photo';
        const photoCircle = document.createElement('div');
        photoCircle.className = 'cv-photo-circle';
        photoCircle.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        bannerPhoto.appendChild(photoCircle);
        banner.appendChild(bannerPhoto);
    }
    container.appendChild(banner);

    // Body content grid
    const creativeBody = document.createElement('div');
    creativeBody.className = 'creative-body';

    // Left Pane
    const leftPane = document.createElement('div');
    leftPane.className = 'left-pane';

    // Career Summary
    if (cvState.careerSummary) {
        leftPane.innerHTML += `
            <div class="cv-section">
                <div class="cv-section-title"><i class="fa-solid fa-user"></i> About Me</div>
                <p class="cv-item-desc">${cvState.careerSummary}</p>
            </div>
        `;
    }

    // Work Experience
    if (cvState.work && cvState.work.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-briefcase"></i> Experience</div>`;
        
        cvState.work.forEach(job => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${job.title}</span>
                        <span>${job.duration}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${job.company} &bull; ${job.location}</span>
                    </div>
                    ${job.desc ? `<p class="cv-item-desc">${job.desc}</p>` : ''}
                </div>
            `;
        });
        leftPane.appendChild(sec);
    }

    // Projects
    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-terminal"></i> Key Projects</div>`;
        
        cvState.projects.forEach(proj => {
            let links = [];
            if (proj.github) links.push(`<a href="https://${proj.github}" target="_blank"><i class="fa-brands fa-github"></i> Source</a>`);
            if (proj.demo) links.push(`<a href="https://${proj.demo}" target="_blank"><i class="fa-solid fa-laptop"></i> Live</a>`);
            const linksStr = links.length > 0 ? ` &nbsp; ${links.join(' &bull; ')}` : '';

            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${proj.name}</span>
                    </div>
                    <div class="cv-item-subheader" style="font-family: inherit; font-size:11.5px;">
                        <span>Tech: ${proj.tech}</span>
                        <span>${linksStr}</span>
                    </div>
                    ${proj.desc ? `<p class="cv-item-desc">${proj.desc}</p>` : ''}
                </div>
            `;
        });
        leftPane.appendChild(sec);
    }

    // Right Pane
    const rightPane = document.createElement('div');
    rightPane.className = 'right-pane';

    // Contact
    if (hasContactInfo()) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-address-book"></i> Connect</div>`;
        
        const list = document.createElement('div');
        list.className = 'contact-vertical';
        
        if (cvState.phone) list.innerHTML += `<div><i class="fa-solid fa-phone"></i> ${cvState.phone}</div>`;
        if (cvState.email) list.innerHTML += `<div><i class="fa-solid fa-envelope"></i> ${cvState.email}</div>`;
        
        const location = getFormattedLocation();
        if (location) list.innerHTML += `<div><i class="fa-solid fa-location-dot"></i> ${location}</div>`;
        
        if (cvState.linkedin) list.innerHTML += `<div><i class="fa-brands fa-linkedin"></i> ${cvState.linkedin}</div>`;
        if (cvState.github) list.innerHTML += `<div><i class="fa-brands fa-github"></i> ${cvState.github}</div>`;
        if (cvState.portfolio) list.innerHTML += `<div><i class="fa-solid fa-globe"></i> ${cvState.portfolio}</div>`;
        
        sec.appendChild(list);
        rightPane.appendChild(sec);
    }

    // Tech Skills
    if (cvState.techSkills && cvState.techSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-code"></i> Tech Stack</div>`;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.techSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        rightPane.appendChild(sec);
    }

    // Soft Skills
    if (cvState.softSkills && cvState.softSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-handshake"></i> Soft Skills</div>`;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.softSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        rightPane.appendChild(sec);
    }

    // Education
    if (cvState.education && cvState.education.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-graduation-cap"></i> Education</div>`;
        cvState.education.forEach(edu => {
            sec.innerHTML += `
                <div class="cv-item-block" style="font-size:12px;">
                    <div style="font-weight:700;">${edu.degree}</div>
                    <div style="color:#718096; font-size:11px;">${edu.institution} (${edu.year})</div>
                    <div style="font-style:italic; font-size:11px;">${edu.score}</div>
                </div>
            `;
        });
        rightPane.appendChild(sec);
    }

    // Languages & Hobbies
    if ((cvState.languages && cvState.languages.length > 0) || (cvState.hobbies && cvState.hobbies.length > 0)) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-sparkles"></i> More</div>`;
        
        const list = document.createElement('ul');
        list.className = 'sidebar-list';
        list.style.listStyleType = 'none';
        list.style.fontSize = '12px';
        list.style.paddingLeft = '0';
        
        if (cvState.languages) {
            cvState.languages.forEach(lang => {
                list.innerHTML += `<li><i class="fa-solid fa-comment-dots" style="color:#7c3aed; margin-right:6px;"></i> ${lang}</li>`;
            });
        }
        if (cvState.hobbies) {
            cvState.hobbies.forEach(hobby => {
                list.innerHTML += `<li><i class="fa-solid fa-heart" style="color:#7c3aed; margin-right:6px;"></i> ${hobby}</li>`;
            });
        }
        sec.appendChild(list);
        rightPane.appendChild(sec);
    }

    creativeBody.appendChild(leftPane);
    creativeBody.appendChild(rightPane);
    container.appendChild(creativeBody);
}

// RENDER: TEMPLATE 4 - WARM SLATE
function renderWarmSlateTemplate(container) {
    // Left Main Area
    const mainArea = document.createElement('div');
    mainArea.className = 'main-area';

    mainArea.innerHTML = `
        ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
        ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
    `;

    // Summary
    if (cvState.careerSummary) {
        mainArea.innerHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Summary</div>
                <p class="cv-item-desc">${cvState.careerSummary}</p>
            </div>
        `;
    }

    // Experience
    if (cvState.work && cvState.work.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Employment History</div>`;
        cvState.work.forEach(job => {
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${job.title}</span>
                        <span>${job.duration}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>${job.company}, ${job.location}</span>
                    </div>
                    ${job.desc ? `<p class="cv-item-desc">${job.desc}</p>` : ''}
                </div>
            `;
        });
        mainArea.appendChild(sec);
    }

    // Projects
    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Personal Projects</div>`;
        cvState.projects.forEach(proj => {
            let links = [];
            if (proj.github) links.push(`<a href="https://${proj.github}" target="_blank" style="color:#ea580c;">GitHub</a>`);
            if (proj.demo) links.push(`<a href="https://${proj.demo}" target="_blank" style="color:#ea580c;">Demo</a>`);
            const linksStr = links.length > 0 ? ` &bull; ${links.join(' &bull; ')}` : '';
            
            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${proj.name}</span>
                    </div>
                    <div class="cv-item-subheader">
                        <span>Stack: ${proj.tech}</span>
                        <span>${linksStr}</span>
                    </div>
                    ${proj.desc ? `<p class="cv-item-desc">${proj.desc}</p>` : ''}
                </div>
            `;
        });
        mainArea.appendChild(sec);
    }

    // Right Side Pane
    const sidePane = document.createElement('div');
    sidePane.className = 'side-pane';

    // Photo
    if (cvState.photo) {
        const photoCircle = document.createElement('div');
        photoCircle.className = 'cv-photo-circle';
        photoCircle.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        sidePane.appendChild(photoCircle);
    }

    // Contact details
    if (hasContactInfo()) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Details</div>`;
        
        const list = document.createElement('div');
        list.className = 'contact-list';
        
        if (cvState.phone) list.innerHTML += `<div><i class="fa-solid fa-phone"></i> ${cvState.phone}</div>`;
        if (cvState.email) list.innerHTML += `<div><i class="fa-solid fa-envelope"></i> ${cvState.email}</div>`;
        
        const location = getFormattedLocation();
        if (location) list.innerHTML += `<div><i class="fa-solid fa-location-dot"></i> ${location}</div>`;
        
        if (cvState.linkedin) list.innerHTML += `<div><i class="fa-brands fa-linkedin"></i> ${cvState.linkedin}</div>`;
        if (cvState.github) list.innerHTML += `<div><i class="fa-brands fa-github"></i> ${cvState.github}</div>`;
        if (cvState.portfolio) list.innerHTML += `<div><i class="fa-solid fa-globe"></i> ${cvState.portfolio}</div>`;
        
        sec.appendChild(list);
        sidePane.appendChild(sec);
    }

    // Education in sidepane
    if (cvState.education && cvState.education.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Education</div>`;
        cvState.education.forEach(edu => {
            sec.innerHTML += `
                <div class="cv-item-block" style="font-size:11.5px; margin-bottom:10px;">
                    <div style="font-weight:700;">${edu.degree}</div>
                    <div style="color:#52525b;">${edu.institution}</div>
                    <div>Year: ${edu.year}</div>
                    <div style="font-style:italic; font-size:11px;">${edu.score}</div>
                </div>
            `;
        });
        sidePane.appendChild(sec);
    }

    // Technical Skills
    if (cvState.techSkills && cvState.techSkills.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Skills</div>`;
        const grid = document.createElement('div');
        grid.className = 'cv-skills-grid';
        cvState.techSkills.forEach(skill => {
            grid.innerHTML += `<span class="cv-skill-badge">${skill}</span>`;
        });
        sec.appendChild(grid);
        sidePane.appendChild(sec);
    }

    // Achievements
    if (cvState.achievements && cvState.achievements.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Achievements</div>`;
        const list = document.createElement('ul');
        list.className = 'cv-list-items';
        list.style.fontSize = '11px';
        list.style.paddingLeft = '14px';
        cvState.achievements.forEach(ach => {
            list.innerHTML += `<li>${ach}</li>`;
        });
        sec.appendChild(list);
        sidePane.appendChild(sec);
    }

    container.appendChild(mainArea);
    container.appendChild(sidePane);
}

// ==========================================================================
// EXPORTERS & DOWNLOAD DRIVER (PDF & WORD)
// ==========================================================================
function setupExportHandlers() {
    const btnPdf = document.getElementById('btn-download-pdf');
    const btnDocx = document.getElementById('btn-download-docx');

    // PDF download using html2pdf.js
    btnPdf.addEventListener('click', () => {
        const docElement = document.getElementById('cv-preview-document');
        const fullName = cvState.fullName || 'craftcv_resume';

        // --- BLANK PDF FIX ---
        // html2canvas cannot reliably capture elements inside:
        //   - CSS transform parents (.cv-scale-wrapper has scale())
        //   - overflow:hidden scroll containers
        // Solution: Clone the CV node, attach it directly to <body> with
        // fixed positioning OFF-SCREEN, capture the clone, then remove it.
        const clone = docElement.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.top = '0';
        clone.style.left = '-9999px';
        clone.style.width = '794px';
        clone.style.minHeight = '1123px';
        clone.style.zIndex = '-1';
        clone.style.transform = 'none';
        clone.style.overflow = 'visible';
        document.body.appendChild(clone);

        const opt = {
            margin:      0,
            filename:    `resume_${fullName.replace(/\s+/g, '_').toLowerCase()}.pdf`,
            image:       { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                letterRendering: true,
                logging: false,
                width: 794,
                windowWidth: 794
            },
            jsPDF:     { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: 'avoid-all' }
        };

        html2pdf().set(opt).from(clone).save().then(() => {
            document.body.removeChild(clone);
        }).catch(err => {
            console.error('PDF export failed', err);
            document.body.removeChild(clone);
        });
    });

    // Word document download (generates rich Word HTML wrapper)
    btnDocx.addEventListener('click', () => {
        const fullName = cvState.fullName || 'craftcv_resume';
        const docHtml = generateWordHTMLContent();
        
        const blob = new Blob(['\ufeff' + docHtml], {
            type: 'application/msword'
        });

        // Trigger file download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume_${fullName.replace(/\s+/g, '_').toLowerCase()}.doc`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}

/**
 * Generates structured, MS-Word-friendly HTML code.
 * Word renders tables with explicit widths far better than modern CSS Flex/Grid.
 * We compile the state into a clean single-column or table-aligned Word document.
 */
function generateWordHTMLContent() {
    const primaryColor = '#1e293b';
    const accentColor = '#6366f1';
    
    let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <title>Resume - ${cvState.fullName || 'Details'}</title>
        <style>
            body {
                font-family: 'Calibri', 'Arial', sans-serif;
                font-size: 11pt;
                line-height: 1.35;
                color: #27272a;
                margin: 1in;
            }
            h1 {
                font-family: 'Arial', sans-serif;
                font-size: 24pt;
                font-weight: bold;
                color: ${primaryColor};
                margin: 0 0 4pt 0;
            }
            .job-title {
                font-size: 13pt;
                font-weight: bold;
                color: ${accentColor};
                margin-bottom: 12pt;
                text-transform: uppercase;
            }
            .contact-info {
                font-size: 10pt;
                color: #52525b;
                margin-bottom: 18pt;
                border-bottom: 1px solid #e4e4e7;
                padding-bottom: 8pt;
            }
            .section-header {
                font-family: 'Arial', sans-serif;
                font-size: 14pt;
                font-weight: bold;
                text-transform: uppercase;
                color: ${primaryColor};
                border-bottom: 2px solid ${accentColor};
                margin-top: 18pt;
                margin-bottom: 8pt;
                padding-bottom: 3pt;
            }
            .item-title {
                font-size: 11pt;
                font-weight: bold;
            }
            .item-meta {
                font-size: 10pt;
                color: #52525b;
                font-style: italic;
                margin-bottom: 3pt;
            }
            .item-desc {
                font-size: 10.5pt;
                color: #27272a;
                margin-bottom: 10pt;
            }
            .badge-list {
                margin-bottom: 10pt;
            }
            .badge {
                background-color: #f4f4f5;
                border: 1px solid #e4e4e7;
                padding: 3pt 8pt;
                font-size: 9.5pt;
                margin-right: 5pt;
                margin-bottom: 5pt;
                display: inline-block;
            }
            ul {
                margin: 0 0 10pt 0;
                padding-left: 20px;
            }
            li {
                margin-bottom: 3pt;
                font-size: 10.5pt;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            td {
                vertical-align: top;
            }
        </style>
    </head>
    <body>
    `;

    // 1. Header (Name & Professional Title)
    html += `<h1>${cvState.fullName || 'Full Name'}</h1>`;
    if (cvState.jobTitle) {
        html += `<div class="job-title">${cvState.jobTitle}</div>`;
    }

    // 2. Contact details horizontally
    let contactItems = [];
    if (cvState.phone) contactItems.push(cvState.phone);
    if (cvState.email) contactItems.push(cvState.email);
    const location = getFormattedLocation();
    if (location) contactItems.push(location);
    if (cvState.linkedin) contactItems.push(`LinkedIn: ${cvState.linkedin}`);
    if (cvState.github) contactItems.push(`GitHub: ${cvState.github}`);
    if (cvState.portfolio) contactItems.push(`Portfolio: ${cvState.portfolio}`);
    
    if (contactItems.length > 0) {
        html += `<div class="contact-info">${contactItems.join('  |  ')}</div>`;
    }

    // 3. Career Objective
    if (cvState.careerSummary) {
        html += `<div class="section-header">Professional Summary</div>`;
        html += `<p class="item-desc">${cvState.careerSummary.replace(/\n/g, '<br>')}</p>`;
    }

    // 4. Skills
    if (cvState.techSkills && cvState.techSkills.length > 0) {
        html += `<div class="section-header">Technical Skills</div>`;
        html += `<div class="badge-list">`;
        cvState.techSkills.forEach(skill => {
            html += `<span class="badge">${skill}</span>`;
        });
        html += `</div>`;
    }

    if (cvState.softSkills && cvState.softSkills.length > 0) {
        html += `<div class="section-header">Soft Skills</div>`;
        html += `<div class="badge-list">`;
        cvState.softSkills.forEach(skill => {
            html += `<span class="badge">${skill}</span>`;
        });
        html += `</div>`;
    }

    // 5. Work Experience
    if (cvState.work && cvState.work.length > 0) {
        html += `<div class="section-header">Professional Experience</div>`;
        cvState.work.forEach(job => {
            html += `
                <table style="margin-bottom: 6pt;">
                    <tr>
                        <td class="item-title">${job.title}</td>
                        <td style="text-align: right; font-weight: bold;">${job.duration}</td>
                    </tr>
                    <tr>
                        <td class="item-meta">${job.company}</td>
                        <td style="text-align: right;" class="item-meta">${job.location}</td>
                    </tr>
                </table>
                <p class="item-desc">${job.desc ? job.desc.replace(/\n/g, '<br>') : ''}</p>
            `;
        });
    }

    // 6. Education
    if (cvState.education && cvState.education.length > 0) {
        html += `<div class="section-header">Education</div>`;
        cvState.education.forEach(edu => {
            html += `
                <table style="margin-bottom: 4pt;">
                    <tr>
                        <td class="item-title">${edu.degree}</td>
                        <td style="text-align: right; font-weight: bold;">${edu.year}</td>
                    </tr>
                    <tr>
                        <td class="item-meta">${edu.institution}${edu.board ? ` (${edu.board})` : ''}</td>
                        <td style="text-align: right;" class="item-meta">${edu.score}</td>
                    </tr>
                </table>
            `;
        });
    }

    // 7. Academic Projects
    if (cvState.projects && cvState.projects.length > 0) {
        html += `<div class="section-header">Academic Projects</div>`;
        cvState.projects.forEach(proj => {
            let links = [];
            if (proj.github) links.push(`GitHub: ${proj.github}`);
            if (proj.demo) links.push(`Live Demo: ${proj.demo}`);
            const linksStr = links.length > 0 ? ` (${links.join('  |  ')})` : '';
            
            html += `
                <div style="font-weight: bold; font-size: 11pt;">${proj.name} ${proj.tech ? `[${proj.tech}]` : ''}</div>
                ${linksStr ? `<div class="item-meta">${linksStr}</div>` : ''}
                <p class="item-desc">${proj.desc ? proj.desc.replace(/\n/g, '<br>') : ''}</p>
            `;
        });
    }

    // 8. Certifications
    if (cvState.certifications && cvState.certifications.length > 0) {
        html += `<div class="section-header">Certifications</div>`;
        html += `<ul>`;
        cvState.certifications.forEach(cert => {
            html += `<li>${cert}</li>`;
        });
        html += `</ul>`;
    }

    // 9. Achievements
    if (cvState.achievements && cvState.achievements.length > 0) {
        html += `<div class="section-header">Achievements</div>`;
        html += `<ul>`;
        cvState.achievements.forEach(ach => {
            html += `<li>${ach}</li>`;
        });
        html += `</ul>`;
    }

    // 10. Languages & Hobbies
    if ((cvState.languages && cvState.languages.length > 0) || (cvState.hobbies && cvState.hobbies.length > 0)) {
        html += `<div class="section-header">Additional Info</div>`;
        if (cvState.languages && cvState.languages.length > 0) {
            html += `<p class="item-desc"><strong>Languages:</strong> ${cvState.languages.join(', ')}</p>`;
        }
        if (cvState.hobbies && cvState.hobbies.length > 0) {
            html += `<p class="item-desc"><strong>Hobbies & Interests:</strong> ${cvState.hobbies.join(', ')}</p>`;
        }
    }

    html += `
    </body>
    </html>
    `;

    return html;
}
