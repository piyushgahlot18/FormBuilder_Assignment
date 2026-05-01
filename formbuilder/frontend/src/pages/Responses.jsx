import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function Responses() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/forms/${formId}`), api.get(`/responses/${formId}`)])
      .then(([formRes, respRes]) => {
        setForm(formRes.data);
        setResponses(respRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [formId]);

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div>
          <Link to="/admin" className="back-link">← All Forms</Link>
          <h1 className="page-title">{form?.title}</h1>
          <p className="page-subtitle">
            {responses.length} response{responses.length !== 1 ? "s" : ""} collected
          </p>
        </div>
        <a
          href={`/form/${formId}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline"
        >
          View Form ↗
        </a>
      </div>

      {responses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <h3>No responses yet</h3>
          <p>Share the form link to start collecting responses</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/form/${formId}`);
              alert("Link copied!");
            }}
            className="btn btn-outline"
          >
            Copy Form Link
          </button>
        </div>
      ) : (
        <div className="responses-list">
          {responses.map((resp, i) => (
            <div key={resp._id} className="response-card">
              <div className="response-header">
                <span className="response-number">Response #{responses.length - i}</span>
                <span className="response-date">
                  {new Date(resp.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="response-answers">
                {resp.answers.map((ans, j) => (
                  <div key={j} className="answer-row">
                    <span className="answer-label">{ans.fieldLabel}</span>
                    <span className="answer-value">
                      {Array.isArray(ans.value)
                        ? ans.value.join(", ") || <em>No selection</em>
                        : ans.value || <em>—</em>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
