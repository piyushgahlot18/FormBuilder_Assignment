import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function FormsList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [origin, setOrigin] = useState(window.location.origin); // fallback
  const [copied, setCopied] = useState(null);
  const [shareModal, setShareModal] = useState(null); // { id, url }

  const fetchForms = async () => {
    try {
      const { data } = await api.get("/forms");
      setForms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the real LAN IP from backend so links work on any device
  const fetchOrigin = async () => {
    try {
      const { data } = await api.get("/config/host");
      if (data.origin) setOrigin(data.origin);
    } catch {
      // silently fall back to window.location.origin (localhost)
    }
  };

  useEffect(() => {
    fetchForms();
    fetchOrigin();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this form and all its responses?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/forms/${id}`);
      setForms((prev) => prev.filter((f) => f._id !== id));
    } catch {
      alert("Failed to delete form.");
    } finally {
      setDeletingId(null);
    }
  };

  const getFormUrl = (id) => `${origin}/form/${id}`;

  const copyLink = async (id) => {
    const url = getFormUrl(id);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback for browsers that block clipboard without HTTPS
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const openShareModal = (id) => setShareModal({ id, url: getFormUrl(id) });

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <h1 className="page-title">Your Forms</h1>
          <p className="page-subtitle">{forms.length} form{forms.length !== 1 ? "s" : ""} created</p>
        </div>
        <Link to="/admin/create" className="btn btn-primary">+ Create Form</Link>
      </div>

      {forms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <h3>No forms yet</h3>
          <p>Create your first form to get started</p>
          <Link to="/admin/create" className="btn btn-primary">Create Form</Link>
        </div>
      ) : (
        <div className="forms-grid">
          {forms.map((form) => (
            <div key={form._id} className="form-card">
              <div className="form-card-header">
                <span className="field-count">{form.fields.length} field{form.fields.length !== 1 ? "s" : ""}</span>
              </div>
              <h3 className="form-card-title">{form.title}</h3>
              <p className="form-card-desc">{form.description || <em>No description</em>}</p>

              {/* Shareable link preview */}
              <div className="share-url-bar" onClick={() => openShareModal(form._id)} title="Click to share">
                <span className="share-url-icon">🔗</span>
                <span className="share-url-text">{getFormUrl(form._id)}</span>
              </div>

              <div className="form-card-meta">
                <span>{new Date(form.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="form-card-actions">
                <a href={getFormUrl(form._id)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">
                  Preview
                </a>
                <button
                  onClick={() => copyLink(form._id)}
                  className={`btn btn-sm ${copied === form._id ? "btn-success" : "btn-outline"}`}
                >
                  {copied === form._id ? "✓ Copied!" : "Copy Link"}
                </button>
                <button onClick={() => openShareModal(form._id)} className="btn btn-sm btn-outline">
                  Share
                </button>
                <Link to={`/admin/responses/${form._id}`} className="btn btn-sm btn-secondary">
                  Responses
                </Link>
                <button
                  onClick={() => handleDelete(form._id)}
                  className="btn btn-sm btn-danger"
                  disabled={deletingId === form._id}
                >
                  {deletingId === form._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {shareModal && (
        <div className="modal-overlay" onClick={() => setShareModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Form</h3>
              <button className="modal-close" onClick={() => setShareModal(null)}>✕</button>
            </div>
            <p className="modal-desc">
              Anyone on your <strong>local network</strong> can open this link on their phone, tablet, or computer:
            </p>
            <div className="modal-url-box">
              <span>{shareModal.url}</span>
            </div>
            <div className="modal-note">
              💡 Make sure both devices are on the <strong>same Wi-Fi</strong>. For internet access, deploy to a cloud host or use a tunnel like <code>ngrok</code>.
            </div>
            <div className="modal-actions">
              <button
                onClick={() => { copyLink(shareModal.id); }}
                className="btn btn-primary btn-full"
              >
                {copied === shareModal.id ? "✓ Copied!" : "Copy Link"}
              </button>
              <a
                href={shareModal.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-full"
              >
                Open in New Tab ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
