<<<<<<< HEAD
# Society Clean-Up 🌿

A complete, responsive, database-connected web application built for the school subject **Community Connect**.

The website empowers residents to maintain a clean society by reporting dirty spots, volunteering for community clean-up drives, and learning waste segregation habits. It features an integrated Supabase backend with Row-Level Security (RLS), Supabase Auth, and Supabase Storage for Before & After photos.

---

## 🎨 Theme & Color Palette

- **Forest Green**: `#2C5F2D` (Primary Brand & Navigation)
- **Moss Green**: `#97BC62` (Accent Badges & Icons)
- **White**: `#FFFFFF` (Clean Backgrounds & Cards)
- **Dark Text**: `#263326` (Typography)
- **Light Green**: `#EEF5E8` (Section & Card Backgrounds)

---

## 🛠️ Technology Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS & Vanilla CSS
- **Icons**: Lucide React
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (Admin login)
- **Storage**: Supabase Storage (`gallery-images` bucket)

---

## 🚀 Step-by-Step Setup Guide

Follow these beginner-friendly steps to set up and run the project:

### 1. Install Project Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

---

### 2. Create a Supabase Project

1. Visit [supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project**.
3. Choose your organization, assign a project name (e.g. `society-clean-up`), and create a secure database password.
4. Select your preferred region and click **Create new project**.

---

### 3. Run the Database Schema

1. Open your Supabase project dashboard.
2. Navigate to **SQL Editor** from the left navigation bar.
3. Open the file [`supabase/schema.sql`](supabase/schema.sql) in this repository and copy all its contents.
4. Paste the SQL query into the Supabase SQL Editor and click **Run**.
5. This automatically creates:
   - `admin_users` table with security functions
   - `volunteers` table with input constraints and RLS
   - `dirty_spot_reports` table with status tracking
   - `clean_up_schedule` table
   - `gallery` table
   - Row-Level Security (RLS) policies protecting resident privacy

---

### 4. Configure the Gallery Storage Bucket

The SQL schema will automatically register the `gallery-images` bucket. To verify in your Supabase dashboard:

1. Click on **Storage** in the left sidebar.
2. Confirm that a bucket named `gallery-images` is listed with **Public** access enabled.
3. If creating manually:
   - Click **New Bucket**.
   - Name it exactly: `gallery-images`.
   - Toggle **Public Bucket** to **ON**.
   - Click **Save**.

---

### 5. Configure Environment Variables

1. In your Supabase dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Copy your **Project URL** and **anon public key**.
3. Create a `.env` file in the root of your project (or copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

*(Note: Real keys must never be committed to public repositories).*

---

### 6. Create and Authorize the First Admin Account

To keep resident records secure, admin access is strictly authorized in the database rather than trusting client-side claims.

1. In your Supabase dashboard, navigate to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your admin email and password (e.g., `admin@society.org`).
4. Copy the generated **User UID** (a UUID like `e5b23d90-...`).
5. Go to the **SQL Editor** and run the following command to grant admin rights:

```sql
insert into public.admin_users (id, email)
values ('PASTE_USER_UID_HERE', 'admin@society.org');
```

You can now log in at the **Admin Portal** (`#admin` or click "Admin" in the navbar) using this account.

---

### 7. Run the Project Locally

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to the local URL (typically `http://localhost:5173`).

---

### 8. Build the Project for Deployment

To compile the production-ready bundle:

```bash
npm run build
```

The optimized static files will be located in the `dist/` directory, ready to deploy to Netlify, Vercel, GitHub Pages, or any static hosting service.

---

## 🧭 Application Structure

```text
src/
  components/
    Navbar.jsx          # Sticky header with leaf logo & mobile menu
    Hero.jsx            # Clean Society headline, CTA & community image
    About.jsx           # 4 cards detailing why cleanliness matters
    OurPlan.jsx         # 4-step actionable workflow with desktop connectors
    ReportForm.jsx      # Resident dirty spot report form with DB persistence
    VolunteerForm.jsx   # Volunteer sign-up form with phone validation
    WasteGuide.jsx      # Wet, Dry & Recyclable segregation guides
    Gallery.jsx         # Before & After photo gallery from Supabase
    Schedule.jsx        # Drive dates, times & meeting points from Supabase
    Footer.jsx          # Project information & quick links
  pages/
    Home.jsx            # Public single-page visitor flow
    Login.jsx           # Admin login with database role verification
    AdminDashboard.jsx  # Live stats, report updates, volunteers & gallery manager
  lib/
    supabase.js         # Supabase client initializer & config validation
  App.jsx               # Application routing and auth session handling
  main.jsx              # React DOM root entry point
  index.css             # Tailwind CSS directives & custom styling
supabase/
  schema.sql            # Complete PostgreSQL schema, tables, and RLS policies
.env.example            # Environment variables template
README.md               # Setup and user guide
```

---

## 🔒 Security Features

- **Row Level Security (RLS)** is enabled on all tables.
- **Volunteer Privacy**: Public visitors can submit sign-ups, but can never read resident names or phone numbers.
- **Report Integrity**: Public visitors can report dirty areas, but only authenticated admins can change statuses or delete records.
- **Protected Admin Authorization**: Admin verification is checked directly against the protected `admin_users` table via the `is_admin()` SQL function. Browser claims are never trusted.
- **Service-Role Safety**: The Supabase service-role key is never exposed on the client.
=======
# Community-Clean-UP
>>>>>>> c99c78eb65984fee9287b77ccc77e7b54e9803ce
