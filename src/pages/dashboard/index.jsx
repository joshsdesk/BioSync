import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WelcomeHeader from './components/WelcomeHeader';
import QuickStatsCard from './components/QuickStatsCard';
import ActionCard from './components/ActionCard';
import RecentSessionCard from './components/RecentSessionCard';
import PerformanceChart from './components/PerformanceChart';
import ProgressWidget from './components/ProgressWidget';
import FloatingActionButton from '../../components/FloatingActionButton';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Add missing variable declarations
  const overallProgress = {
    current: "85%",
    previous: "78%",
    trend: "up"
  };

  const streak = {
    days: 7,
    previous: 5,
    trend: "up"
  };

  const totalSessions = {
    current: "47",
    previous: "38",
    trend: "up"
  };

  const averageScore = {
    current: "81.2",
    previous: "75.8",
    trend: "up"
  };

  // Mock data
  const recentSessions = [
    {
      id: 1,
      sport: "Basketball Shooting",
      date: "Oct 21, 2024",
      score: 88,
      duration: "12 min",
      focusArea: "Shooting Form",
      improvements: 12,
      analysisType: "Full Body",
      thumbnail: "https://images.unsplash.com/photo-1725448874174-c30e486f430d",
      thumbnailAlt: "Basketball player in mid-shot position on outdoor court with orange basketball"
    },
    {
      id: 2,
      sport: "Tennis Serve",
      date: "Oct 20, 2024",
      score: 75,
      duration: "8 min",
      focusArea: "Shoulder Rotation",
      improvements: 5,
      analysisType: "Upper Body",
      thumbnail: "https://images.unsplash.com/photo-1697364814827-4f9cdf58030a",
      thumbnailAlt: "Tennis player in white outfit serving on professional tennis court"
    },
    {
      id: 3,
      sport: "Running Gait",
      date: "Oct 19, 2024",
      score: 92,
      duration: "15 min",
      focusArea: "Stride Analysis",
      improvements: 8,
      analysisType: "Lower Body",
      thumbnail: "https://images.unsplash.com/photo-1726195221456-7e104a23bbff",
      thumbnailAlt: "Athletic woman in running gear jogging on outdoor track during daytime"
    },
    {
      id: 4,
      sport: "Golf Swing",
      date: "Oct 18, 2024",
      score: 67,
      duration: "10 min",
      focusArea: "Hip Rotation",
      improvements: 0,
      analysisType: "Full Body",
      thumbnail: "https://images.unsplash.com/photo-1657369447939-e4e0bc3a75b3",
      thumbnailAlt: "Golfer in mid-swing position on green golf course with club raised"
    }
  ];

  const actionItems = [
    {
      title: "Record New Movement",
      description: "Capture real-time video for instant biomechanical analysis and feedback",
      icon: "Video",
      route: "/video-capture",
      stats: { value: "2.5s", label: "Avg Analysis" },
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Upload Video",
      description: "Upload existing footage for detailed movement analysis and insights",
      icon: "Upload",
      route: "/video-upload",
      stats: { value: "HD", label: "Quality" },
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "AI Performance Coach",
      description: "Get personalized coaching powered by advanced AI analysis and recommendations",
      icon: "Brain",
      route: "/ai-coach",
      stats: { value: "24/7", label: "Available" },
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Session History",
      description: "Review past analyses, track progress, and compare performance over time",
      icon: "History",
      route: "/session-history",
      stats: { value: recentSessions?.length || 0, label: "Sessions" },
      gradient: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-20 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <WelcomeHeader />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <QuickStatsCard
              title="Overall Progress"
              value={overallProgress?.current}
              previousValue={overallProgress?.previous}
              trend={overallProgress?.trend}
              icon="TrendingUp"
              subtitle="This month"
              trendValue="+7%"
            />
            <QuickStatsCard
              title="Current Streak"
              value={`${streak?.days} days`}
              previousValue={`${streak?.previous} days`}
              trend={streak?.trend}
              icon="Calendar"
              subtitle="Active days"
              trendValue="+2"
            />
            <QuickStatsCard
              title="Total Sessions"
              value={totalSessions?.current}
              previousValue={totalSessions?.previous}
              trend={totalSessions?.trend}
              icon="Activity"
              subtitle="This month"
              trendValue="+9"
            />
            <QuickStatsCard
              title="Avg Score"
              value={averageScore?.current}
              previousValue={averageScore?.previous}
              trend={averageScore?.trend}
              icon="Target"
              subtitle="Biomech rating"
              trendValue="+5.4"
            />
          </div>

          {/* Action Cards */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {actionItems?.map((item, index) => (
                <ActionCard
                  key={index}
                  title={item?.title}
                  description={item?.description}
                  icon={item?.icon}
                  route={item?.route}
                  stats={item?.stats}
                  gradient={item?.gradient}
                />
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Performance & Stats */}
            <div className="lg:col-span-2 space-y-8">
              {/* Performance Chart */}
              <PerformanceChart />

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStatsCard
                  title="Total Sessions"
                  value="47"
                  subtitle="This month"
                  icon="Activity"
                  trend="up"
                  trendValue="+23%"
                  color="primary" />

                <QuickStatsCard
                  title="Avg Score"
                  value="81.2"
                  subtitle="Biomech rating"
                  icon="Target"
                  trend="up"
                  trendValue="+12%"
                  color="success" />

                <QuickStatsCard
                  title="Streak Days"
                  value="7"
                  subtitle="Current streak"
                  icon="Flame"
                  trend="up"
                  trendValue="+2"
                  color="warning" />

                <QuickStatsCard
                  title="Focus Areas"
                  value="4"
                  subtitle="Improving"
                  icon="TrendingUp"
                  trend="up"
                  trendValue="+1"
                  color="accent" />

              </div>

              {/* Recent Sessions */}
              <div className="bg-surface rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Recent Sessions</h3>
                    <p className="text-sm text-muted-foreground">Your latest biomechanical analyses</p>
                  </div>
                  <button
                    onClick={() => window.location.href = '/session-history'}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">

                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {recentSessions?.map((session) =>
                    <RecentSessionCard key={session?.id} session={session} />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Progress Widget */}
            <div className="lg:col-span-1">
              <ProgressWidget />
            </div>
          </div>
        </div>
      </main>
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;