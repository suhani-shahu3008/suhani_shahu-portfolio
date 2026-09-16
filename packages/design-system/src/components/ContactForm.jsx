import { useState } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initial = { firstName: '', lastName: '', email: '', message: '' }

function validate(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'First name is required'
  if (!values.lastName.trim()) errors.lastName = 'Last name is required'
  if (!values.email.trim()) errors.email = 'Email is required'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter a valid email address'
  if (!values.message.trim()) errors.message = 'Message is required'
  return errors
}

/**
 * Validated web3forms.com submit — passes `accessKey` through as-is.
 * @param {{ accessKey: string, endpoint: string, subjectPrefix: string, values: object }} args
 */
async function submitToWeb3Forms({ accessKey, endpoint, subjectPrefix, values }) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `${subjectPrefix} from ${values.firstName} ${values.lastName}`,
      name: `${values.firstName} ${values.lastName}`,
      email: values.email.trim(),
      message: values.message.trim(),
    }),
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Send failed')
}

/**
 * Validated contact form (first/last name, email, message) with inline
 * errors and a submitting/sent/error button state.
 *
 * With no `accessKey`, submits are mocked (resolve after a short delay) so
 * the form is fully demoable without real credentials — pass your own
 * web3forms.com `accessKey` (https://web3forms.com) to send for real, or
 * pass `onSubmit(values)` to handle submission yourself entirely.
 *
 * @param {{
 *   accessKey?: string,
 *   endpoint?: string,
 *   subjectPrefix?: string,
 *   onSubmit?: (values: { firstName: string, lastName: string, email: string, message: string }) => Promise<void>,
 * }} props
 */
export default function ContactForm({
  accessKey,
  endpoint = 'https://api.web3forms.com/submit',
  subjectPrefix = 'New message',
  onSubmit,
}) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | sent | error

  const setField = (key) => (e) => {
    const v = e.target.value
    const next = { ...values, [key]: v }
    setValues(next)
    if (touched[key]) setErrors(validate(next))
  }

  const onBlur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    setErrors(validate(values))
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setTouched({ firstName: true, lastName: true, email: true, message: true })
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      if (onSubmit) {
        await onSubmit(values)
      } else if (accessKey) {
        await submitToWeb3Forms({ accessKey, endpoint, subjectPrefix, values })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700)) // demo mode — no accessKey configured
      }
      setStatus('sent')
      setTimeout(() => {
        setValues(initial)
        setTouched({})
        setStatus('idle')
      }, 1800)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2400)
    }
  }

  const submitting = status === 'submitting'
  const label = status === 'submitting' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : status === 'error' ? 'Failed — try again' : 'Submit'

  return (
    <form className="cf-card" noValidate onSubmit={onFormSubmit}>
      <div className="cf-row cf-row--split">
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-first">First name<span className="cf-req">*</span></label>
          <input
            id="cf-first"
            className={`cf-input${touched.firstName && errors.firstName ? ' cf-input--error' : ''}`}
            type="text"
            placeholder="Your first name*"
            value={values.firstName}
            onChange={setField('firstName')}
            onBlur={onBlur('firstName')}
            disabled={submitting}
          />
          {touched.firstName && errors.firstName && <span className="cf-error">{errors.firstName}</span>}
        </div>
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-last">Last name<span className="cf-req">*</span></label>
          <input
            id="cf-last"
            className={`cf-input${touched.lastName && errors.lastName ? ' cf-input--error' : ''}`}
            type="text"
            placeholder="Your last name*"
            value={values.lastName}
            onChange={setField('lastName')}
            onBlur={onBlur('lastName')}
            disabled={submitting}
          />
          {touched.lastName && errors.lastName && <span className="cf-error">{errors.lastName}</span>}
        </div>
      </div>

      <div className="cf-row">
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-email">Email<span className="cf-req">*</span></label>
          <input
            id="cf-email"
            className={`cf-input${touched.email && errors.email ? ' cf-input--error' : ''}`}
            type="email"
            placeholder="xyz@gmail.com"
            value={values.email}
            onChange={setField('email')}
            onBlur={onBlur('email')}
            disabled={submitting}
          />
          {touched.email && errors.email && <span className="cf-error">{errors.email}</span>}
        </div>
      </div>

      <div className="cf-row">
        <div className="cf-field">
          <label className="cf-label" htmlFor="cf-message">Message<span className="cf-req">*</span></label>
          <textarea
            id="cf-message"
            className={`cf-input cf-textarea${touched.message && errors.message ? ' cf-input--error' : ''}`}
            placeholder="Type your message..."
            rows={6}
            value={values.message}
            onChange={setField('message')}
            onBlur={onBlur('message')}
            disabled={submitting}
          />
          {touched.message && errors.message && <span className="cf-error">{errors.message}</span>}
        </div>
      </div>

      <button type="submit" className="cf-submit" disabled={submitting}>
        {label}
      </button>
    </form>
  )
}
