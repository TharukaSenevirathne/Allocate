import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import "../styles/StaffList.css"; // reuse existing styles

const StudentListStaff = () => {
  const [sortBy, setSortBy] = useState("name");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/students?type=student`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();

      const sorted = [...data].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "department") return a.department.localeCompare(b.department);
        if (sortBy === "reg_no") return a.reg_no.localeCompare(b.reg_no);
        return 0;
      });

      setStudentData(sorted);
      setError(null);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [sortBy]);

  const handleSortChange = (field) => {
    setSortBy(field);
    setIsDropdownOpen(false);
  };

  return (
    <div className="staff-page-wrapper">
      <div className="staff-page-inner">
        <h1 className="staff-page-title">Student Management</h1>

        <div className="staff-list-container">
          <div className="staff-list-card">
            <div className="staff-list-header">
              <h2 className="staff-list-title">Student Members</h2>
            </div>

            <div className="sort-container">
              <div className="sort-dropdown">
                <button
                  className="sort-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Sort By <ChevronDownIcon className="sort-icon" />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={() => handleSortChange("name")}>
                      Name
                    </div>
                    <div className="dropdown-item" onClick={() => handleSortChange("department")}>
                      Department
                    </div>
                    <div className="dropdown-item" onClick={() => handleSortChange("reg_no")}>
                      Registration No.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="staff-table-container">
              {loading ? (
                <p className="loading-message">Loading student data...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : studentData.length === 0 ? (
                <p className="loading-message">No students found.</p>
              ) : (
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>Reg. No</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th>Contact No.</th>
                      <th>Batch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.map((student, index) => (
                      <tr key={student.user_id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                        <td>{student.reg_no}</td>
                        <td>{student.name}</td>
                        <td>{student.department}</td>
                        <td>{student.email}</td>
                        <td>{student.contact_no}</td>
                        <td>{student.batch}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentListStaff;
