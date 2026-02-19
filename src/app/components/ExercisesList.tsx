import { ArrowLeft, Target } from 'lucide-react';
import { Button } from './ui/button';
import { ExerciseType } from '../App';

interface ExercisesListProps {
  onBack: () => void;
  onStartExercise: (type: ExerciseType) => void;
}

export default function ExercisesList({ onBack, onStartExercise }: ExercisesListProps) {
  const exercises = [
    {
      type: 'definition' as ExerciseType,
      title: 'Terminlerdine shıńıw',
      description: 'Terminlerdine hám olardıń mánislerine shıńıń',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      type: 'translation' as ExerciseType,
      title: 'Aúdarma shıńıǵıwları',
      description: 'Sózlerdi tarjıma etiw ústinde jumıs',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Shınıǵıwlar</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Shınıǵıw túrin tańlań
          </h2>
          <p className="text-gray-600">
            Ház túrli shınıǵıwlar menen biliwińizdi sınań
          </p>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise) => (
            <button
              key={exercise.type}
              onClick={() => onStartExercise(exercise.type)}
              className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="flex items-center p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${exercise.color} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {exercise.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {exercise.description}
                  </p>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Stats Card */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <div className="flex justify-center space-x-8">
              <div>
                <p className="text-3xl font-bold text-indigo-600">0</p>
                <p className="text-sm text-gray-600">Úyrenilgen</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">Juwmaqlaw</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">0</p>
                <p className="text-sm text-gray-600">Jámi</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Hámmesi úyrenilgen — shınıǵıwlar random sózlerdi qollanıwdı
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
