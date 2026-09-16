import { ContactForm as DSContactForm } from '../../packages/design-system/src/index.js'

// Kept local (not in packages/design-system) so the real access key never
// ships inside the shared design-system bundle — see ContactForm's
// `onSubmit` prop in the package for why.
const WEB3FORMS_ACCESS_KEY = 'c9f6d11f-38bb-49ab-b90b-a7667f112ca4'

async function onSubmit(values) {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `New message from ${values.firstName} ${values.lastName} (portfolio site)`,
      name: `${values.firstName} ${values.lastName}`,
      email: values.email.trim(),
      message: values.message.trim(),
    }),
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Send failed')
}

export default function ContactForm() {
  return <DSContactForm onSubmit={onSubmit} />
}
