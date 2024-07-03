import { TimesheetWeekDemo } from "@/components/time-reg/demo/timesheet-week-demo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginButton = () => {
  return (
    <Button asChild variant="outline">
      <Link href="/login/google" prefetch={false}>
        Log in
      </Link>
    </Button>
  );
};

export default async function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <ClockIcon className="h-6 w-6" />
          <span className="sr-only">Time Tracker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <LoginButton />
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px] justify-center">
              <div className="flex flex-col justify-start space-y-4">
                <div className="space-y-2 text-balance">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Effortless Time Tracking
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline your workflow and stay on top of your time with
                    our intuitive time tracking application.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild>
                    <Link href="#" prefetch={false}>
                      Sign Up
                    </Link>
                  </Button>
                  <LoginButton />
                </div>
              </div>

              <TimesheetWeekDemo />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Streamline Your Time Tracking
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our time tracking application offers a range of features to
                  help you stay organized and productive.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 grid-cols-2 lg:gap-12">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <ClockIcon className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Intuitive Time Tracking</h3>
                  <p className="text-muted-foreground">
                    Log your time with ease using our intuitive time tracking
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <CalendarDaysIcon className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Detailed Reporting</h3>
                  <p className="text-muted-foreground">
                    View detailed reports on your time spent with optional per
                    task and project tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get Started Today
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sign up for our time tracking application and start
                  streamlining your workflow.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild>
                  <Link href="#" prefetch={false}>
                    Sign Up
                  </Link>
                </Button>
                <LoginButton />
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Time Tracker. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer> */}
    </div>
  );
}

function CalendarDaysIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
