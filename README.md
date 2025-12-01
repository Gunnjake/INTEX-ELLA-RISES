# INTEX-ELLA-RISES
Intex Project for section 4 group 4

## Project Overview

Ella Rises web application for managing participants, events, surveys, milestones, and donations. The application includes role-based access control (Manager and Common User) and a public-facing landing page for donors.

## Project Structure

```
INTEX-ELLA-RISES/
├── server.js                 # Main Express server file
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── middleware/
│   └── auth.js              # Authentication and authorization middleware
├── routes/
│   ├── public.js            # Public routes (landing, about, contact, donate)
│   ├── auth.js              # Authentication routes (login, logout)
│   ├── dashboard.js         # Dashboard routes
│   ├── users.js             # User maintenance routes (manager only)
│   ├── participants.js      # Participant routes
│   ├── events.js            # Event routes
│   ├── surveys.js           # Survey routes
│   ├── milestones.js        # Milestone routes
│   └── donations.js         # Donation routes
├── views/
│   ├── partials/
│   │   ├── header.ejs       # Header partial with navigation
│   │   └── footer.ejs       # Footer partial
│   ├── public/              # Public pages (no authentication)
│   │   ├── landing.ejs
│   │   ├── about.ejs
│   │   ├── contact.ejs
│   │   ├── donate.ejs
│   │   └── teapot.ejs       # 418 status code page
│   ├── auth/
│   │   └── login.ejs
│   ├── manager/             # Manager pages (full CRUD)
│   │   ├── users.ejs
│   │   ├── users-form.ejs
│   │   ├── participants.ejs
│   │   ├── participants-form.ejs
│   │   ├── events.ejs
│   │   ├── events-form.ejs
│   │   ├── surveys.ejs
│   │   ├── surveys-form.ejs
│   │   ├── milestones.ejs
│   │   ├── milestones-form.ejs
│   │   ├── donations.ejs
│   │   └── donations-form.ejs
│   ├── user/                # Common user pages (view only)
│   │   ├── participants.ejs
│   │   ├── events.ejs
│   │   ├── surveys.ejs
│   │   ├── milestones.ejs
│   │   └── donations.ejs
│   ├── dashboard/
│   │   └── index.ejs        # Dashboard placeholder (Tableau will be embedded)
│   └── error.ejs            # Error page
├── public/
│   ├── css/
│   │   └── style.css        # Main stylesheet with Ella Rises color scheme
│   ├── js/
│   │   └── main.js          # Client-side JavaScript
│   └── images/               # Images (logo, etc.)
└── db/
    └── index.js             # Database connection (placeholder)

```

## Features

### Public Pages
- **Landing Page**: Welcome page explaining Ella Rises mission and programs
- **About**: Information about the organization
- **Contact**: Contact form
- **Donate**: Public donation form for visitors
- **418 Teapot**: HTTP 418 status code page (IS 404 requirement)

### Authentication
- Login system with role-based access (Manager or Common User)
- Session management
- Protected routes with authentication middleware

### Manager Features (Full CRUD)
- **User Maintenance**: Create, read, update, delete user accounts
- **Participants**: Manage participant information
- **Events**: Manage events and workshops
- **Surveys**: Manage post-event survey responses
- **Milestones**: Create and assign milestones to participants (1 to many relationship)
- **Donations**: Manage donation records
- **Dashboard**: View analytics and KPIs (Tableau will be embedded)

### Common User Features (View Only)
- View participants, events, surveys, milestones, and donations
- Search functionality on all list pages
- No edit/delete capabilities

### Search Functionality
- All list pages include search functionality
- Client-side filtering for instant results

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Gunnjake/INTEX-ELLA-RISES.git
cd INTEX-ELLA-RISES
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

## Database Setup

The database connection is currently a placeholder. When the database is ready:

1. Update `db/index.js` with your database configuration
2. Uncomment database queries in route files (marked with `// TODO:`)
3. Create Knex migration files if using Knex
4. Run migrations to set up database schema

## Routes

### Public Routes
- `GET /` - Landing page
- `GET /about` - About page
- `GET /contact` - Contact page
- `POST /contact` - Submit contact form
- `GET /donate` - Donation page
- `POST /donate` - Submit donation
- `GET /teapot` - 418 status code page
- `GET /login` - Login page
- `POST /login` - Login form submission
- `GET /logout` - Logout

### Protected Routes (Require Authentication)
- `GET /dashboard` - Dashboard
- `GET /participants` - List participants
- `GET /events` - List events
- `GET /surveys` - List surveys
- `GET /milestones` - List milestones
- `GET /donations` - List donations

### Manager-Only Routes
- `GET /users` - List users
- `GET /users/new` - Add user form
- `POST /users/new` - Create user
- `GET /users/:id/edit` - Edit user form
- `POST /users/:id/update` - Update user
- `POST /users/:id/delete` - Delete user

Similar CRUD routes exist for participants, events, surveys, milestones, and donations.

## Color Scheme

The website uses a color scheme based on the Ella Rises brand:
- Primary Orange: `#FF6B35`
- Secondary Orange: `#FF8C42`
- Warm Orange: `#FFA07A`
- Dark Orange: `#D84315`
- Dark Brown: `#5D4037`

## Dependencies

- **express**: Web framework
- **ejs**: Template engine
- **knex**: SQL query builder (for database)
- **pg**: PostgreSQL client (or mysql2 for MySQL)
- **express-session**: Session management
- **multer**: File upload handling
- **bcrypt**: Password hashing
- **helmet**: Security headers
- **csurf**: CSRF protection
- **connect-flash**: Flash messages
- **dotenv**: Environment variables

## Development Notes

- All database queries are currently commented out with `// TODO:` markers
- Authentication uses placeholder logic (accepts any username/password)
- Forms are set up but don't save to database yet
- Dashboard is a placeholder for Tableau embedding
- Search functionality works client-side on the frontend

## Next Steps

1. Connect database when SQL script is ready
2. Implement actual authentication with database
3. Add database queries to all routes
4. Embed Tableau dashboard
5. Deploy to AWS (handled by another team member)

## Team Members

Section 4, Group 4

## License

ISC