# BioSync - Master Application Specification

> **STATUS**: DRAFT (Generated prior to user validation of key questions)
> **VERSION**: 1.0.0
> **DATE**: 2025-12-12

---

## AUTHENTICITY & ENGINEERING STANDARDS
This specification adheres to strict professional software engineering standards. All described architectures utilize real, implementable patterns (React, Supabase, Google Gemini, TensorFlow.js/MediaPipe). No "magic" AI features are assumed; all AI functionality is based on available API capabilities (Gemini 1.5 Pro/Flash) and client-side computer vision libraries.

---

## SECTION 1 — RESEARCH & VALIDATION

### 1.1 Market Analysis
The sports technology market is shifting from expensive hardware (sensors/wearables) to software-based computer vision.
- **Trend**: Democratization of biomechanics analysis via mobile devices.
- **Gap**: Existing apps are either too simple (basic video playback) or too complex/expensive for pro-sumers (Dartfish, Hudl). BioSync fills the "affordable professional AI coaching" niche.

### 1.2 Competitor Evaluation
- **Hudl Technique**: strong video tools, low AI automation.
- **Dartfish**: High-end, expensive, desktop-focused.
- **Onform**: Mobile-first, storage-focused, limited generative AI feedback.
- **BioSync Advantage**: First-mover in combining **Generative Multimodal AI (Gemini)** with **Traditional Computer Vision (MediaPipe)** for holistic coaching (visual + verbal).

### 1.3 Target User Segments
- **Primary (Mobile)**: Individual athletes (Amateur to Semi-Pro) looking for self-improvement.
- **Secondary (Desktop)**: Clinics, Physios, and Remote Coaches who need a dashboard to manage patient/athlete data.

### 1.4 Feasibility Review
- **Video Storage**: Solved via Supabase Storage (scalable, S3-backed).
- **AI Analysis**: Solved via Google Gemini 1.5 Pro (Multimodal video-to-text).
- **Real-time CV**: Feasible via MediaPipe (Client-side, low latency on modern mobile).
- **Cost**: Low operational cost (serverless functions, client-side processing) allows for Freemium implementation.

---

## SECTION 2 — APP OVERVIEW AND PURPOSE

### 2.1 Identity
- **App Name**: BioSync
- **Tagline**: Train. Track. Transform.

### 2.2 Core Concept
A comprehensive "Central Brain" web platform that serves as the intelligence hub for athletic biomechanics. It transforms a smartphone camera into an elite coach, while simultaneously aggregating deep user data and usage analytics for platform owners and future investors.


### 2.3 User Value
- **Instant Feedback**: No waiting for a human coach to review footage.
- **Objective Data**: Joint angles and velocity metrics replace subjective "feeling."
- **Personalization**: AI remembers past sessions and adapts advice over time.

### 2.4 KPIs & Objectives
- **Activation**: 80% of signups complete their first video analysis within 10 minutes.
- **Retention**: 40% of users record >1 session per week.
- **Performance**: Analysis generation time < 45 seconds per minute of video.

---

## SECTION 3 — USER FLOWS & FUNCTIONALITY

### 3.1 Core User Stories
1.  **"As an athlete, I want to record my squat so I can see if my depth is correct."**
2.  **"As a runner, I want to upload a race video to get tips on my stride length."**
3.  **"As a user, I want to see my progress over time to know if I'm improving."**

### 3.2 End-to-End Workflows

#### A. The "Capture & Analyze" Loop
1.  **Initiate**: User opens "Record" page. Permissions granted.
2.  **Setup**: Select Sport (e.g., "Squat"). Overlay guide appears.
3.  **Action**: User presses Record. Client-side model (MediaPipe) tracks potential captured reps.
4.  **Finish**: Stop recording.
5.  **Processing**:
    - Video compressed client-side (FFmpeg WASM).
    - Uploaded to Supabase Storage.
    - Trigger `analyzeVideoMovement` cloud function (Gemini).
6.  **Result**: Notification > Results Page.
    - Skeleton replay.
    - Text summary of "Critical Faults".
    - 0-100 Score.

