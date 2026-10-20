import { LifeBuoy, Mail, MessageCircle } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";

const faqs = [
  { question: "How do I add a new subscription?", answer: "Open Overview or Subscriptions and choose New subscription. Select an existing customer or add a new customer, choose a plan and billing interval, then save." },
  { question: "How can I update a customer's plan?", answer: "Open Subscriptions, select the subscription you want to change and choose Edit subscription. Changes are saved to this demo workspace." },
  { question: "Where can I find invoice details?", answer: "Open Invoices and select an invoice number to review its customer, dates, status and amount. Use Download or Print to export the invoice." },
  { question: "Can I change plan pricing?", answer: "Yes. Visit Plans & pricing, select Edit plan, then update the monthly and annual prices. Existing subscriptions retain their current amount." },
  { question: "Where is my dashboard data stored?", answer: "This frontend demo stores customer, subscription, plan and invoice changes in your browser's local storage. No data is sent to a server." },
  { question: "How do I reset demo data?", answer: "Clear this site's local storage in your browser's developer tools and reload the page to restore the original demo data." },
];

export default function HelpSupport() {
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return faqs.filter((faq) => !query || `${faq.question} ${faq.answer}`.toLowerCase().includes(query));
  }, [search]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("Thanks for reaching out. Your support request is ready in this demo.");
    setName(""); setEmail(""); setMessage("");
  };
  return <>
    <PageHeader eyebrow="WE'RE HERE TO HELP" title="Help & support" description="Find answers, learn the basics or send a note to our team." />
    <div className="help-intro"><div className="help-intro-icon"><LifeBuoy size={23} /></div><div><strong>How can we help you today?</strong><p>Search our help center or send us a message.</p></div><SearchBar value={search} onChange={setSearch} placeholder="Search help articles..." label="Search help articles" /></div>
    <div className="help-grid"><section className="panel help-panel"><div className="panel-kicker">HELP CENTER</div><h2>Frequently asked questions<span className="title-period">.</span></h2>{visible.length ? <div className="faq-list">{visible.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div> : <p className="panel-description">No articles matched. Try a different search.</p>}</section>
      <section className="panel help-panel"><div className="help-contact-icon"><MessageCircle size={20} /></div><div className="panel-kicker">CONTACT SUPPORT</div><h2>Send us a message<span className="title-period">.</span></h2><p className="panel-description">Tell us what you need help with and we'll get back to you.</p>{feedback && <p className="feedback-message" role="status">{feedback}</p>}
        <form className="form-stack" onSubmit={submit}><label className="form-field"><span>Your name</span><input required minLength={2} value={name} onChange={(event) => setName(event.target.value)} /></label><label className="form-field"><span>Email address</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="form-field"><span>How can we help?</span><textarea required minLength={10} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} /></label><button className="button-primary" type="submit"><Mail size={16} />Send message</button></form>
      </section></div>
  </>;
}
