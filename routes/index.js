/**
 * Ella Rises - All Routes
 * Consolidated route file containing all application routes
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { requireAuth, requireManager } = require('../middleware/auth');
// const db = require('../db'); // Will be uncommented when database is ready

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

// Public donation page
router.get('/donate', (req, res) => {
    res.render('public/donate', {
        title: 'Donate - Ella Rises',
        user: req.session.user || null
    });
});

// Donation form submission
router.post('/donate', (req, res) => {
    // TODO: Save donation to database
    const { donor_name, donor_email, amount, payment_method } = req.body;
    
    req.session.messages = [{ 
        type: 'success', 
        text: `Thank you ${donor_name} for your donation of $${amount}! Your contribution makes a difference.` 
    }];
    res.redirect('/donate');
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
        // TODO: Query database for user
        // const user = await db('users').where({ username }).first();
        // if (!user) {
        //     return res.render('auth/login', {
        //         title: 'Login - Ella Rises',
        //         error: 'Invalid username or password',
        //         user: null
        //     });
        // }
        // const validPassword = await bcrypt.compare(password, user.password_hash);
        // if (!validPassword) {
        //     return res.render('auth/login', {
        //         title: 'Login - Ella Rises',
        //         error: 'Invalid username or password',
        //         user: null
        //     });
        // }
        
        // Placeholder authentication - REMOVE when database is connected
        req.session.user = {
            id: 1,
            username: username,
            role: username.toLowerCase().includes('manager') ? 'manager' : 'user',
            email: 'user@example.com'
        };
        
        const returnTo = req.session.returnTo || '/dashboard';
        delete req.session.returnTo;
        res.redirect(returnTo);
        
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

router.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard/index', {
        title: 'Dashboard - Ella Rises',
        user: req.session.user,
        messages: req.session.messages || []
    });
    req.session.messages = [];
});

// ============================================================================
// USER MAINTENANCE ROUTES (Manager only)
// ============================================================================

router.get('/users', requireAuth, requireManager, (req, res) => {
    // TODO: const users = await db('users').select('*').orderBy('created_at', 'desc');
    res.render('manager/users', {
        title: 'User Maintenance - Ella Rises',
        user: req.session.user,
        users: [],
        messages: req.session.messages || []
    });
    req.session.messages = [];
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
    try {
        // TODO: Validate, hash password, insert into database
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
        // TODO: const userData = await db('users').where({ id }).first();
        res.render('manager/users-form', {
            title: 'Edit User - Ella Rises',
            user: req.session.user,
            userData: null
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
    try {
        // TODO: Update user in database
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
        // TODO: await db('users').where({ id }).del();
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

router.get('/participants', (req, res) => {
    // View-only access for everyone (no login required)
    // Managers see manager view, others see user view
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/participants' : 'user/participants';
    
    // TODO: const participants = await db('participants').select('*').orderBy('enrollment_date', 'desc');
    res.render(viewPath, {
        title: 'Participants - Ella Rises',
        user: user,
        participants: [],
        messages: req.session.messages || []
    });
    req.session.messages = [];
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

router.get('/events', (req, res) => {
    // View-only access for everyone (no login required)
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/events' : 'user/events';
    
    // TODO: const events = await db('events').select('*').orderBy('event_date', 'desc');
    res.render(viewPath, {
        title: 'Events - Ella Rises',
        user: user,
        events: [],
        messages: req.session.messages || []
    });
    req.session.messages = [];
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

router.get('/surveys', (req, res) => {
    // View-only access for everyone (no login required)
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/surveys' : 'user/surveys';
    
    // TODO: const surveys = await db('surveys')
    //     .join('participants', 'surveys.participant_id', 'participants.id')
    //     .join('events', 'surveys.event_id', 'events.id')
    //     .select('surveys.*', 'participants.first_name', 'participants.last_name', 'events.event_name')
    //     .orderBy('survey_date', 'desc');
    res.render(viewPath, {
        title: 'Post-Event Surveys - Ella Rises',
        user: user,
        surveys: [],
        messages: req.session.messages || []
    });
    req.session.messages = [];
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

router.get('/milestones', (req, res) => {
    // View-only access for everyone (no login required)
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/milestones' : 'user/milestones';
    
    // TODO: const milestones = await db('milestones')
    //     .join('participants', 'milestones.participant_id', 'participants.id')
    //     .select('milestones.*', 'participants.first_name', 'participants.last_name')
    //     .orderBy('achievement_date', 'desc');
    res.render(viewPath, {
        title: 'Milestones - Ella Rises',
        user: user,
        milestones: [],
        messages: req.session.messages || []
    });
    req.session.messages = [];
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

router.get('/donations', (req, res) => {
    // View-only access for everyone (no login required)
    const user = req.session.user || null;
    const isManager = user && user.role === 'manager';
    const viewPath = isManager ? 'manager/donations' : 'user/donations';
    
    // TODO: const donations = await db('donations').select('*').orderBy('donation_date', 'desc');
    res.render(viewPath, {
        title: 'Donations - Ella Rises',
        user: user,
        donations: [],
        messages: req.session.messages || []
    });
    req.session.messages = [];
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