#### B. The "Upload & Review" Loop
1.  **Upload**: Select file > `VideoUpload` Page.
2.  **Metadata**: Tag sport, date, intensity.
3.  **Compute**: `analysisService` processes file.
4.  **Feedback**: User views detailed textual critique and frame-by-frame breakdown.

---

## SECTION 4 — UI/UX DESIGN

### 4.1 Navigation Structure
- **Global Header**: Logo, contextual actions (User Profile).
- **Bottom Tab Bar (Mobile)** / **Sidebar (Desktop)**:
    1.  **Dashboard**: Metrics, Recent Activity.
    2.  **Record**: Camera interface.
    3.  **Upload**: File picker.
    4.  **History**: Calendar/List view.
    5.  **Profile**: Biometrics, Settings.

### 4.2 Screens & Experience
### 4.2 Screens & Experience
- **Primary Interaction**: Video Overlay with AI Coaching. The "Central Brain" provides direct visual feedback over the video.
- **Dark Mode Default**: "Cyber-physical" aesthetic (Black/Slate background, Neon Green/Blue accents).
- **Responsive**: Tailwind CSS fluid typography.
- **Feedback**: Skeletal overlays (SVG/Canvas) drawn directly over video elements.

---

## SECTION 5 — TECHNICAL SPECIFICATIONS + CLEAN-CODE STANDARDS

### 5.1 Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **State Management**: React Context (Auth), Local State (Components).
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **AI/ML**: 
    - **Cloud**: Google Gemini 1.5 Pro (via API).
    - **Edge**: MediaPipe / TensorFlow.js (future implementation).
- **Processing**: FFmpeg.wasm (Client-side compression).

### 5.2 Directory Hierarchy (Enforced)
```
src/
├── components/      # Global shared components (Button, Header)
│   ├── ui/          # Atomic primitives
│   └── layout/      # Structure components
├── contexts/        # React Contexts (AuthContext)
├── hooks/           # Custom Reusable Hooks (useMedia, useAuth)
├── lib/             # Third-party client config (supabase, gemini)
├── pages/           # Route-views (Dashboard, VideoUpload)
│   └── [feature]/   # Co-located feature components
├── services/        # Business logic & API calls (Separation of Concern)
└── utils/           # Pure helper functions
```

### 5.3 Database Schema (Supabase)
- **`profiles`**: `id` (PK, ref auth.users), `username`, `full_name`, `avatar_url`.
- **`sessions`**: `id` (PK), `user_id`, `video_url`, `thumbnail_url`, `sport`, `created_at`.
- **`analyses`**: `id` (PK), `session_id`, `raw_ai_output` (JSON), `score` (int), `status`.
- **`sports`**: `id`, `name`, `category`, `is_custom`.

### 5.4 API & Data Contracts
- **Service Layer Pattern**: UI components *never* call Supabase/Gemini directly. They import `services/xyzService.js`.
- **JSDoc Enforced**: All service methods must return typed Promises (e.g., `Promise<AnalysisResult>`).

