/* ==========================================================================
   CRAFTCV APPLICATION LOGIC (VANILLA JS)
   ========================================================================== */

// --- Global Application State ---
let cvState = {
    selectedTemplate: 'classic-executive',
    cvFont: "'Calibri', 'Gill Sans', sans-serif",
    cvFontStyle: 'normal|normal',
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
    cvFont: "'Calibri', 'Gill Sans', sans-serif",
    cvFontStyle: 'normal|normal',
    photo: '',
    fullName: 'Arjun Mehta',
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
// SCROLL FIX
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

    editorForm.style.height = (availableH - editorHeaderH) + 'px';
    editorForm.style.maxHeight = (availableH - editorHeaderH) + 'px';
    editorForm.style.overflowY = 'scroll';
    editorForm.style.overflowX = 'hidden';

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
    setupFontControls();
    setupExportHandlers();

    fixEditorScrollHeight();
    window.addEventListener('resize', fixEditorScrollHeight);

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
        fitZoomToContainer();
        setTimeout(fixEditorScrollHeight, 50);
    };

    btnHome.addEventListener('click', switchToHome);
    logoHome.addEventListener('click', switchToHome);
    btnEditor.addEventListener('click', switchToEditor);

    document.getElementById('btn-quick-start').addEventListener('click', () => {
        loadDemoData();
        switchToEditor();
    });

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

        if (!file.type.startsWith('image/')) {
            alert('Invalid file type. Please upload a JPG, PNG, or other image file.');
            photoInput.value = '';
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('File is too large. Maximum size is 2MB.');
            photoInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Data = event.target.result;
            cvState.photo = base64Data;

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
        if (!wrapper || !zoomVal) return;
        previewZoom = Math.max(0.4, Math.min(1.5, zoom));
        wrapper.style.transform = `scale(${previewZoom})`;
        zoomVal.innerText = `${Math.round(previewZoom * 100)}%`;
        const docHeight = 1123 * previewZoom;
        if (wrapper.parentElement) {
            wrapper.parentElement.style.height = `${docHeight + 80}px`;
        }
    };

    const zoomInBtn = document.getElementById('btn-zoom-in');
    const zoomOutBtn = document.getElementById('btn-zoom-out');
    const zoomResetBtn = document.getElementById('btn-zoom-reset');

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => { setZoom(previewZoom + 0.1); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { setZoom(previewZoom - 0.1); });
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => { setZoom(1.0); });

    window.addEventListener('resize', fitZoomToContainer);
}

function fitZoomToContainer() {
    const container = document.querySelector('.preview-scroll-container');
    if (!container || container.clientWidth === 0) return;

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
    setupSimpleList('tech-skills-list', 'btn-add-tech-skill', 'techSkills', 'Python, Java, etc.');
    setupSimpleList('soft-skills-list', 'btn-add-soft-skill', 'softSkills', 'Communication, Leadership');
    setupSimpleList('certifications-list', 'btn-add-certification', 'certifications', 'Google Data Analytics Certificate');
    setupSimpleList('achievements-list', 'btn-add-achievement', 'achievements', '1st Position in Hackathon');
    setupSimpleList('languages-list', 'btn-add-language', 'languages', 'English (Fluent)');
    setupSimpleList('hobbies-list', 'btn-add-hobby', 'hobbies', 'Playing Chess');

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

    document.getElementById('btn-clear-form').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all details? This cannot be undone.')) {
            clearForm();
        }
    });
}

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
        if (!element) {
            console.warn(`setupInputListeners: element #${item.id} not found`);
            return;
        }
        element.addEventListener('input', (e) => {
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

    const fontFamilySelect = document.getElementById('font-family-select');
    if (fontFamilySelect) fontFamilySelect.value = cvState.cvFont || "'Calibri', 'Gill Sans', sans-serif";

    const fontStyleSelect = document.getElementById('font-style-select');
    if (fontStyleSelect) fontStyleSelect.value = cvState.cvFontStyle || 'normal|normal';

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
        if (!container) return;
        const savedRenderItem = container.renderItem;
        container.innerHTML = '';
        container.renderItem = savedRenderItem;
        if (cvState[mapItem.key] && cvState[mapItem.key].length > 0) {
            cvState[mapItem.key].forEach(val => {
                if (typeof container.renderItem === 'function') {
                    container.renderItem(val);
                }
            });
        }
    });

    const blockMap = [
        { id: 'education-blocks', key: 'education' },
        { id: 'work-blocks', key: 'work' },
        { id: 'project-blocks', key: 'projects' }
    ];

    blockMap.forEach(mapItem => {
        const container = document.getElementById(mapItem.id);
        if (!container) return;
        const savedRenderBlock = container.renderBlock;
        container.innerHTML = '';
        container.renderBlock = savedRenderBlock;
        if (cvState[mapItem.key] && cvState[mapItem.key].length > 0) {
            cvState[mapItem.key].forEach(val => {
                if (typeof container.renderBlock === 'function') {
                    container.renderBlock(val);
                }
            });
        }
    });
}

