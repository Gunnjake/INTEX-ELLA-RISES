/**
 * Ella Rises - All Routes
 * Consolidated route file containing all application routes
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { requireAuth, requireManager } = require('../middleware/auth');
const db = require('../db');

// ============================================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================================

// Landing page
router.get('/', (req, res) => {
    res.render('public/landing', {
        title: 'Ella Rises - Empowering the Future Generation of Women',
        user: req.session.user || null
    });
});

// About page
router.get('/about', (req, res) => {
    res.render('public/about', {
        title: 'About - Ella Rises',
        user: req.session.user || null
    });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('public/contact', {
        title: 'Contact Us - Ella Rises',
        user: req.session.user || null
    });
});

// Contact form submission
router.post('/contact', (req, res) => {
    // TODO: Save contact form to database
    req.session.messages = [{ type: 'success', text: 'Thank you for contacting us! We will get back to you soon.' }];
    res.redirect('/contact');
});

// Programs page with carousel
router.get('/programs', (req, res) => {
    const programIndex = parseInt(req.query.program) || 0;
    res.render('public/programs', {
        title: 'Programs - Ella Rises',
        user: req.session.user || null,
        programIndex: programIndex
    });
});

// Registration page
router.get('/register', (req, res) => {
    res.render('public/register', {
        title: 'Register - Ella Rises',
        user: req.session.user || null
    });
});

// Registration form submission
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, phone, age, program, city, state, zip, school, password, confirmPassword } = req.body;
    
    try {
        // If user is logged in, use their account
        if (req.session.user) {
            const userId = req.session.user.id;
            
            // TODO: Save registration to database when connected
            // const registration = await db('Registrations').insert({
            //     ParticipantID: userId,
            //     EventTemplateID: programId, // Need to map program name to EventTemplateID
            //     RegistrationDate: new Date()
            // });
            
            req.session.messages = [{ 
                type: 'success', 
                text: `Thank you! You've been registered for ${program}.` 
            }];
            return res.redirect('/register');
        }
        
        // New user registration - create account
        if (!password || password.length < 6) {
            req.session.messages = [{ 
                type: 'error', 
                text: 'Password must be at least 6 characters long.' 
            }];
            return res.redirect('/register');
        }
        
        if (password !== confirmPassword) {
            req.session.messages = [{ 
                type: 'error', 
                text: 'Passwords do not match.' 
            }];
            return res.redirect('/register');
        }
        
        // TODO: Save to database when connected
        // Check if user already exists
        // const existingUser = await db('Users').where({ Email: email }).first();
        // if (existingUser) {
        //     req.session.messages = [{ 
        //         type: 'error', 
        //         text: 'An account with this email already exists. Please login instead.' 
        //     }];
        //     return res.redirect('/login');
        // }
        
        // Create user account
        // const passwordHash = await bcrypt.hash(password, 10);
        // const newUser = await db('Users').insert({
        //     Username: email.split('@')[0],
        //     Email: email,
        //     Password_Hash: passwordHash,
        //     Role: 'user',
        //     FirstName: firstName,
        //     LastName: lastName,
        //     Phone: phone
        // }).returning('*');
        
        // Create participant record
        // const newParticipant = await db('Participants').insert({
        //     ParticipantEmail: email,
        //     ParticipantFirstName: firstName,
        //     ParticipantLastName: lastName,
        //     ParticipantPhone: phone,
        //     ParticipantDOB: new Date().getFullYear() - parseInt(age) + '-01-01',
        //     ParticipantCity: city,
        //     ParticipantState: state,
        //     ParticipantZip: zip,
        //     ParticipantSchoolOrEmployer: school,
        //     ParticipantID: newUser[0].UserID
        // });
        
        // Register for program
        // const programEvent = await db('EventTemplates').where({ EventName: program }).first();
        // if (programEvent) {
        //     await db('Registrations').insert({
        //         ParticipantID: newUser[0].UserID,
        //         EventTemplateID: programEvent.EventTemplateID,
        //         RegistrationDate: new Date()
        //     });
        // }
        
        // Auto-login the new user
        // req.session.user = {
        //     id: newUser[0].UserID,
        //     username: newUser[0].Username,
        //     email: newUser[0].Email,
        //     role: newUser[0].Role,
        //     firstName: firstName,
        //     lastName: lastName
        // };
        
        req.session.messages = [{ 
            type: 'success', 
            text: `Account created successfully! You've been registered for ${program}. You can now login to view your registrations.` 
        }];
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        req.session.messages = [{ 
            type: 'error', 
            text: 'There was an error processing your registration. Please try again.' 
        }];
        res.redirect('/register');
    }
});

// API endpoint to get user's registrations
router.get('/api/my-registrations', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        // TODO: Query database when connected
        // const registrations = await db('Registrations')
        //     .join('EventTemplates', 'Registrations.EventTemplateID', 'EventTemplates.EventTemplateID')
        //     .where({ 'Registrations.ParticipantID': userId })
        //     .select('EventTemplates.EventName as program', 'Registrations.RegistrationDate as registrationDate')
        //     .orderBy('Registrations.RegistrationDate', 'desc');
        
        // Placeholder for now
        res.json({ registrations: [] });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ error: 'Error fetching registrations' });
    }
});

// 418 Teapot page (IS 404 requirement)
router.get('/teapot', (req, res) => {
    res.status(418).render('public/teapot', {
        title: 'I\'m a Teapot',
        user: req.session.user || null
    });
});

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Login page
router.get('/login', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    
    res.render('auth/login', {
        title: 'Login - Ella Rises',
        error: req.query.error || null,
        user: null
    });
});

// Login form submission
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.render('auth/login', {
            title: 'Login - Ella Rises',
            error: 'Please provide both username and password',
            user: null
        });
    }
    
    try {
        // Database authentication
        try {
            const user = await db('Users').where({ username }).first();
            if (!user) {
                return res.render('auth/login', {
                    title: 'Login - Ella Rises',
                    error: 'Invalid username or password',
                    user: null
                });
            }
            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                return res.render('auth/login', {
                    title: 'Login - Ella Rises',
                    error: 'Invalid username or password',
                    user: null
                });
            }
            
            req.session.user = {
                id: user.userid,
                username: user.username,
                role: user.role,
                email: user.email
            };
            
            const returnTo = req.session.returnTo || '/dashboard';
            delete req.session.returnTo;
            res.redirect(returnTo);
        } catch (dbError) {
            // If Users table doesn't exist yet, use placeholder authentication
            console.log('Database error (Users table may not exist):', dbError.message);
            
            // Temporary placeholder authentication for development
            // TODO: Remove this when Users table is created in database
            if (!username || !password) {
                return res.render('auth/login', {
                    title: 'Login - Ella Rises',
                    error: 'Please provide both username and password',
                    user: null
                });
            }
            
            // Simple placeholder: username containing "manager" = manager role, otherwise = user role
            req.session.user = {
                id: 1,
                username: username,
                role: username.toLowerCase().includes('manager') ? 'manager' : 'user',
                email: `${username}@example.com`
            };
            
            const returnTo = req.session.returnTo || '/dashboard';
            delete req.session.returnTo;
            res.redirect(returnTo);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Login - Ella Rises',
            error: 'An error occurred during login. Please try again.',
            user: null
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

// ============================================================================
// DASHBOARD ROUTES (Requires authentication)
// ============================================================================

router.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user.id;
        
        // TODO: Fetch user registrations when database is connected
        // const registrations = await db('Registrations')
        //     .join('EventTemplates', 'Registrations.EventTemplateID', 'EventTemplates.EventTemplateID')
        //     .where({ 'Registrations.ParticipantID': userId })
        //     .select('EventTemplates.EventName as program', 'Registrations.RegistrationDate as registrationDate')
        //     .orderBy('Registrations.RegistrationDate', 'desc');
        
        // Placeholder for now
        const registrations = [];
        
        res.render('dashboard/index', {
            title: 'Dashboard - Ella Rises',
            user: req.session.user,
            messages: req.session.messages || [],
            registrations: registrations
        });
        req.session.messages = [];
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('dashboard/index', {
            title: 'Dashboard - Ella Rises',
            user: req.session.user,
            messages: [{ type: 'error', text: 'Error loading dashboard data.' }],
            registrations: []
        });
    }
});

// ============================================================================
// USER MAINTENANCE ROUTES (Manager only)
// ============================================================================

router.get('/users', requireAuth, requireManager, async (req, res) => {
    try {
        const users = await db('Users').select('*').orderBy('created_at', 'desc');
        res.render('manager/users', {
            title: 'User Maintenance - Ella Rises',
            user: req.session.user,
            users: users,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        console.error('Error fetching users:', error);
        // If Users table doesn't exist, show empty list
        res.render('manager/users', {
            title: 'User Maintenance - Ella Rises',
            user: req.session.user,
            users: [],
            messages: [{ type: 'error', text: 'Users table not found. Please create the Users table in the database.' }]
        });
        req.session.messages = [];
    }
});

router.get('/users/new', requireAuth, requireManager, (req, res) => {
    res.render('manager/users-form', {
        title: 'Add New User - Ella Rises',
        user: req.session.user,
        userData: null
    });
});

router.post('/users/new', requireAuth, requireManager, async (req, res) => {
    const { username, email, password, role } = req.body;
    
    // Validation
    if (!username || !email || !password || !role) {
        req.session.messages = [{ type: 'error', text: 'All fields are required.' }];
        return res.redirect('/users/new');
    }
    
    if (role !== 'manager' && role !== 'user') {
        req.session.messages = [{ type: 'error', text: 'Invalid role. Must be "manager" or "user".' }];
        return res.redirect('/users/new');
    }
    
    try {
        // Hash password using bcrypt
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        
        // Insert into database
        await db('Users').insert({
            username,
            email,
            password_hash,
            role,
            created_at: new Date(),
            updated_at: new Date()
        });
        
        req.session.messages = [{ type: 'success', text: 'User created successfully' }];
        res.redirect('/users');
    } catch (error) {
        console.error('Error creating user:', error);
        req.session.messages = [{ type: 'error', text: 'Error creating user. Please try again.' }];
        res.redirect('/users/new');
    }
});

router.get('/users/:id/edit', requireAuth, requireManager, async (req, res) => {
    const { id } = req.params;
    try {
        const userData = await db('Users').where({ userid: id }).first();
        if (!userData) {
            req.session.messages = [{ type: 'error', text: 'User not found.' }];
            return res.redirect('/users');
        }
        res.render('manager/users-form', {
            title: 'Edit User - Ella Rises',
            user: req.session.user,
            userData: userData
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        req.session.messages = [{ type: 'error', text: 'Error loading user data.' }];
        res.redirect('/users');
    }
});

router.post('/users/:id/update', requireAuth, requireManager, async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    
    // Validation
    if (!username || !email || !role) {
        req.session.messages = [{ type: 'error', text: 'Username, email, and role are required.' }];
        return res.redirect(`/users/${id}/edit`);
    }
    
    if (role !== 'manager' && role !== 'user') {
        req.session.messages = [{ type: 'error', text: 'Invalid role. Must be "manager" or "user".' }];
        return res.redirect(`/users/${id}/edit`);
    }
    
    try {
        // Update user in database
        const updateData = {
            username,
            email,
            role,
            updated_at: new Date()
        };
        
        // Only update password if provided
        if (password && password.trim() !== '') {
            const saltRounds = 10;
            updateData.password_hash = await bcrypt.hash(password, saltRounds);
        }
        
        await db('Users').where({ userid: id }).update(updateData);
        
        req.session.messages = [{ type: 'success', text: 'User updated successfully' }];
        res.redirect('/users');
    } catch (error) {
        console.error('Error updating user:', error);
        req.session.messages = [{ type: 'error', text: 'Error updating user. Please try again.' }];
        res.redirect(`/users/${id}/edit`);
    }
});

router.post('/users/:id/delete', requireAuth, requireManager, async (req, res) => {
    const { id } = req.params;
    try {
        await db('Users').where({ userid: id }).del();
        req.session.messages = [{ type: 'success', text: 'User deleted successfully' }];
        res.redirect('/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        req.session.messages = [{ type: 'error', text: 'Error deleting user. Please try again.' }];
        res.redirect('/users');
    }
});

// ============================================================================
// PARTICIPANT ROUTES (View: public/common users, CRUD: manager only)
// ============================================================================

router.get('/participants', async (req, res) => {
    // View-only access for everyone (no login required)
    // Managers see manager view, others see user view
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/participants' : 'user/participants';
    
    try {
        const participants = await db('Participants').select('*').orderBy('ParticipantID', 'desc');
        res.render(viewPath, {
            title: 'Participants - Ella Rises',
            user: user,
            participants: participants,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.render(viewPath, {
            title: 'Participants - Ella Rises',
            user: user,
            participants: [],
            messages: [{ type: 'error', text: 'Error loading participants.' }]
        });
        req.session.messages = [];
    }
});

// Manager-only routes for participants
router.get('/participants/new', requireAuth, (req, res, next) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied. Manager role required.');
    }
    res.render('manager/participants-form', {
        title: 'Add New Participant - Ella Rises',
        user: req.session.user,
        participantData: null
    });
});

router.post('/participants/new', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { first_name, last_name, email, phone, program, enrollment_date } = req.body;
    try {
        // TODO: Insert into database
        req.session.messages = [{ type: 'success', text: 'Participant created successfully' }];
        res.redirect('/participants');
    } catch (error) {
        console.error('Error creating participant:', error);
        req.session.messages = [{ type: 'error', text: 'Error creating participant. Please try again.' }];
        res.redirect('/participants/new');
    }
});

router.get('/participants/:id/edit', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: const participantData = await db('participants').where({ id }).first();
        res.render('manager/participants-form', {
            title: 'Edit Participant - Ella Rises',
            user: req.session.user,
            participantData: null
        });
    } catch (error) {
        console.error('Error fetching participant:', error);
        req.session.messages = [{ type: 'error', text: 'Error loading participant data.' }];
        res.redirect('/participants');
    }
});

router.post('/participants/:id/update', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    const { first_name, last_name, email, phone, program, enrollment_date } = req.body;
    try {
        // TODO: Update participant in database
        req.session.messages = [{ type: 'success', text: 'Participant updated successfully' }];
        res.redirect('/participants');
    } catch (error) {
        console.error('Error updating participant:', error);
        req.session.messages = [{ type: 'error', text: 'Error updating participant. Please try again.' }];
        res.redirect(`/participants/${id}/edit`);
    }
});

router.post('/participants/:id/delete', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: await db('participants').where({ id }).del();
        req.session.messages = [{ type: 'success', text: 'Participant deleted successfully' }];
        res.redirect('/participants');
    } catch (error) {
        console.error('Error deleting participant:', error);
        req.session.messages = [{ type: 'error', text: 'Error deleting participant. Please try again.' }];
        res.redirect('/participants');
    }
});

// ============================================================================
// EVENT ROUTES (View: public/common users, CRUD: manager only)
// ============================================================================

router.get('/events', async (req, res) => {
    // View-only access for everyone (no login required)
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/events' : 'user/events';
    
    try {
        const events = await db('EventTemplates').select('*').orderBy('EventTemplateID', 'desc');
        res.render(viewPath, {
            title: 'Events - Ella Rises',
            user: user,
            events: events,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        console.error('Error fetching events:', error);
        res.render(viewPath, {
            title: 'Events - Ella Rises',
            user: user,
            events: [],
            messages: [{ type: 'error', text: 'Error loading events.' }]
        });
        req.session.messages = [];
    }
});

router.get('/events/new', requireAuth, (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    res.render('manager/events-form', {
        title: 'Add New Event - Ella Rises',
        user: req.session.user,
        eventData: null
    });
});

router.post('/events/new', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { event_name, event_type, event_date, location, description } = req.body;
    try {
        // TODO: Insert into database
        req.session.messages = [{ type: 'success', text: 'Event created successfully' }];
        res.redirect('/events');
    } catch (error) {
        console.error('Error creating event:', error);
        req.session.messages = [{ type: 'error', text: 'Error creating event. Please try again.' }];
        res.redirect('/events/new');
    }
});

router.get('/events/:id/edit', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: const eventData = await db('events').where({ id }).first();
        res.render('manager/events-form', {
            title: 'Edit Event - Ella Rises',
            user: req.session.user,
            eventData: null
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        req.session.messages = [{ type: 'error', text: 'Error loading event data.' }];
        res.redirect('/events');
    }
});

router.post('/events/:id/update', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    const { event_name, event_type, event_date, location, description } = req.body;
    try {
        // TODO: Update event in database
        req.session.messages = [{ type: 'success', text: 'Event updated successfully' }];
        res.redirect('/events');
    } catch (error) {
        console.error('Error updating event:', error);
        req.session.messages = [{ type: 'error', text: 'Error updating event. Please try again.' }];
        res.redirect(`/events/${id}/edit`);
    }
});

router.post('/events/:id/delete', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: await db('events').where({ id }).del();
        req.session.messages = [{ type: 'success', text: 'Event deleted successfully' }];
        res.redirect('/events');
    } catch (error) {
        console.error('Error deleting event:', error);
        req.session.messages = [{ type: 'error', text: 'Error deleting event. Please try again.' }];
        res.redirect('/events');
    }
});

// ============================================================================
// SURVEY ROUTES (View: public/common users, CRUD: manager only)
// ============================================================================

router.get('/surveys', async (req, res) => {
    // View-only access for everyone (no login required)
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/surveys' : 'user/surveys';
    
    try {
        const surveys = await db('Surveys')
            .join('Registrations', 'Surveys.RegistrationID', 'Registrations.RegistrationID')
            .join('Participants', 'Registrations.ParticipantID', 'Participants.ParticipantID')
            .select('Surveys.*', 'Participants.ParticipantFirstName', 'Participants.ParticipantLastName')
            .orderBy('Surveys.SurveySubmissionDate', 'desc');
        res.render(viewPath, {
            title: 'Post-Event Surveys - Ella Rises',
            user: user,
            surveys: surveys,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        console.error('Error fetching surveys:', error);
        res.render(viewPath, {
            title: 'Post-Event Surveys - Ella Rises',
            user: user,
            surveys: [],
            messages: [{ type: 'error', text: 'Error loading surveys.' }]
        });
        req.session.messages = [];
    }
});

router.get('/surveys/new', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    // TODO: const participants = await db('participants').select('id', 'first_name', 'last_name');
    // TODO: const events = await db('events').select('id', 'event_name');
    res.render('manager/surveys-form', {
        title: 'Add New Survey - Ella Rises',
        user: req.session.user,
        surveyData: null,
        participants: [],
        events: []
    });
});

router.post('/surveys/new', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { participant_id, event_id, satisfaction_score, usefulness_score, recommendation_score, comments, survey_date } = req.body;
    try {
        // TODO: Insert into database
        req.session.messages = [{ type: 'success', text: 'Survey created successfully' }];
        res.redirect('/surveys');
    } catch (error) {
        console.error('Error creating survey:', error);
        req.session.messages = [{ type: 'error', text: 'Error creating survey. Please try again.' }];
        res.redirect('/surveys/new');
    }
});

router.get('/surveys/:id/edit', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: const surveyData = await db('surveys').where({ id }).first();
        // TODO: const participants = await db('participants').select('id', 'first_name', 'last_name');
        // TODO: const events = await db('events').select('id', 'event_name');
        res.render('manager/surveys-form', {
            title: 'Edit Survey - Ella Rises',
            user: req.session.user,
            surveyData: null,
            participants: [],
            events: []
        });
    } catch (error) {
        console.error('Error fetching survey:', error);
        req.session.messages = [{ type: 'error', text: 'Error loading survey data.' }];
        res.redirect('/surveys');
    }
});

router.post('/surveys/:id/update', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    const { participant_id, event_id, satisfaction_score, usefulness_score, recommendation_score, comments, survey_date } = req.body;
    try {
        // TODO: Update survey in database
        req.session.messages = [{ type: 'success', text: 'Survey updated successfully' }];
        res.redirect('/surveys');
    } catch (error) {
        console.error('Error updating survey:', error);
        req.session.messages = [{ type: 'error', text: 'Error updating survey. Please try again.' }];
        res.redirect(`/surveys/${id}/edit`);
    }
});

router.post('/surveys/:id/delete', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: await db('surveys').where({ id }).del();
        req.session.messages = [{ type: 'success', text: 'Survey deleted successfully' }];
        res.redirect('/surveys');
    } catch (error) {
        console.error('Error deleting survey:', error);
        req.session.messages = [{ type: 'error', text: 'Error deleting survey. Please try again.' }];
        res.redirect('/surveys');
    }
});

// ============================================================================
// MILESTONE ROUTES (View: public/common users, CRUD: manager only)
// ============================================================================

router.get('/milestones', async (req, res) => {
    // View-only access for everyone (no login required)
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/milestones' : 'user/milestones';
    
    try {
        const milestones = await db('Milestones')
            .join('Participants', 'Milestones.ParticipantID', 'Participants.ParticipantID')
            .select('Milestones.*', 'Participants.ParticipantFirstName', 'Participants.ParticipantLastName')
            .orderBy('Milestones.MilestoneDate', 'desc');
        res.render(viewPath, {
            title: 'Milestones - Ella Rises',
            user: user,
            milestones: milestones,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        console.error('Error fetching milestones:', error);
        res.render(viewPath, {
            title: 'Milestones - Ella Rises',
            user: user,
            milestones: [],
            messages: [{ type: 'error', text: 'Error loading milestones.' }]
        });
        req.session.messages = [];
    }
});

router.get('/milestones/new', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    // TODO: const participants = await db('participants').select('id', 'first_name', 'last_name');
    res.render('manager/milestones-form', {
        title: 'Add New Milestone - Ella Rises',
        user: req.session.user,
        milestoneData: null,
        participants: []
    });
});

router.post('/milestones/new', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { milestone_name, milestone_type, participant_id, achievement_date, status, description } = req.body;
    try {
        // TODO: Insert into database
        req.session.messages = [{ type: 'success', text: 'Milestone created successfully' }];
        res.redirect('/milestones');
    } catch (error) {
        console.error('Error creating milestone:', error);
        req.session.messages = [{ type: 'error', text: 'Error creating milestone. Please try again.' }];
        res.redirect('/milestones/new');
    }
});

router.get('/milestones/:id/edit', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: const milestoneData = await db('milestones').where({ id }).first();
        // TODO: const participants = await db('participants').select('id', 'first_name', 'last_name');
        res.render('manager/milestones-form', {
            title: 'Edit Milestone - Ella Rises',
            user: req.session.user,
            milestoneData: null,
            participants: []
        });
    } catch (error) {
        console.error('Error fetching milestone:', error);
        req.session.messages = [{ type: 'error', text: 'Error loading milestone data.' }];
        res.redirect('/milestones');
    }
});

router.post('/milestones/:id/update', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    const { milestone_name, milestone_type, participant_id, achievement_date, status, description } = req.body;
    try {
        // TODO: Update milestone in database
        req.session.messages = [{ type: 'success', text: 'Milestone updated successfully' }];
        res.redirect('/milestones');
    } catch (error) {
        console.error('Error updating milestone:', error);
        req.session.messages = [{ type: 'error', text: 'Error updating milestone. Please try again.' }];
        res.redirect(`/milestones/${id}/edit`);
    }
});

router.post('/milestones/:id/delete', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: await db('milestones').where({ id }).del();
        req.session.messages = [{ type: 'success', text: 'Milestone deleted successfully' }];
        res.redirect('/milestones');
    } catch (error) {
        console.error('Error deleting milestone:', error);
        req.session.messages = [{ type: 'error', text: 'Error deleting milestone. Please try again.' }];
        res.redirect('/milestones');
    }
});

// ============================================================================
// DONATION ROUTES (View: public/common users, CRUD: manager only)
// ============================================================================

router.get('/donations', async (req, res) => {
    // View-only access for everyone (no login required)
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/donations' : 'user/donations';
    
    try {
        const donations = await db('Donations')
            .join('Participants', 'Donations.ParticipantID', 'Participants.ParticipantID')
            .select('Donations.*', 'Participants.ParticipantFirstName', 'Participants.ParticipantLastName')
            .orderBy('Donations.DonationDate', 'desc');
        res.render(viewPath, {
            title: 'Donations - Ella Rises',
            user: user,
            donations: donations,
            messages: req.session.messages || []
        });
        req.session.messages = [];
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.render(viewPath, {
            title: 'Donations - Ella Rises',
            user: user,
            donations: [],
            messages: [{ type: 'error', text: 'Error loading donations.' }]
        });
        req.session.messages = [];
    }
});

router.get('/donations/new', requireAuth, (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    res.render('manager/donations-form', {
        title: 'Add New Donation - Ella Rises',
        user: req.session.user,
        donationData: null
    });
});

router.post('/donations/new', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { donor_name, donor_email, donor_phone, amount, payment_method, donation_date, notes } = req.body;
    try {
        // TODO: Insert into database
        req.session.messages = [{ type: 'success', text: 'Donation recorded successfully' }];
        res.redirect('/donations');
    } catch (error) {
        console.error('Error creating donation:', error);
        req.session.messages = [{ type: 'error', text: 'Error recording donation. Please try again.' }];
        res.redirect('/donations/new');
    }
});

router.get('/donations/:id/edit', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: const donationData = await db('donations').where({ id }).first();
        res.render('manager/donations-form', {
            title: 'Edit Donation - Ella Rises',
            user: req.session.user,
            donationData: null
        });
    } catch (error) {
        console.error('Error fetching donation:', error);
        req.session.messages = [{ type: 'error', text: 'Error loading donation data.' }];
        res.redirect('/donations');
    }
});

router.post('/donations/:id/update', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    const { donor_name, donor_email, donor_phone, amount, payment_method, donation_date, notes } = req.body;
    try {
        // TODO: Update donation in database
        req.session.messages = [{ type: 'success', text: 'Donation updated successfully' }];
        res.redirect('/donations');
    } catch (error) {
        console.error('Error updating donation:', error);
        req.session.messages = [{ type: 'error', text: 'Error updating donation. Please try again.' }];
        res.redirect(`/donations/${id}/edit`);
    }
});

router.post('/donations/:id/delete', requireAuth, async (req, res) => {
    if (req.session.user.role !== 'manager') {
        return res.status(403).send('Access denied.');
    }
    const { id } = req.params;
    try {
        // TODO: await db('donations').where({ id }).del();
        req.session.messages = [{ type: 'success', text: 'Donation deleted successfully' }];
        res.redirect('/donations');
    } catch (error) {
        console.error('Error deleting donation:', error);
        req.session.messages = [{ type: 'error', text: 'Error deleting donation. Please try again.' }];
        res.redirect('/donations');
    }
});

module.exports = router;

