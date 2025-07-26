import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react"; // 👈 Import Lucide icons
import '../styles/Forms.css';

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    reg_no: "",
    email: "",
    contact_no: "",
    department: "",
    batch: "",
    purpose: "",
    society_name: "",
    lecturer_in_charge: "",
    password: ""
  });

  const [regSuffix, setRegSuffix] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 For password toggle

  const departmentCodes = {
    "CIS": "CIS",
    "Software Engineering": "SE",
    "Data Science": "DS"
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reg_no = `${formData.batch}${departmentCodes[formData.department] || ""}${regSuffix}`;

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          reg_no,
          user_type: "Student"
        })
      });

      if (response.ok) {
        setMessage("✅ Student added successfully");
        setMessageType("success");
        setFormData({
          name: "",
          reg_no: "",
          email: "",
          contact_no: "",
          department: "",
          batch: "",
          purpose: "",
          society_name: "",
          lecturer_in_charge: "",
          password: ""
        });
        setRegSuffix("");
      } else {
        const data = await response.json();
        setMessage("❌ Failed to add student: " + (data.error || "Unknown error"));
        setMessageType("error");
      }
    } catch (err) {
      console.error("❌ Failed to add student:", err);
      setMessage("❌ Failed to add student");
      setMessageType("error");
    }
  };

  const regPrefix = `${formData.batch || ""}${departmentCodes[formData.department] || ""}`;
  const fullRegNo = `${regPrefix}${regSuffix}`;

  return (
    <div className="fm-form-card">
      <div className="fm-form-header">
        <h2 className="fm-form-title">Add New Student</h2>
        <div className="fm-form-icon">👨‍🎓</div>
      </div>

      {message && (
        <div className={`fm-message ${messageType === "success" ? "fm-message-success" : "fm-message-error"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="fm-form-group">
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Name</label>
          <div className="fm-form-line"></div>
        </div>

        <div className="fm-form-group">
          <select name="department" value={formData.department} onChange={handleChange} className="fm-form-select" required>
            <option value="">Select Department</option>
            <option value="CIS">CIS</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Data Science">Data Science</option>
          </select>
          <div className="fm-select-arrow">▼</div>
        </div>

        <div className="fm-form-group">
          <select name="batch" value={formData.batch} onChange={handleChange} className="fm-form-select" required>
            <option value="">Select Batch</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
          </select>
          <div className="fm-select-arrow">▼</div>
        </div>

        <div className="fm-form-group">
          <input
            type="text"
            value={fullRegNo}
            onChange={(e) => {
              const fullValue = e.target.value.toUpperCase();
              const prefix = `${formData.batch || ""}${departmentCodes[formData.department] || ""}`;

              if (!formData.batch || !formData.department) return;

              if (fullValue.startsWith(prefix)) {
                const suffix = fullValue.slice(prefix.length).replace(/\D/g, "").slice(0, 3);
                setRegSuffix(suffix);
              } else {
                setRegSuffix("");
              }
            }}
            className="fm-form-input"
            placeholder=" "
            required
            disabled={!formData.batch || !formData.department}
          />
          <label className="fm-form-label">Registration Number</label>
          <div className="fm-form-line"></div>
        </div>

        <div className="fm-form-group">
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Email</label>
          <div className="fm-form-line"></div>
        </div>

        <div className="fm-form-group">
          <input type="text" name="contact_no" value={formData.contact_no} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Contact Number</label>
          <div className="fm-form-line"></div>
        </div>

        <div className="fm-form-group">
          <input type="text" name="lecturer_in_charge" value={formData.lecturer_in_charge} onChange={handleChange} className="fm-form-input" placeholder=" " required />
          <label className="fm-form-label">Lecturer in Charge</label>
          <div className="fm-form-line"></div>
        </div>

        <div className="fm-form-group">
          <select name="purpose" value={formData.purpose} onChange={handleChange} className="fm-form-select">
            <option value="">Select Purpose</option>
            <option value="None">None</option>
            <option value="Chair">Chair</option>
            <option value="Rep">Rep</option>
          </select>
          <div className="fm-select-arrow">▼</div>
        </div>

        {formData.purpose === "Chair" && (
          <div className="fm-form-group">
            <input type="text" name="society_name" value={formData.society_name} onChange={handleChange} className="fm-form-input" placeholder=" " required />
            <label className="fm-form-label">Society Name</label>
            <div className="fm-form-line"></div>
          </div>
        )}

        <div className="fm-form-group" style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="fm-form-input"
            placeholder=" "
            required
          />
          <label className="fm-form-label">Temporary Password</label>
          <div className="fm-form-line"></div>
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "#666"
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="fm-form-button-container">
          <button type="submit" className="fm-form-button">
            <span>Confirm</span>
            <div className="fm-button-effect"></div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;
