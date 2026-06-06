import { useNavigate } from 'react-router-dom';

import {
  Sparkles,
  CalendarDays,
  BrainCircuit,
  Clock3,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import {
  GenerationWizard,
} from '@/components/timetable/GenerationWizard';

export default function Generate() {

  const navigate =
    useNavigate();

  const handleComplete =
    (
      timetableId: string
    ) => {
      navigate(
        `/timetables/${timetableId}`
      );
    };

  const handleCancel =
    () => {
      navigate('/');
    };

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          rounded-3xl
          bg-gradient-to-r
          from-primary
          to-blue-700
          text-white
          p-8
        "
      >
        <div className="flex items-center gap-4">

          <div
            className="
              h-16
              w-16
              rounded-2xl
              bg-white/10
              flex
              items-center
              justify-center
            "
          >
            <BrainCircuit className="h-8 w-8" />
          </div>

          <div>

            <h1
              className="
                text-4xl
                font-bold
              "
            >
              Generate Timetable
            </h1>

            <p
              className="
                mt-2
                text-blue-100
                max-w-3xl
              "
            >
              Generate conflict-free examination schedules
              using Greedy Graph Coloring. Configure your
              examination period and automatically create
              optimized exam slots.
            </p>

          </div>

        </div>
      </div>

      {/* FEATURES */}

      {/* <div
        className="
          grid
          md:grid-cols-3
          gap-4
        "
      >

        <Card>

          <CardContent className="p-6">

            <div className="flex items-center gap-3">

              <Sparkles
                className="
                  h-8
                  w-8
                  text-primary
                "
              />

              <div>

                <p className="font-semibold">
                  Conflict Free
                </p>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  No overlapping exams
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="p-6">

            <div className="flex items-center gap-3">

              <CalendarDays
                className="
                  h-8
                  w-8
                  text-teal-500
                "
              />

              <div>

                <p className="font-semibold">
                  Smart Scheduling
                </p>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Automatic slot assignment
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="p-6">

            <div className="flex items-center gap-3">

              <Clock3
                className="
                  h-8
                  w-8
                  text-orange-500
                "
              />

              <div>

                <p className="font-semibold">
                  Fast Generation
                </p>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  Results in seconds
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div> */}

      {/* ALGORITHM INFO */}

      {/* <Card>

        <CardContent className="p-6">

          <div className="space-y-2">

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Greedy Graph Coloring Algorithm
            </h2>

            <p
              className="
                text-muted-foreground
              "
            >
              Each course is represented as a vertex.
              Courses sharing students create edges.
              The greedy coloring algorithm assigns
              colors (exam slots) ensuring that
              adjacent vertices never receive the same
              color.
            </p>

          </div>

        </CardContent>

      </Card> */}

      {/* WIZARD */}

      <GenerationWizard
        onComplete={
          handleComplete
        }
        onCancel={
          handleCancel
        }
      />

    </div>
  );
}