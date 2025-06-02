import React, { useEffect, useState } from 'react';
import { fetchRatingById, updateRating } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';

const SUBJECTS = [
  'Mathematics',
  'Web Programming',
  'Project Management',
  'Computer Networks',
  'English'
];

export default function RatingForm() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [group, setGroup]   = useState('');
  const [subjects, setSubjects] = useState({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const r = await fetchRatingById(id);
        setGroup(r.group || '');
        setSubjects(r.subjects || {});
      } catch (e) {
        console.error(e);
        alert('Ошибка при загрузке формы: ' + e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleChange(e, subj, field) {
    const value = Number(e.target.value);
    setSubjects(prev => ({
      ...prev,
      [subj]: {
        ...prev[subj],
        [field]: value
      }
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateRating(id, { group, subjects });
      nav('/ratings');
    } catch (e) {
      console.error(e);
      alert('Ошибка при сохранении: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading form…</p>;

  return (
    <section className="form-edit">
      <h2>Edit Rating</h2>
      <form onSubmit={onSubmit}>
        <label>
          Group:
          <input
            type="text"
            value={group}
            onChange={e => setGroup(e.target.value)}
            required
          />
        </label>

        {SUBJECTS.map(subj => {
          const s = subjects[subj] || { lab1:0,lab2:0,lab3:0,lab4:0,lab5:0, test:0 };
          return (
            <fieldset key={subj}>
              <legend>{subj}</legend>
              {[1,2,3,4,5].map(i => (
                <label key={i}>
                  Lab {i}
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={s[`lab${i}`]}
                    onChange={e => handleChange(e, subj, `lab${i}`)}
                  />
                </label>
              ))}
              <label>
                Test
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={s.test}
                  onChange={e => handleChange(e, subj, 'test')}
                />
              </label>
            </fieldset>
          );
        })}

        <button type="submit" className="btn">Save</button>
        <button
          type="button"
          className="btn"
          onClick={() => nav('/ratings')}
        >
          Cancel
        </button>
      </form>
    </section>
  );
}
