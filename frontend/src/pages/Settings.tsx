import { useState, type FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Settings() {
  const { preferences: saved, updatePreferences } = useDashboardData();
  const [draft, setDraft] = useState(saved);
  const [feedback, setFeedback] = useState("");
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updatePreferences(draft);
    } catch {
      return;
    }
    setFeedback("Your settings have been saved.");
    window.setTimeout(() => setFeedback(""), 3000);
  };
  const cancel = () => { setDraft(saved); setFeedback(""); };
  return <>
    <PageHeader eyebrow="WORKSPACE PREFERENCES" title="Settings" description="Manage your workspace profile and account preferences." />
    {feedback && <p className="feedback-message" role="status">{feedback}</p>}
    <form className="settings-form" onSubmit={save}>
      <section className="panel settings-section"><div className="settings-section-heading"><div><div className="panel-kicker">WORKSPACE PROFILE</div><h2>Workspace details</h2><p className="panel-description">These details are visible to your team.</p></div></div>
        <label className="form-field"><span>Workspace name</span><input required minLength={2} value={draft.workspace} onChange={(event) => setDraft({ ...draft, workspace: event.target.value })} /></label>
        <label className="form-field"><span>Account email</span><input required type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
        <label className="form-field"><span>Timezone</span><select value={draft.timezone} onChange={(event) => setDraft({ ...draft, timezone: event.target.value })}><option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option><option value="Europe/London">Europe/London (GMT)</option><option value="America/New_York">America/New_York (ET)</option><option value="UTC">UTC</option></select></label>
      </section>
      <section className="panel settings-section"><div className="settings-section-heading"><div><div className="panel-kicker">NOTIFICATIONS</div><h2>Keep me in the loop</h2><p className="panel-description">Choose which updates you receive.</p></div></div>
        <label className="toggle-row"><span><strong>Billing updates</strong><small>Payment issues, renewals and invoice activity.</small></span><input type="checkbox" checked={draft.billingUpdates} onChange={(event) => setDraft({ ...draft, billingUpdates: event.target.checked })} /></label>
        <label className="toggle-row"><span><strong>Product news</strong><small>Occasional product updates and feature announcements.</small></span><input type="checkbox" checked={draft.productNews} onChange={(event) => setDraft({ ...draft, productNews: event.target.checked })} /></label>
      </section>
      <section className="panel settings-section"><div className="settings-section-heading"><div><div className="panel-kicker">APPEARANCE</div><h2>Make it yours</h2><p className="panel-description">Choose how comfortable your dashboard feels.</p></div></div>
        <label className="form-field"><span>Dashboard density</span><select value={draft.appearance} onChange={(event) => setDraft({ ...draft, appearance: event.target.value as typeof draft.appearance })}><option value="light">Standard</option><option value="comfortable">Comfortable spacing</option></select></label>
      </section>
      <div className="settings-actions"><button type="button" className="button-secondary" onClick={cancel}>Cancel</button><button type="submit" className="button-primary">Save changes</button></div>
    </form>
  </>;
}
