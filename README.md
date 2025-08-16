# 🎓 COLLEGEBUDDY

**A comprehensive digital platform for colleges to manage academic lectures, events, and student activities with role-based access and real-time analytics.**

![COLLEGEBUDDY Banner](https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=COLLEGEBUDDY+-+College+Management+Platform)

## ✨ Features

### 🔐 Authentication & User Roles
- **Multi-Role Support**: Super Admin, College Admin, Faculty, Students
- **Secure Login**: College ID + Password, Google SSO, OTP verification
- **Advanced Security**: 2FA support, email verification, password reset
- **Role-Based Dashboards**: Customized interfaces for each user type

### 📚 Lecture Management
- **Faculty Tools**: Upload schedules, notes (PDF, PPT, video), record attendance
- **Student Access**: View timetables, access lectures, join live classes
- **Live Integration**: Zoom/Google Meet integration for virtual classes
- **Attendance Tracking**: Automated attendance with percentage calculations

### 🎉 Event & Activity Management
- **Event Creation**: College Admins can create, edit, and delete events
- **Student Engagement**: Online registration, event reminders, participation tracking
- **Achievement System**: Badges, activity points, and achievement history
- **Media Gallery**: Photos and videos from college events

### 📊 Reports & Analytics
- **Attendance Analytics**: Per subject and overall attendance tracking
- **Participation Stats**: Student engagement metrics for events
- **Interactive Dashboards**: Charts and analytics on student engagement
- **Export Capabilities**: Generate and download comprehensive reports

### 🔔 Communication & Notifications
- **Digital Notice Board**: Centralized announcements and notices
- **Multi-Channel Notifications**: Email, SMS, and push notifications
- **Real-Time Updates**: Instant notifications for lectures, events, and updates
- **Search & Filter**: Advanced search for lectures, events, and notices

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Headless UI, Heroicons
- **Charts**: Chart.js with React Chart.js 2
- **Animations**: Framer Motion
- **State Management**: React Context API

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with RLS
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime subscriptions

### Deployment & Infrastructure
- **Hosting**: Vercel (Frontend)
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network
- **Analytics**: Built-in dashboard analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aaryanbane07/collegebuddy.git
   cd collegebuddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   - Configure Row Level Security policies as needed

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
collegebuddy/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   ├── student/                  # Student dashboard & features
│   ├── faculty/                  # Faculty dashboard & features
│   ├── college/                  # College admin dashboard
│   ├── admin/                    # Super admin dashboard
│   ├── providers/                # React context providers
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
├── lib/                         # Utility functions & configurations
├── database/                    # Database schema & migrations
├── public/                      # Static assets
├── types/                       # TypeScript type definitions
└── README.md
```

## 🎯 User Roles & Permissions

### 👑 Super Admin
- Manage multiple colleges
- System-wide analytics and reports
- User role management
- Platform configuration

### 🏫 College Admin
- Manage college events and announcements
- Monitor lecture uploads and attendance
- Generate college-specific reports
- Manage faculty and student accounts

### 👨‍🏫 Faculty
- Create and manage lecture schedules
- Upload lecture materials (notes, videos)
- Record and track student attendance
- View student participation analytics

### 🎓 Students
- Access lecture timetables and materials
- Join live classes and view recordings
- Register for college events
- Track personal attendance and achievements

## 🔧 Configuration

### Database Setup
1. Create a Supabase project
2. Run the schema from `database/schema.sql`
3. Configure authentication providers
4. Set up storage buckets for file uploads

### Authentication Setup
- **Email/Password**: Enabled by default
- **Google SSO**: Configure OAuth credentials
- **OTP**: Set up SMS provider (optional)
- **2FA**: Configure TOTP settings

### File Upload Configuration
- Maximum file size: 10MB (configurable)
- Supported formats: PDF, DOC, DOCX, PPT, PPTX, MP4, AVI, MOV
- Storage: Supabase Storage with CDN

## 📱 Mobile Responsiveness

COLLEGEBUDDY is built with a mobile-first approach:
- Responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized performance on mobile devices
- Progressive Web App (PWA) capabilities

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **Data Encryption**: Encrypted data storage and transmission
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting for security
- **CORS Configuration**: Proper cross-origin resource sharing

## 📊 Analytics & Reporting

### Student Analytics
- Attendance percentage tracking
- Event participation metrics
- Achievement progress
- Academic performance insights

### Faculty Analytics
- Lecture delivery statistics
- Student engagement metrics
- Attendance trends
- Content upload analytics

### College Analytics
- Overall attendance rates
- Event participation statistics
- Faculty performance metrics
- Student engagement trends

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Configure environment variables**
   - Add all environment variables in Vercel dashboard
   - Ensure Supabase URLs are correctly configured

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- UI components from [Headless UI](https://headlessui.com/)
- Icons by [Heroicons](https://heroicons.com/)
- Deployed on [Vercel](https://vercel.com/)

## 📞 Support

For support, email support@collegebuddy.com or join our [Discord community](https://discord.gg/collegebuddy).

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with LMS platforms
- [ ] AI-powered insights
- [ ] Multi-language support
- [ ] Offline capabilities

---

**Built with ❤️ by [Aaryan Bane](https://github.com/aaryanbane07)**

⭐ Star this repository if you find it helpful!