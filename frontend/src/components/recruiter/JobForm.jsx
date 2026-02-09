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
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-3">
        <h5 className="card-title mb-3">{isEditMode ? 'Edit Job' : 'Create Job'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-control"
                value={form.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-control"
                value={form.company}
                onChange={(e) => handleFieldChange('company', e.target.value)}
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={form.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Role Category</label>
              <input
                type="text"
                className="form-control"
                value={form.roleCategory}
                onChange={(e) => handleFieldChange('roleCategory', e.target.value)}
                required
              />
            </div>
          </div>

          <hr />
          <h6 className="mb-3">Required Skills</h6>

          {form.requiredSkills.map((skill, index) => (
            <div className="row g-2 mb-2" key={`${index}-${skill.name}`}>
              <div className="col-md-7">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="form-control"
                  placeholder="Weight"
                  value={skill.weight}
                  onChange={(e) => handleSkillChange(index, 'weight', e.target.value)}
                  required
                />
              </div>
              <div className="col-md-2 d-grid">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => setForm((prev) => ({ ...prev, requiredSkills: prev.requiredSkills.filter((_, i) => i !== index) }))}
                  disabled={form.requiredSkills.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setForm((prev) => ({ ...prev, requiredSkills: [...prev.requiredSkills, createEmptySkill()] }))}
            >
              Add Required Skill
            </button>
            {isEditMode && (
              <button type="button" className="btn btn-outline-secondary" onClick={onCancelEdit}>
                Cancel Edit
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
