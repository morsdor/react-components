'use client'

import { useState } from 'react'
import { Tabs } from '../ui/Tabs'

/**
 * Demo component showcasing the Tabs functionality
 */
export function TabsDemo() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Project Overview</h3>
          <p className="text-gray-600">
            This is the overview tab content. It provides a high-level summary of the project,
            including key objectives, timeline, and stakeholders involved.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Project started in Q1 2024</li>
            <li>Expected completion by Q4 2024</li>
            <li>Team of 8 developers and designers</li>
            <li>Budget allocation of $500K</li>
          </ul>
        </div>
      )
    },
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Project Details</h3>
          <p className="text-gray-600">
            Detailed information about the project specifications, requirements, and technical implementation.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Technical Stack</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Frontend:</strong> React, TypeScript, Tailwind CSS
              </div>
              <div>
                <strong>Backend:</strong> Node.js, Express, PostgreSQL
              </div>
              <div>
                <strong>Deployment:</strong> Vercel, AWS RDS
              </div>
              <div>
                <strong>Testing:</strong> Jest, Cypress, React Testing Library
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'team',
      label: 'Team',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Alice Johnson', role: 'Project Manager', email: 'alice@example.com' },
              { name: 'Bob Smith', role: 'Lead Developer', email: 'bob@example.com' },
              { name: 'Carol Davis', role: 'UI/UX Designer', email: 'carol@example.com' },
              { name: 'David Wilson', role: 'Backend Developer', email: 'david@example.com' }
            ].map((member) => (
              <div key={member.name} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
                <p className="text-sm text-blue-600">{member.email}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Project Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                defaultValue="Advanced React Components Portfolio"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                defaultValue="A comprehensive showcase of advanced React components demonstrating frontend engineering expertise."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="public" className="rounded" />
              <label htmlFor="public" className="text-sm text-gray-700">
                Make project public
              </label>
            </div>
            
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Accessible Tabs Demo</h3>
        <p className="text-gray-600 mb-6">
          Current active tab: <strong>{activeTab}</strong>
        </p>
        
        <Tabs
          tabs={tabs}
          defaultTab="overview"
          onChange={setActiveTab}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Keyboard Navigation:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">←</kbd> <kbd className="bg-gray-200 px-2 py-1 rounded">→</kbd> Navigate between tabs</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">Home</kbd> Go to first tab</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">End</kbd> Go to last tab</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">Tab</kbd> Move focus to tab panel content</li>
          <li>• Follows WAI-ARIA tablist design patterns</li>
        </ul>
      </div>
    </div>
  )
}
