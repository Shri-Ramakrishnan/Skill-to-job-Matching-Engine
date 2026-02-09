import { useEffect, useMemo, useState } from 'react';

const createEmptySkill = () => ({ name: '', weight: 5 });

const buildInitialForm = () => ({
  title: '',
  company: '',
  description: '',
  location: '',
  roleCategory: '',
  requiredSkills: [createEmptySkill()]
});

const JobForm = ({ onSubmit, loading = false, initialValue = null, onCancelEdit }) => {
  const [form, setForm] = useState(initialValue || buildInitialForm());

  const isEditMode = useMemo(() => Boolean(initialValue && initialValue._id), [initialValue]);

  useEffect(() => {
    setForm(initialValue || buildInitialForm());
  }, [initialValue]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillChange = (index, field, value) => {
    const nextSkills = [...form.requiredSkills];
    nextSkills[index] = { ...nextSkills[index], [field]: value };
    setForm((prev) => ({ ...prev, requiredSkills: nextSkills }));
  };

  const addSkill = () => {
    setForm((prev) => ({ ...prev, requiredSkills: [...prev.requiredSkills, createEmptySkill()] }));
  };

  const removeSkill = (index) => {
    setForm((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      requiredSkills: form.requiredSkills
        .map((skill) => ({ name: skill.name.trim(), weight: Number(skill.weight) }))
        .filter((skill) => skill.name)
    };

    onSubmit(payload);

    if (!isEditMode) {
      setForm(buildInitialForm());
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{isEditMode ? 'Edit Job' : 'Create Job'}</h2>
      <input
        type="text"
        placeholder="Job title"
        value={form.title}
        onChange={(e) => handleFieldChange('title', e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Company"
        value={form.company}
        onChange={(e) => handleFieldChange('company', e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => handleFieldChange('description', e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={form.location}
        onChange={(e) => handleFieldChange('location', e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Role category"
        value={form.roleCategory}
        onChange={(e) => handleFieldChange('roleCategory', e.target.value)}
        required
      />

      <h3>Required Skills</h3>
      {form.requiredSkills.map((skill, index) => (
        <div className="row" key={`${index}-${skill.name}`}>
          <input
            type="text"
            placeholder="Skill name"
            value={skill.name}
            onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            max="10"
            value={skill.weight}
            onChange={(e) => handleSkillChange(index, 'weight', e.target.value)}
            required
          />
          <button type="button" onClick={() => removeSkill(index)} disabled={form.requiredSkills.length === 1}>
            Remove
          </button>
        </div>
      ))}

      <div className="actions">
        <button type="button" onClick={addSkill}>
          Add Required Skill
        </button>
        {isEditMode && (
          <button type="button" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditMode ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