function clearForm() {
    cvState = {
        selectedTemplate: 'classic-executive',
        cvFont: "'Calibri', 'Gill Sans', sans-serif",
        cvFontStyle: 'normal|normal',
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

    const formInputs = document.querySelectorAll('#cv-form input, #cv-form textarea');
    formInputs.forEach(input => input.value = '');

    document.getElementById('profile-photo').value = '';
    document.getElementById('photo-preview-img').src = '';
    document.getElementById('photo-preview-img').classList.add('hidden');
    document.getElementById('photo-placeholder-icon').classList.remove('hidden');
    document.getElementById('btn-remove-photo').classList.add('hidden');

    // Clear innerHTML but preserve the custom renderItem/renderBlock methods
    // that were attached by setupSimpleList() and setupBlockList()
    const listIds = ['tech-skills-list', 'soft-skills-list', 'certifications-list', 'achievements-list', 'languages-list', 'hobbies-list'];
    listIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const savedRenderItem = el.renderItem;
            el.innerHTML = '';
            el.renderItem = savedRenderItem;
        }
    });
    const blockIds = ['education-blocks', 'work-blocks', 'project-blocks'];
    blockIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const savedRenderBlock = el.renderBlock;
            el.innerHTML = '';
            el.renderBlock = savedRenderBlock;
        }
    });

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
// RENDERING LIVE PREVIEW ENGINE
// ==========================================================================
function updatePreview() {
    const previewContainer = document.getElementById('cv-preview-document');
    if (!previewContainer) return;

    previewContainer.className = `cv-preview-container template-${cvState.selectedTemplate}`;
    previewContainer.innerHTML = '';

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
        case 'academic-classic':
            renderAcademicTemplate(previewContainer);
            break;
    }

    applyFontToPreview();
}

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
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';

    if (cvState.photo) {
        const photoContainer = document.createElement('div');
        photoContainer.className = 'cv-photo-circle';
        photoContainer.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        sidebar.appendChild(photoContainer);
    }

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

    const main = document.createElement('div');
    main.className = 'main-content';

    if (cvState.fullName || cvState.jobTitle) {
        const header = document.createElement('div');
        header.className = 'main-header';
        header.innerHTML = `
            ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
            ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
        `;
        main.appendChild(header);
    }

    if (cvState.careerSummary) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-bullseye"></i> Career Objective</div>
            <p class="cv-item-desc">${cvState.careerSummary}</p>
        `;
        main.appendChild(sec);
    }

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

    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `
            <div class="cv-section-title"><i class="fa-solid fa-diagram-project"></i> Academic Projects</div>
        `;
        cvState.projects.forEach(proj => {
            const ensureHttp = (url) => /^https?:\/\//i.test(url) ? url : 'https://' + url;
            let links = [];
            if (proj.github) links.push(`GitHub: <a href="${ensureHttp(proj.github)}" target="_blank">${proj.github}</a>`);
            if (proj.demo) links.push(`Live: <a href="${ensureHttp(proj.demo)}" target="_blank">${proj.demo}</a>`);
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
    const headerBlock = document.createElement('div');
    headerBlock.className = 'header-block';

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

    const bodyContent = document.createElement('div');
    bodyContent.className = 'body-content';

    if (cvState.careerSummary) {
        bodyContent.innerHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Career Summary</div>
                <p class="cv-item-desc" style="font-family: Georgia, serif; font-style: italic;">${cvState.careerSummary}</p>
            </div>
        `;
    }

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

    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Academic & Personal Projects</div>`;

        cvState.projects.forEach(proj => {
            const ensureHttp = (url) => /^https?:\/\//i.test(url) ? url : 'https://' + url;
            let links = [];
            if (proj.github) links.push(`GitHub: <a href="${ensureHttp(proj.github)}" target="_blank">${proj.github}</a>`);
            if (proj.demo) links.push(`Demo: <a href="${ensureHttp(proj.demo)}" target="_blank">${proj.demo}</a>`);
            const linksStr = links.length > 0 ? ` (${links.join(', ')})` : '';

            sec.innerHTML += `
                <div class="cv-item-block">
                    <div class="cv-item-header">
                        <span>${proj.name}${proj.tech ? ` &ndash; <i>${proj.tech}</i>` : ''}</span>
                    </div>
                    ${linksStr ? `<div class="cv-item-subheader">${linksStr}</div>` : ''}
                    ${proj.desc ? `<p class="cv-item-desc">${proj.desc}</p>` : ''}
                </div>
            `;
        });
        bodyContent.appendChild(sec);
    }

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
    const banner = document.createElement('div');
    banner.className = 'top-banner';

    const bannerInfo = document.createElement('div');
    bannerInfo.className = 'header-info';
    bannerInfo.innerHTML = `
        ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
        ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
    `;
    banner.appendChild(bannerInfo);

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

    const creativeBody = document.createElement('div');
    creativeBody.className = 'creative-body';

    const leftPane = document.createElement('div');
    leftPane.className = 'left-pane';

    if (cvState.careerSummary) {
        leftPane.innerHTML += `
            <div class="cv-section">
                <div class="cv-section-title"><i class="fa-solid fa-user"></i> About Me</div>
                <p class="cv-item-desc">${cvState.careerSummary}</p>
            </div>
        `;
    }

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

    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-terminal"></i> Key Projects</div>`;

        cvState.projects.forEach(proj => {
            const ensureHttp = (url) => /^https?:\/\//i.test(url) ? url : 'https://' + url;
            let links = [];
            if (proj.github) links.push(`<a href="${ensureHttp(proj.github)}" target="_blank"><i class="fa-brands fa-github"></i> Source</a>`);
            if (proj.demo) links.push(`<a href="${ensureHttp(proj.demo)}" target="_blank"><i class="fa-solid fa-laptop"></i> Live</a>`);
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

    const rightPane = document.createElement('div');
    rightPane.className = 'right-pane';

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

    if ((cvState.languages && cvState.languages.length > 0) || (cvState.hobbies && cvState.hobbies.length > 0)) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title"><i class="fa-solid fa-star"></i> More</div>`;

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
    const mainArea = document.createElement('div');
    mainArea.className = 'main-area';

    mainArea.innerHTML = `
        ${cvState.fullName ? `<h1>${cvState.fullName}</h1>` : ''}
        ${cvState.jobTitle ? `<div class="title">${cvState.jobTitle}</div>` : ''}
    `;

    if (cvState.careerSummary) {
        mainArea.innerHTML += `
            <div class="cv-section">
                <div class="cv-section-title">Summary</div>
                <p class="cv-item-desc">${cvState.careerSummary}</p>
            </div>
        `;
    }

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

    if (cvState.projects && cvState.projects.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'cv-section';
        sec.innerHTML = `<div class="cv-section-title">Personal Projects</div>`;
        cvState.projects.forEach(proj => {
            const ensureHttp = (url) => /^https?:\/\//i.test(url) ? url : 'https://' + url;
            let links = [];
            if (proj.github) links.push(`<a href="${ensureHttp(proj.github)}" target="_blank" style="color:#ea580c;">GitHub</a>`);
            if (proj.demo) links.push(`<a href="${ensureHttp(proj.demo)}" target="_blank" style="color:#ea580c;">Demo</a>`);
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

    const sidePane = document.createElement('div');
    sidePane.className = 'side-pane';

    if (cvState.photo) {
        const photoCircle = document.createElement('div');
        photoCircle.className = 'cv-photo-circle';
        photoCircle.innerHTML = `<img src="${cvState.photo}" alt="Profile Photo">`;
        sidePane.appendChild(photoCircle);
    }

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


// RENDER: TEMPLATE 5 - ACADEMIC CLASSIC
// Clean single-column academic CV: centered name header, inline contact row,
// bold+underline section titles, right-aligned dates, italic institution,
// circle-bullet (◦) points, declaration footer.
function renderAcademicTemplate(container) {
    container.style.fontFamily = "'Garamond', 'Georgia', serif";
    container.style.color = '#111';
    container.style.padding = '40px 48px';
    container.style.lineHeight = '1.45';
    container.style.fontSize = '13px';
    container.style.background = '#fff';

    // ── Header: Name ──
    const header = document.createElement('div');
    header.style.cssText = 'text-align:center; margin-bottom:10px;';

    if (cvState.fullName) {
        const h1 = document.createElement('div');
        h1.style.cssText = 'font-size:26px; font-weight:700; letter-spacing:0.5px; margin-bottom:6px; font-family:inherit;';
        h1.textContent = cvState.fullName;
        header.appendChild(h1);
    }

    // Contact row inline with bullet separators
    const contactParts = [];
    if (cvState.email)    contactParts.push('<i class="fa-solid fa-envelope"></i> ' + cvState.email);
    if (cvState.phone)    contactParts.push('<i class="fa-solid fa-phone"></i> ' + cvState.phone);
    if (cvState.linkedin) contactParts.push('<i class="fa-brands fa-linkedin"></i> ' + cvState.linkedin);
    if (cvState.github)   contactParts.push('<i class="fa-brands fa-github"></i> ' + cvState.github);
    const loc = getFormattedLocation();
    if (loc) contactParts.push('<i class="fa-solid fa-location-dot"></i> ' + loc);

    if (contactParts.length > 0) {
        const contactRow = document.createElement('div');
        contactRow.style.cssText = 'font-size:11.5px; color:#222; font-family:"Arial",sans-serif;';
        contactRow.innerHTML = contactParts.join('  &bull;  ');
        header.appendChild(contactRow);
    }
    container.appendChild(header);

    // Helper: add a section block
    const addSection = (title, renderFn) => {
        const section = document.createElement('div');
        section.style.cssText = 'margin-top:14px;';
        const titleEl = document.createElement('div');
        titleEl.style.cssText = 'font-size:13.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; padding-bottom:3px; border-bottom:1.5px solid #111; margin-bottom:8px; font-family:"Arial",sans-serif;';
        titleEl.textContent = title;
        section.appendChild(titleEl);
        renderFn(section);
        container.appendChild(section);
    };

    // Helper: right-float date span
    const makeDateSpan = (text) => {
        const s = document.createElement('span');
        s.style.cssText = 'float:right; font-weight:400; font-size:12px; font-family:"Arial",sans-serif;';
        s.textContent = text;
        return s;
    };
    const clearfix = () => { const d = document.createElement('div'); d.style.clear = 'both'; return d; };

    // Helper: circle-bullet list
    const makeBulletList = (lines) => {
        const ul = document.createElement('ul');
        ul.style.cssText = 'margin:2px 0 0 0; padding-left:0; list-style:none;';
        lines.forEach(line => {
            const li = document.createElement('li');
            li.style.cssText = 'font-size:12.5px; margin-bottom:2px; padding-left:14px; position:relative;';
            li.innerHTML = '<span style="position:absolute;left:0;">\u25e6</span>' + line.trim();
            ul.appendChild(li);
        });
        return ul;
    };

    // ── Professional Objective ──
    if (cvState.careerSummary) {
        addSection('Professional Objective', (sec) => {
            const p = document.createElement('p');
            p.style.cssText = 'margin:0; font-size:12.5px; text-align:justify;';
            p.textContent = cvState.careerSummary;
            sec.appendChild(p);
        });
    }

    // ── Education ──
    if (cvState.education && cvState.education.length > 0) {
        addSection('Education', (sec) => {
            cvState.education.forEach(edu => {
                const row = document.createElement('div');
                row.style.marginBottom = '6px';
                const titleLine = document.createElement('div');
                if (edu.year) titleLine.appendChild(makeDateSpan(edu.year));
                const degSpan = document.createElement('span');
                degSpan.style.fontWeight = '700';
                degSpan.textContent = edu.degree || '';
                titleLine.appendChild(degSpan);
                titleLine.appendChild(clearfix());
                row.appendChild(titleLine);
                if (edu.institution || edu.board) {
                    const subLine = document.createElement('div');
                    subLine.style.cssText = 'font-style:italic; color:#333; font-size:12px;';
                    subLine.textContent = [edu.institution, edu.board].filter(Boolean).join(', ');
                    row.appendChild(subLine);
                }
                if (edu.score) {
                    const scoreLine = document.createElement('div');
                    scoreLine.style.cssText = 'font-size:12px; color:#333;';
                    scoreLine.textContent = 'Grade: ' + edu.score;
                    row.appendChild(scoreLine);
                }
                sec.appendChild(row);
            });
        });
    }

    // ── Internships / Work ──
    if (cvState.work && cvState.work.length > 0) {
        addSection('Internships', (sec) => {
            cvState.work.forEach(job => {
                const block = document.createElement('div');
                block.style.marginBottom = '10px';
                const titleLine = document.createElement('div');
                if (job.duration) titleLine.appendChild(makeDateSpan(job.duration));
                const titleSpan = document.createElement('span');
                titleSpan.style.fontWeight = '700';
                titleSpan.textContent = job.title || '';
                titleLine.appendChild(titleSpan);
                titleLine.appendChild(clearfix());
                block.appendChild(titleLine);
                const compParts = [job.company, job.location].filter(Boolean).join(', ');
                if (compParts) {
                    const compLine = document.createElement('div');
                    compLine.style.cssText = 'font-style:italic; color:#333; font-size:12px; margin-bottom:3px;';
                    compLine.textContent = compParts + ' \u2014';
                    block.appendChild(compLine);
                }
                if (job.desc) {
                    const lines = job.desc.split('\n').filter(l => l.trim());
                    block.appendChild(makeBulletList(lines));
                }
                sec.appendChild(block);
            });
        });
    }

    // ── Projects ──
    if (cvState.projects && cvState.projects.length > 0) {
        addSection('Academic & Personal Projects', (sec) => {
            cvState.projects.forEach(proj => {
                const block = document.createElement('div');
                block.style.marginBottom = '8px';
                const titleLine = document.createElement('div');
                const titleSpan = document.createElement('span');
                titleSpan.style.cssText = 'font-weight:700; font-size:12.5px;';
                titleSpan.textContent = proj.name ? (proj.tech ? proj.name + ' \u2013 ' : proj.name) : '';
                titleLine.appendChild(titleSpan);
                if (proj.tech) {
                    const techSpan = document.createElement('span');
                    techSpan.style.cssText = 'font-style:italic; font-size:12px;';
                    techSpan.textContent = proj.tech;
                    titleLine.appendChild(techSpan);
                }
                block.appendChild(titleLine);
                if (proj.desc) {
                    const lines = proj.desc.split('\n').filter(l => l.trim());
                    block.appendChild(makeBulletList(lines));
                }
                sec.appendChild(block);
            });
        });
    }

    // ── Certifications ──
    if (cvState.certifications && cvState.certifications.length > 0) {
        addSection('Certifications', (sec) => {
            const ul = document.createElement('ul');
            ul.style.cssText = 'margin:0; padding-left:0; list-style:none;';
            cvState.certifications.forEach(cert => {
                const li = document.createElement('li');
                li.style.cssText = 'font-size:12.5px; margin-bottom:4px; padding-left:14px; position:relative;';
                li.innerHTML = '<span style="position:absolute;left:0;">\u25e6</span><strong>' + cert + '</strong>';
                ul.appendChild(li);
            });
            sec.appendChild(ul);
        });
    }

    // ── Skills ──
    const hasSkills = (cvState.techSkills && cvState.techSkills.length > 0) || (cvState.softSkills && cvState.softSkills.length > 0);
    if (hasSkills) {
        addSection('Skills', (sec) => {
            const allSkills = [...(cvState.techSkills || []), ...(cvState.softSkills || [])];
            const p = document.createElement('p');
            p.style.cssText = 'margin:0; font-size:12.5px;';
            p.textContent = allSkills.join('   \u2022   ');
            sec.appendChild(p);
        });
    }

    // ── Achievements ──
    if (cvState.achievements && cvState.achievements.length > 0) {
        addSection('Achievements', (sec) => {
            sec.appendChild(makeBulletList(cvState.achievements));
        });
    }

    // ── Languages & Hobbies ──
    const hasExtra = (cvState.languages && cvState.languages.length > 0) || (cvState.hobbies && cvState.hobbies.length > 0);
    if (hasExtra) {
        addSection('Additional Information', (sec) => {
            if (cvState.languages && cvState.languages.length > 0) {
                const p = document.createElement('p');
                p.style.cssText = 'margin:0 0 4px 0; font-size:12.5px;';
                p.innerHTML = '<strong>Languages:</strong> ' + cvState.languages.join(', ');
                sec.appendChild(p);
            }
            if (cvState.hobbies && cvState.hobbies.length > 0) {
                const p = document.createElement('p');
                p.style.cssText = 'margin:0; font-size:12.5px;';
                p.innerHTML = '<strong>Interests:</strong> ' + cvState.hobbies.join(', ');
                sec.appendChild(p);
            }
        });
    }


}

// ==========================================================================
// IMAGE EXPORT â€” High Resolution PNG Download
//
// Uses html2canvas directly on the live CV element.
// Temporarily removes the CSS transform so the element is captured
// at its natural 794px width, then restores it after download.
// Scale of 3 gives ~2382px wide output â€” sharp on any screen or printer.
// ==========================================================================
// ==========================================================================
// FONT FAMILY & STYLE CONTROLS
// ==========================================================================
function setupFontControls() {
    const fontFamilySelect = document.getElementById('font-family-select');
    const fontStyleSelect = document.getElementById('font-style-select');

    if (fontFamilySelect) {
        fontFamilySelect.value = cvState.cvFont || "'Calibri', 'Gill Sans', sans-serif";
        fontFamilySelect.addEventListener('change', (e) => {
            cvState.cvFont = e.target.value;
            saveStateToLocalStorage();
            applyFontToPreview();
        });
    }

    if (fontStyleSelect) {
        fontStyleSelect.value = cvState.cvFontStyle || 'normal|normal';
        fontStyleSelect.addEventListener('change', (e) => {
            cvState.cvFontStyle = e.target.value;
            saveStateToLocalStorage();
            applyFontToPreview();
        });
    }
}

function applyFontToPreview() {
    const cvEl = document.getElementById('cv-preview-document');
    if (!cvEl) return;

    const font = cvState.cvFont || "'Calibri', 'Gill Sans', sans-serif";
    const styleParts = (cvState.cvFontStyle || 'normal|normal').split('|');
    const fontStyle  = styleParts[0] || 'normal';
    const fontWeight = styleParts[1] || 'normal';

    cvEl.style.fontFamily = font;
    cvEl.style.fontStyle  = fontStyle;
    cvEl.style.fontWeight = fontWeight;
}

function setupExportHandlers() {
    const downloadBtn = document.getElementById('btn-download-pdf');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPDF);
    }
}

async function downloadPDF() {
    const btn = document.getElementById('btn-download-pdf');
    const cvEl = document.getElementById('cv-preview-document');
    const scaleWrapper = document.querySelector('.cv-scale-wrapper');

    if (!btn || !cvEl) {
        alert('CV preview not found.');
        return;
    }

    if (typeof html2canvas === 'undefined') {
        alert('PDF download library is not loaded. Please check your internet connection and reload the page.');
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('PDF generator is not loaded. Please check your internet connection and reload the page.');
        return;
    }

    const fullName = (cvState.fullName || 'craftcv_resume').trim();
    const safeName = fullName.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
    const filename = `resume_${safeName || 'craftcv_resume'}.pdf`;

    const originalBtnHTML = btn.innerHTML;
    const originalDisabled = btn.disabled;
    const originalTransform = scaleWrapper ? scaleWrapper.style.transform : '';

    try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        if (scaleWrapper) {
            scaleWrapper.style.transform = 'none';
        }

        await new Promise(resolve => setTimeout(resolve, 150));

        const canvas = await html2canvas(cvEl, {
            scale: 3,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: false,
            windowWidth: cvEl.scrollWidth,
            windowHeight: cvEl.scrollHeight,
            onclone: (clonedDoc) => {
                const clonedCv = clonedDoc.getElementById('cv-preview-document');

                if (clonedCv) {
                    clonedCv.style.transform = 'none';
                    clonedCv.style.boxShadow = 'none';
                    clonedCv.style.backgroundColor = '#ffffff';
                }

                clonedDoc.querySelectorAll('*').forEach(el => {
                    el.style.webkitPrintColorAdjust = 'exact';
                    el.style.printColorAdjust = 'exact';
                });
            }
        });

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageWidthMM  = pdf.internal.pageSize.getWidth();   // 210mm
        const pageHeightMM = pdf.internal.pageSize.getHeight();  // 297mm

        // How many canvas pixels equal one A4 page height?
        // canvas.width corresponds to pageWidthMM, so:
        const mmPerPx       = pageWidthMM / canvas.width;
        const pageHeightPx  = Math.round(pageHeightMM / mmPerPx);
        const totalHeightMM = canvas.height * mmPerPx;

        if (totalHeightMM <= pageHeightMM) {
            // Single page — fits entirely
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pageWidthMM, totalHeightMM);
        } else {
            // Multi-page: slice the canvas into A4-height strips so no text is cut in half
            let yOffset = 0;
            while (yOffset < canvas.height) {
                const sliceH = Math.min(pageHeightPx, canvas.height - yOffset);

                const slice = document.createElement('canvas');
                slice.width  = canvas.width;
                slice.height = sliceH;
                slice.getContext('2d').drawImage(
                    canvas,
                    0, yOffset, canvas.width, sliceH,   // source rect
                    0, 0,       canvas.width, sliceH    // dest rect
                );

                if (yOffset > 0) pdf.addPage();
                pdf.addImage(slice.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, pageWidthMM, sliceH * mmPerPx);
                yOffset += sliceH;
            }
        }

        pdf.save(filename);

    } catch (err) {
        console.error('PDF export failed:', err);
        alert('PDF generation failed. Please reload the page and try again.');
    } finally {
        if (scaleWrapper) {
            scaleWrapper.style.transform = originalTransform;
        }

        btn.disabled = originalDisabled;
        btn.innerHTML = originalBtnHTML || '<i class="fa-solid fa-file-pdf"></i> Download PDF';
    }
}
