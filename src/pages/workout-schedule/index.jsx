import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

const TrainingCalendar = () => {
    const [schedule, setSchedule] = useState({});
    const [selectedDay, setSelectedDay] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newWorkoutData, setNewWorkoutData] = useState({ title: '', category: 'Strength', duration: '30 min' });

    /* --- Date Generation --- */
    // Generate next 30 days
    const upcomingDays = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            date: d,
            id: d.toISOString().split('T')[0], // YYYY-MM-DD
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: d.getDate()
        };
    });

    /* --- Effects --- */
    // Load schedule from local storage
    useEffect(() => {
        const saved = localStorage.getItem('user_training_schedule');
        if (saved) {
            setSchedule(JSON.parse(saved));
        }
    }, []);

    /* --- Event Handlers --- */
    const handleSaveWorkout = () => {
        if (!selectedDay || !newWorkoutData.title) return;

        const updatedSchedule = {
            ...schedule,
            [selectedDay]: {
                ...newWorkoutData,
                completed: false
            }
        };

        setSchedule(updatedSchedule);
        localStorage.setItem('user_training_schedule', JSON.stringify(updatedSchedule));
        setIsEditing(false);
        setNewWorkoutData({ title: '', category: 'Strength', duration: '30 min' });
    };

    const toggleComplete = (dateId) => {
        const dayData = schedule[dateId];
        if (!dayData) return;

        const updatedSchedule = {
            ...schedule,
            [dateId]: {
                ...dayData,
                completed: !dayData.completed
            }
        };
        setSchedule(updatedSchedule);
        localStorage.setItem('user_training_schedule', JSON.stringify(updatedSchedule));
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Header />

            <main className="pt-24 px-4 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Training Calendar</h1>
                        <p className="text-slate-500">Plan your week. crush your goals.</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold text-blue-600">
                            {Object.values(schedule).filter(s => s.completed).length} WORKOUTS COMPLETED
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingDays.map((day) => {
                        const workout = schedule[day.id];
                        const isToday = day.id === new Date().toISOString().split('T')[0];
                        const isSelected = selectedDay === day.id;

                        return (
                            <div
                                key={day.id}
                                onClick={() => !workout && setSelectedDay(day.id)}
                                className={`
                  relative min-h-[160px] p-6 rounded-2xl transition-all duration-300 border-2 cursor-pointer group flex flex-col
                  ${workout?.completed
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                        : isToday
                                            ? 'bg-white border-blue-400 ring-4 ring-blue-50'
                                            : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'}
                `}
                            >
                                {/* Date Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-bold tracking-wider uppercase ${workout?.completed ? 'text-blue-200' : 'text-slate-400'}`}>
                                            {day.dayName}
                                        </span>
                                        <span className={`text-2xl font-bold ${workout?.completed ? 'text-white' : 'text-slate-800'}`}>
                                            {day.dayNumber}
                                        </span>
                                    </div>

                                    {isToday && !workout?.completed && (
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">TODAY</span>
                                    )}

                                    {workout?.completed && <Icon name="Check" size={24} className="text-white" />}
                                </div>

                                {/* Content */}
                                {workout ? (
                                    <div className="relative z-10">
                                        <h3 className={`font-bold text-lg mb-1 ${workout.completed ? 'text-white' : 'text-slate-800'}`}>
                                            {workout.title}
                                        </h3>
                                        <div className={`text-sm mb-4 ${workout.completed ? 'text-blue-100' : 'text-slate-500'}`}>
                                            {workout.category} • {workout.duration}
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleComplete(day.id);
                                            }}
                                            className={`
                        w-full py-2 rounded-lg font-bold text-sm transition-colors
                        ${workout.completed
                                                    ? 'bg-white/20 text-white hover:bg-white/30'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
                      `}
                                        >
                                            {workout.completed ? 'UNDO COMPLETE' : 'MARK COMPLETE'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center">
                                        {isSelected ? (
                                            <div
                                                className="w-full"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    autoFocus
                                                    placeholder="Workout Name..."
                                                    className="w-full text-sm border-b-2 border-blue-500 focus:outline-none mb-2 pb-1"
                                                    value={newWorkoutData.title}
                                                    onChange={(e) => setNewWorkoutData({ ...newWorkoutData, title: e.target.value })}
                                                />
                                                <div className="flex gap-2 text-xs">
                                                    <button
                                                        onClick={handleSaveWorkout}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded flex-1"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedDay(null)}
                                                        className="bg-slate-100 text-slate-600 px-3 py-1 rounded flex-1"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-300 group-hover:text-blue-400 transition-colors">
                                                <Icon name="Plus" size={32} />
                                                <span className="text-xs font-bold mt-2">ADD WORKOUT</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default TrainingCalendar;
