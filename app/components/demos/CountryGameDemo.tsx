'use client'

import { CountryGame } from '../ui/CountryGame'
import { COUNTRIES_DATA } from '../../data/mock-data'

/**
 * Demo component showcasing the CountryGame functionality
 */
export function CountryGameDemo() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Country Capital Quiz Game</h3>
        <p className="text-gray-600 mb-6">
          Test your geography knowledge! This game demonstrates component composition by combining 
          form inputs, toast notifications, progress bars, and star ratings into a cohesive experience.
        </p>
        
        <CountryGame 
          countries={COUNTRIES_DATA}
          questionsPerGame={10}
          timePerQuestion={30}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Component Composition Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Form Integration:</strong> Uses input components for answer submission</li>
          <li>• <strong>Toast Notifications:</strong> Provides feedback using the centralized toast system</li>
          <li>• <strong>Progress Visualization:</strong> Multiple progress bars for game progress and timer</li>
          <li>• <strong>Star Rating Display:</strong> Shows performance rating at game completion</li>
          <li>• <strong>State Management:</strong> Clean game state with score tracking and question flow</li>
          <li>• <strong>Responsive Design:</strong> Adapts to different screen sizes seamlessly</li>
        </ul>
      </div>
    </div>
  )
}
