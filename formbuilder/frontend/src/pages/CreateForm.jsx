import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const FIELD_TYPES = ["text", "textarea", "dropdown", "checkbox"];

const emptyField = () => ({
  label: "",
  type: "text",
  options: [],
  required: false,
  _tempId: Math.random().toString(36).slice(2),
});

export default function CreateForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([emptyField()]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const addField = () => setFields((prev) => [...prev, emptyField()]);

  const removeField = (tempId) =>
    setFields((prev) => prev.filter((f) => f._tempId !== tempId));

  const updateField = (tempId, key, value) =>
    setFields((prev) =>
      prev.map((f) => (f._tempId === tempId ? { ...f, [key]: value } : f))
    );

  const updateOptions = (tempId, raw) => {
    const options = raw.split(",").map((o) => o.trim()).filter(Boolean);
    updateField(tempId, "options", options);
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required";
    fields.forEach((f, i) => {
      if (!f.label.trim()) errs[`label_${i}`] = "Field label required";
      if ((f.type === "dropdown" || f.type === "checkbox") && f.options.length === 0)
        errs[`options_${i}`] = "Add at least one option";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        fields: fields.map(({ _tempId, ...rest }) => rest),
      };
      await api.post("/forms", payload);
      navigate("/admin");
    } catch (err) {
      alert("Failed to save form.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrap page-narrow">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Form</h1>
          <p className="page-subtitle">Build your form by adding fields below</p>
        </div>
      </div>

      <div className="card">
        <h2 className="section-label">Form Details</h2>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            placeholder="e.g. Customer Feedback"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <span className="error-msg">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Optional — explain what this form is for"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="fields-section">
        <div className="fields-header">
          <h2 className="section-label">Fields</h2>
          <button onClick={addField} className="btn btn-sm btn-outline">+ Add Field</button>
        </div>

        {fields.map((field, index) => (
          <div key={field._tempId} className="field-card">
            <div className="field-card-top">
              <span className="field-number">Field {index + 1}</span>
              {fields.length > 1 && (
                <button
                  onClick={() => removeField(field._tempId)}
                  className="btn-icon btn-remove"
                  title="Remove field"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="field-row">
              <div className="form-group flex-1">
                <label>Label *</label>
                <input
                  type="text"
                  placeholder="e.g. Full Name"
                  value={field.label}
                  onChange={(e) => updateField(field._tempId, "label", e.target.value)}
                  className={errors[`label_${index}`] ? "input-error" : ""}
                />
                {errors[`label_${index}`] && (
                  <span className="error-msg">{errors[`label_${index}`]}</span>
                )}
              </div>

              <div className="form-group" style={{ minWidth: "150px" }}>
                <label>Type</label>
                <select
                  value={field.type}
                  onChange={(e) => updateField(field._tempId, "type", e.target.value)}
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(field.type === "dropdown" || field.type === "checkbox") && (
              <div className="form-group">
                <label>Options <span className="hint">(comma-separated)</span></label>
                <input
                  type="text"
                  placeholder="e.g. Option A, Option B, Option C"
                  defaultValue={field.options.join(", ")}
                  onBlur={(e) => updateOptions(field._tempId, e.target.value)}
                  className={errors[`options_${index}`] ? "input-error" : ""}
                />
                {errors[`options_${index}`] && (
                  <span className="error-msg">{errors[`options_${index}`]}</span>
                )}
                {field.options.length > 0 && (
                  <div className="options-preview">
                    {field.options.map((o) => (
                      <span key={o} className="option-tag">{o}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="form-group-inline">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(field._tempId, "required", e.target.checked)}
                />
                Required field
              </label>
            </div>
          </div>
        ))}

        <button onClick={addField} className="btn btn-outline btn-full">
          + Add Another Field
        </button>
      </div>

      <div className="form-actions">
        <button onClick={() => navigate("/admin")} className="btn btn-ghost">
          Cancel
        </button>
        <button onClick={handleSubmit} className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Form"}
        </button>
      </div>
    </div>
  );
}
