import type { User } from "../../../shared/api/types";
import { AppBackground } from "../../../shared/components/AppBackground";
import { DashboardHeader } from "../../dashboard/components/DashboardHeader";

interface ProfilePageProps {
    user: User;
    onLogout: () => void;
}

export function ProfilePage({ user, onLogout }: ProfilePageProps) {
    return (
        <div className="min-h-screen bg-[#020202] text-white relative overflow-hidden">
            <AppBackground />

            <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-2 pb-24">
                <DashboardHeader
                    user={user}
                    onLogout={onLogout}
                    sectionLabel="Profile"
                    showDashboardItem={true}
                />

                <main className="mt-16">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                            Account
                        </p>
                        <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-white/90">
                            Profile
                        </h1>
                        <p className="mt-3 text-base text-slate-400">
                            Your account details in one place.
                        </p>
                    </div>

                    <section className="rounded-[2rem] border border-white/[0.06] bg-white/[0.02] p-6 md:p-8 backdrop-blur-md">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
                                <p className="mt-2 text-lg font-medium text-slate-100">{user.displayName}</p>
                            </div>

                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Education level</p>
                                <p className="mt-2 text-lg font-medium text-slate-100">{user.educationLevel}</p>
                            </div>

                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4 sm:col-span-2">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                                <p className="mt-2 text-lg font-medium text-slate-100 break-all">{user.email}</p>
                            </div>
                        </div>
                    </section>
                </div>
                </main>
            </div>
        </div>
    );
}
