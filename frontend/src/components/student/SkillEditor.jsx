import { useState } from 'react';

const emptySkill = { name: '', proficiency: 3 };

const SkillEditor = ({ onSave, loading = false }) => {
  const [skills, setSkills] = useState([emptySkill]);

  const handleSkillChange = (index, field, value) => {
    const next = [...skills];
    next[index] = { ...next[index], [field]: value };
    setSkills(next);
  };

  const addSkillRow = () => {
    setSkills((prev) => [...prev, emptySkill]);
  };

  const removeSkillRow = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
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
    <form className="card" onSubmit={handleSubmit}>
      <h2>Update Skills</h2>
      {skills.map((skill, index) => (
        <div className="row" key={`${index}-${skill.name}`}>
          <input
            type="text"
            placeholder="Skill name"
            value={skill.name}
            onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
            required
          />
          <select
            value={skill.proficiency}
            onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button type="button" onClick={() => removeSkillRow(index)} disabled={skills.length === 1}>
            Remove
          </button>
        </div>
      ))}
      <div className="actions">
        <button type="button" onClick={addSkillRow}>
          Add Skill
        </button>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Skills'}
        </button>
      </div>
    </form>
  );
};

export default SkillEditor;
