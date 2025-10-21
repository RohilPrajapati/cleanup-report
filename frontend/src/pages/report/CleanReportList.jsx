import React, { useState, useEffect } from "react";
import { fetchCleanUpReport, triggerCleanUpReport } from "./api/call";
import { notification } from 'antd';

const CleanUpReportList = () => {
  const [reports, setReports] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch reports with proper async handling
  const fetchReports = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCleanUpReport(page);
      setReports(res.data.results || res.data.data || []);
      setMeta(res.data.meta || res.data.pagination || {});
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to fetch cleanup reports:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const triggerCleanUp = async (page = 1) => {
    await triggerCleanUpReport().then((res) => {
      notification.success({
        message: "Request Successfully Submitted",
        description: null,
        duration: 4,
        placement: 'topRight',
        style: { zIndex: 99999 }
      });
    }).catch((err) => {
      console.log("inside error")
      console.error(err);

      const detail = err.response?.data?.detail || 'Please check your input and try again.';
      console.log(detail)
      notification.error({
        message: detail,
        description: null,
        duration: 4,
        placement: 'topRight',
        style: { zIndex: 99999 }
      });
    });
    await fetchReports(page);
  };

  // ✅ Only run once on mount
  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Pagination
  const handlePageChange = (page) => {
    if (page > 0 && (!meta?.last_page || page <= meta.last_page)) {
      fetchReports(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="report-container">
        <div className="loading-wrapper">
          <div className="spinner-large"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="report-container">
        <div className="error-wrapper">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#e53e3e" strokeWidth="2" />
            <path
              d="M12 8V12M12 16H12.01"
              stroke="#e53e3e"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h3>Error Loading Reports</h3>
          <p>{error}</p>
          <button onClick={() => fetchReports()} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main render
  return (
    <div className="report-container">
      <div className="report-header">
        <div className="header-content">
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="9"
                y="3"
                width="6"
                height="4"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M9 13H15M9 17H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="header-title">Cleanup Reports</h1>
            <p className="header-subtitle">
              Showing {meta?.from || 0} to {meta?.to || 0} of{" "}
              {meta?.total || 0} reports
            </p>
          </div>
        </div>
        <button
          onClick={() => triggerCleanUp(currentPage)}
          className="refresh-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12C4 7.58172 7.58172 4 12 4C14.5264 4 16.7792 5.17108 18.2454 7M20 12C20 16.4183 16.4183 20 12 20C9.47362 20 7.22082 18.8289 5.75463 17M20 7V4M20 4H17M4 17V20M4 20H7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Request Clean Up
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21M23 21V19C23 17.5 22 16 20.5 15.5M16 3.13C17.5 3.63 18.5 5 18.5 6.5C18.5 8 17.5 9.37 16 9.87M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="stat-label">Total Reports</p>
            <p className="stat-value">{meta?.total || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pages">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="stat-label">Total Pages</p>
            <p className="stat-value">{meta?.last_page || 0}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Timestamp</th>
              <th>Users Deleted</th>
              <th>Active Users</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  <span className="id-badge">#{report.id}</span>
                </td>
                <td>
                  <div className="timestamp-cell">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M12 6V12L16 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    {formatDate(report.timestamp)}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${report.users_deleted > 0
                      ? "badge-warning"
                      : "badge-success"
                      }`}
                  >
                    {report.users_deleted}
                  </span>
                </td>
                <td>
                  <span className="active-users">
                    {report.active_users_remaining}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!meta.previous_page}
            className="pagination-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Previous
          </button>

          <div className="pagination-info">
            <span className="page-text">
              Page <strong>{meta.current_page}</strong> of{" "}
              <strong>{meta.last_page}</strong>
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!meta.next_page}
            className="pagination-button"
          >
            Next
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default CleanUpReportList;
