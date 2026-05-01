import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function FillForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/forms/${id}`)
      .then(({ data }) => {
        setForm(data);
        const initial = {};
        data.fields.forEach((f) => {
          initial[f.label] = f.type === "checkbox" ? [] : "";
        });
        setAnswers(initial);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (label, value) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
    setErrors((prev) => ({ ...prev, [label]: null }));
  };

  const handleCheckbox = (label, option, checked) => {
    setAnswers((prev) => {
      const current = prev[label] || [];
      return {
        ...prev,
        [label]: checked ? [...current, option] : current.filter((v) => v !== option),
      };
    });
    setErrors((prev) => ({ ...prev, [label]: null }));
  };

  const validate = () => {
    const errs = {};
    form.fields.forEach((f) => {
      if (f.required) {
        const val = answers[f.label];
        if (f.type === "checkbox" && val.length === 0) errs[f.label] = "Select at least one option";
        else if (!val || val === "") errs[f.label] = "This field is required";
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        formId: id,
        answers: Object.entries(answers).map(([fieldLabel, value]) => ({ fieldLabel, value })),
      };
      await api.post("/responses", payload);
      setSubmitted(true);
    } catch (err) {
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;
  if (notFound) return (
    <div className="page-wrap page-narrow">
      <div className="empty-state">
        <div className="empty-icon">⚠</div>
        <h3>Form not found</h3>
        <p>This form may have been deleted or the link is incorrect.</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="page-wrap page-narrow">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Response Submitted!</h2>
        <p>Thank you for filling out <strong>{form.title}</strong>.</p>
        <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="btn btn-outline">
          Submit Another
        </button>
      </div>
    </div>
  );

  return (
    <div className="page-wrap page-narrow fill-form-page">
      <div className="form-hero">
        <h1 className="form-title">{form.title}</h1>
        {form.description && <p className="form-desc">{form.description}</p>}
      </div>

      <form className="card fill-form" onSubmit={handleSubmit}>
        {form.fields.map((field, i) => (
          <div key={i} className="form-group">
            <label>
              {field.label}
              {field.required && <span className="required-star">*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={answers[field.label] || ""}
                onChange={(e) => handleChange(field.label, e.target.value)}
                className={errors[field.label] ? "input-error" : ""}
              />
            )}

            {field.type === "textarea" && (
              <textarea
                rows={4}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={answers[field.label] || ""}
                onChange={(e) => handleChange(field.label, e.target.value)}
                className={errors[field.label] ? "input-error" : ""}
              />
            )}

            {field.type === "dropdown" && (
              <select
                value={answers[field.label] || ""}
                onChange={(e) => handleChange(field.label, e.target.value)}
                className={errors[field.label] ? "input-error" : ""}
              >
                <option value="">-- Select an option --</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {field.type === "checkbox" && (
              <div className="checkbox-group">
                {field.options.map((opt) => (
                  <label key={opt} className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={(answers[field.label] || []).includes(opt)}
                      onChange={(e) => handleCheckbox(field.label, opt, e.target.checked)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {errors[field.label] && <span className="error-msg">{errors[field.label]}</span>}
          </div>
        ))}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Response"}
          </button>
        </div>
      </form>
    </div>
  );
}