### 5.5 Security
- **RLS (Row Level Security)**: Enabled on all Supabase tables. Users can only SELECT/INSERT/UPDATE their own data.
- **Env Vars**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GEMINI_API_KEY` (Proxied in production via Edge Functions recommended).

---

## SECTION 6 — TESTING & QUALITY ASSURANCE

### 6.1 Requirements
- **Unit Tests**: Jest/Vitest for `services/*.js` helpers.
- **Linting**: ESLint + Prettier enabled with "fix on save".
- **Pre-commit**: Husky hook to run linter before commit.

### 6.2 Test Flow
1.  **Static Analysis**: `npm run lint` (Checks standard JS rules).
2.  **Build Verification**: `npm run build` (Ensures no bundling errors).
3.  **Manual QA**: "Golden Path" smoke test (Login -> Upload -> Analyze).

---

## SECTION 7 — PERFORMANCE OPTIMIZATION

### 7.1 Benchmarks
- **Lighthouse Score**: > 90 in Performance/Accessibility.
- **Time-to-Interactive**: < 1.5s on 4G networks.
- **Video Load**: Lazy loaded thumbnails; HLS streaming for long videos (future).

### 7.2 Optimization Strategy
- **Code Splitting**: React.lazy() for heavy routes (`AnalysisResults`).
- **Asset Optimization**: WebP for images, FFmpeg compression for user uploads before sending to network.
- **Caching**: React Query (or custom hooks) to cache profile/session data.

---

## SECTION 8 — PRIVACY & COMPLIANCE

### 8.1 Data Policy
- **Video Retention**: User owns video data. Videos deleted upon account deletion.
- **AI Processing**: Videos sent to Gemini API are *stateless* (dependent on Google's Enterprise Data Policy - checking "Do Not Train" settings).
- **Consent**: Explicit "Allow Camera" prompt (Browser API).

---

## SECTION 9 — AI CODE GENERATION PROMPTS

### 9.1 Backend/Service Prompt Template
```text
"Generate a Javascript service module for [Feature Name] that uses the Supabase client. 
Must include JSDoc for all methods. 
Handle errors with a try-catch block returning a standardized error object. 
Do not mock data; write actual API calls."
```

### 9.2 Frontend Component Prompt Template
```text
"Create a React functional component named [ComponentName]. 
Use Tailwind CSS for styling. 
Accept props: [Prop List]. 
Implement proper loading/error states. 
Use the 'lucide-react' library for icons."
```

---

## SECTION 10 — MONETIZATION & MARKETING (ON HOLD)

> **NOTE**: Monetization logic is active but simplified. Use "Coming Soon" placeholders for actual payment processing.

### 10.1 Monetization Model
- **Strategy**: Free Trial followed by Subscription options.
- **Tiers**:
    - **Free Trial**: Full access for limited time/sessions.
    - **Subscription**: Daily, Weekly, Monthly, or Yearly billing cycles.
- **Current Implementation**: "Coming Soon" placeholder UI for subscription pages to capture intent without processing payments.

### 10.2 Owner & Investor Analytics ("The Brain")
The Web App serves as the central "Brain" for the business, providing deep insights for owners and investors:
- **User Growth Dashboards**: Real-time tracking of signups, retention, and churn.
- **Engagement Metrics**: Heatmaps of most analyzed sports, average session duration, and feature usage.
- **Data Asset Value**: Aggregated (anonymized) biomechanical datasets that increase proprietary value for future investment rounds.
- **System Health**: Error rates, API costs per user, and processing latency tracking.

### 10.3 Go-to-Market
- **Launch**: Beta release to functional fitness communities (CrossFit, Powerlifting).
- **Growth**: "Share execution" feature (watermarked video with overlay) for social viral loop.


---

## SECTION 11 — FUTURE ENHANCEMENTS & ROADMAP

1.  **Q1 2026 - Edge AI**: Move basic pose detection to device (TF.js) to reduce API costs.
2.  **Q2 2026 - Comparisons**: "Side-by-side" view with pro athletes.
3.  **Q3 2026 - Team Mode**: Coach dashboard for multiple athletes.

---

## SECTION 12 — DELIVERABLE SUMMARY

- [x] **Codebase**: React/Vite PWA (`src/`).
- [x] **Documentation**: `README.md`, `to-do.md`, `master_specification.md` (This file).
- [ ] **Tests**: Unit test suite (Partial).
- [x] **Infrastructure**: Supabase Project (Auth, DB, Storage).

---

## SECTION 13 — CONFIRMED REQUIREMENTS

1.  **Platform**: Hybrid approach. Mobile-first for athletes, Desktop for Clinics/Physios.
2.  **Monetization**: Free Trial -> Daily/Weekly/Monthly/Yearly subscriptions.
3.  **UI Focus**: Overlay + AI Coaching is the core value.
4.  **Implementation Strategy**: "Coming Soon" placeholders for advanced features (Subscriptions, Clinic Dashboard) to allow for immediate deployment of the core app while keeping the vision visible.

---
**END OF SPECIFICATION**
