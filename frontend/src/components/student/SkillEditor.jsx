import { useState } from 'react';

const createEmptySkill = () => ({ name: '', proficiency: 3 });

const SkillEditor = ({ onSave, loading = false }) => {
  const [skills, setSkills] = useState([createEmptySkill()]);

  const handleSkillChange = (index, field, value) => {
    const next = [...skills];
    next[index] = { ...next[index], [field]: value };
    setSkills(next);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedSkills = skills
      .map((skill) => ({
        name: skill.name.trim(),
        proficiency: Number(skill.proficiency)
      }))
      .filter((skill) => skill.name);

    onSave(cleanedSkills);
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-3">
        <h5 className="card-title mb-3">Update Skills</h5>
        <form onSubmit={handleSubmit}>
          {skills.map((skill, index) => (
            <div className="row g-2 mb-2 align-items-end" key={`${index}-${skill.name}`}>
              <div className="col-md-7">
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Proficiency</label>
                <select
                  className="form-select"
                  value={skill.proficiency}
                  onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
              <div className="col-md-2 d-grid">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => setSkills((prev) => prev.filter((_, i) => i !== index))}
                  disabled={skills.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setSkills((prev) => [...prev, createEmptySkill()])}
            >
              Add Skill
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Skills'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillEditor;
