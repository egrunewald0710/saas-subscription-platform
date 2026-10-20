import { useState, type FormEvent } from "react";
import type { Customer } from "../types";

export default function CustomerForm({ customer, onSave, onCancel }: { customer?: Customer; onSave: (value: Pick<Customer, "name" | "email" | "company">) => void; onCancel: () => void }) {
  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [company, setCompany] = useState(customer?.company ?? "");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ name: name.trim(), email: email.trim(), company: company.trim() });
  };
  return <form onSubmit={submit} className="form-stack">
    <label className="form-field"><span>Customer name</span><input required minLength={2} value={name} onChange={(event) => setName(event.target.value)} autoFocus /></label>
    <label className="form-field"><span>Email address</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
    <label className="form-field"><span>Company</span><input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company or organisation" /></label>
    <div className="modal-actions"><button type="button" className="button-secondary" onClick={onCancel}>Cancel</button><button type="submit" className="button-primary">{customer ? "Save customer" : "Add customer"}</button></div>
  </form>;
}
