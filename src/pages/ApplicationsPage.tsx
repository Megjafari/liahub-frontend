import { useState, useEffect } from 'react'
import { useApplications } from '../hooks/useApplications'
import { supabase } from '../services/supabase'
import type { Application } from '../types'
import PageTransition from '../components/PageTransition'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const STATUSES = ['Sökt', 'Intervju', 'Erbjudande', 'Avslag']

const STATUS_COLORS: Record<string, string> = {
  'Sökt': 'bg-blue-900 text-blue-300',
  'Intervju': 'bg-yellow-900 text-yellow-300',
  'Erbjudande': 'bg-green-900 text-green-300',
  'Avslag': 'bg-red-900 text-red-300',
}

const SOURCES = ['LinkedIn', 'Arbetsförmedlingen', 'Indeed', 'Företagets webbsida', 'Annat']

export default function ApplicationsPage() {
  const { applications, loading, updateStatus, deleteApplication, createManualApplication } = useApplications()
  const [session, setSession] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    jobTitle: '',
    employer: '',
    location: '',
    source: '',
    link: '',
    notes: '',
    status: '',
    contactName: '',
    contactEmail: '',
    appliedDate: '',
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  const handleSubmit = async () => {
    if (!form.jobTitle || !form.employer) return
    await createManualApplication(form)
    setForm({ jobTitle: '', employer: '', location: '', source: '', link: '', notes: '', status: '', contactName: '', contactEmail: '', appliedDate: '' })
    setShowForm(false)
  }

  if (!session) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Du måste vara inloggad för att se dina ansökningar.</p>
      </div>
    )
  }

  if (loading) return <p className="text-gray-400">Laddar ansökningar...</p>

  return (
    <PageTransition>
      <div className="space-y-8 max-w-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mina ansökningar</h1>
            <p className="text-gray-400 mt-2">
              {applications.length} {applications.length === 1 ? 'ansökan' : 'ansökningar'}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            + Lägg till ansökan
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-white">Lägg till ansökan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Jobbtitel *"
                value={form.jobTitle}
                onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <input
                placeholder="Företag *"
                value={form.employer}
                onChange={e => setForm(f => ({ ...f, employer: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <input
                placeholder="Stad (valfritt)"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <select
                value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Välj källa...</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                placeholder="Länk till annons (valfritt)"
                value={form.link}
                onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />

              <DatePicker
                selected={form.appliedDate ? new Date(form.appliedDate) : null}
                onChange={(date: Date | null) => setForm(f => ({ ...f, appliedDate: date ? date.toISOString().split('T')[0] : '' }))}
                placeholderText="Datum ansökt"
                dateFormat="yyyy-MM-dd"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                calendarClassName="dark-calendar"
                maxDate={new Date()}
              />

              <input
                placeholder="Kontaktperson (valfritt)"
                value={form.contactName}
                onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <input
                placeholder="E-post till kontakt (valfritt)"
                value={form.contactEmail}
                onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Välj status...</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <textarea
              placeholder="Anteckningar (t.ex. vem du pratade med eller nästa steg)"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Spara
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Avbryt
              </button>
            </div>
          </div>
        )}

        {applications.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">Du har inte loggat någon ansökan ännu.</p>
            <p className="text-gray-500 text-sm mt-2">Markera ett jobb som "Sökt" från jobblistan eller lägg till manuellt.</p>
          </div>
        )}

        <div className="space-y-4">
          {applications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              onUpdateStatus={updateStatus}
              onDelete={deleteApplication}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

function ApplicationCard({ application, onUpdateStatus, onDelete }: {
  application: Application
  onUpdateStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-white">{application.jobTitle}</h2>
            {application.isManual && (
              <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">Manuell</span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">{application.employer}</p>
          <div className="flex flex-wrap gap-3 mt-1">
            {application.location && (
              <p className="text-xs text-gray-500">{application.location}</p>
            )}
            {application.source && (
              <p className="text-xs text-gray-500">via {application.source}</p>
            )}
            <p className="text-xs text-gray-500">
              {new Date(application.appliedAt).toLocaleDateString('sv-SE')}
            </p>
          </div>
          {application.notes && (
            <p className="text-xs text-gray-500 mt-2 italic">{application.notes}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${STATUS_COLORS[application.status]}`}>
          {application.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map(status => (
          <button
            key={status}
            onClick={() => onUpdateStatus(application.id, status)}
            className={`text-xs px-3 py-1 rounded-lg border transition ${
              application.status === status
                ? 'border-blue-500 text-blue-300 bg-blue-900'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {application.link ? (
          <a
            href={application.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            Visa annonsen →
          </a>
        ) : !application.isManual && (
          <a
            href={`https://arbetsformedlingen.se/platsbanken/annonser/${application.externalJobId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            Visa annonsen →
          </a>
        )}
        <button
          onClick={() => onDelete(application.id)}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          Ta bort
        </button>
      </div>
    </div>
  )
}